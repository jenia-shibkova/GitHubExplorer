import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import type { GithubRepo } from '@/api/types';
import { useResolvedTheme } from '@/theme/colors';
import { AvatarDefaultSvg } from '@/assets/avatar-default';
import { LIST_AVATAR_SIZE, formatCount, formatRelativeDate, withAvatarSize } from '@utils/format';
import { styles } from './styles';

interface Props {
  repo: GithubRepo;
  onPress: (repo: GithubRepo) => void;
}

const MAX_AVATAR_RETRIES = 1;
// FastImage has no request timeout of its own — a genuinely dead connection
// (offline, no route) can sit "in flight" for the OS's own default, which
// is tens of seconds, not the few hundred ms a broken image should take to
// give up on. Without this, retrying just means waiting through that twice
// before the fallback icon shows. We enforce our own short deadline instead
// and treat "still nothing after this long" the same as an explicit error.
const AVATAR_LOAD_TIMEOUT_MS = 3000;

function RepoListItemComponent({ repo, onPress }: Props) {
  const { colors } = useResolvedTheme();
  const [avatarFailed, setAvatarFailed] = useState(false);
  // A failure here is often just a dropped request under load — a fast
  // scroll firing off avatars for a screenful of rows at once — not a real
  // "this image doesn't exist". Give it one retry (remounting FastImage via
  // `key`) before committing to the fallback icon; that's what previously
  // made the list show the placeholder for a repo whose detail screen (a
  // fresh, unburdened request) loaded the same avatar just fine seconds
  // later.
  const [retryCount, setRetryCount] = useState(0);
  const hasAvatarUrl = Boolean(repo.owner.avatar_url);
  const loadedRef = useRef(false);

  const handleAvatarError = useCallback(() => {
    setRetryCount(count => {
      if (count < MAX_AVATAR_RETRIES) return count + 1;
      setAvatarFailed(true);
      return count;
    });
  }, []);

  useEffect(() => {
    if (!hasAvatarUrl || avatarFailed) return;
    loadedRef.current = false;
    const timeout = setTimeout(() => {
      if (!loadedRef.current) handleAvatarError();
    }, AVATAR_LOAD_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [hasAvatarUrl, avatarFailed, retryCount, handleAvatarError]);

  return (
    <Pressable
      onPress={() => onPress(repo)}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border, opacity: pressed ? 0.6 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Open ${repo.full_name}`}
    >
      {hasAvatarUrl && !avatarFailed ? (
        <FastImage
          key={retryCount}
          source={{
            uri: withAvatarSize(repo.owner.avatar_url, LIST_AVATAR_SIZE),
            priority: FastImage.priority.normal,
          }}
          style={styles.avatar}
          resizeMode={FastImage.resizeMode.cover}
          accessibilityLabel={`${repo.owner.login} avatar`}
          onLoad={() => {
            loadedRef.current = true;
          }}
          onError={handleAvatarError}
        />
      ) : (
        <View
          style={[styles.avatar, styles.avatarFallback, { backgroundColor: colors.fieldBackground }]}
          accessibilityLabel={`${repo.owner.login} avatar`}
        >
          <AvatarDefaultSvg width={22} height={22} color={colors.textMuted} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {repo.full_name}
        </Text>
        {repo.description ? (
          <Text
            style={[styles.description, { color: colors.textMuted }]}
            numberOfLines={2}
          >
            {repo.description}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <Text style={[styles.meta, { color: colors.star }]}>
            ★ {formatCount(repo.stargazers_count)}
          </Text>
          {repo.language ? (
            <Text style={[styles.meta, { color: colors.textMuted }]}>
              {repo.language}
            </Text>
          ) : null}
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {formatRelativeDate(repo.updated_at)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export const RepoListItem = memo(RepoListItemComponent);

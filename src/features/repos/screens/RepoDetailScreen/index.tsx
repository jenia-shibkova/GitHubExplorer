import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { useResolvedTheme } from '@/theme/colors';
import { AvatarDefaultSvg } from '@/assets/avatar-default';
import type { RepoDetailScreenProps } from '@/navigation/types';
import { useRepoDetail } from '@hooks/useRepoDetail';
import {
  LIST_AVATAR_SIZE,
  formatCount,
  formatRelativeDate,
  withAvatarSize,
} from '@utils/format';
import { MetaRow } from './components/MetaRow';
import { styles } from './styles';

const DETAIL_AVATAR_SIZE = 64;
const MAX_AVATAR_RETRIES = 1;
// FastImage has no request timeout of its own — a genuinely dead connection
// can sit "in flight" for the OS's own default, which is tens of seconds,
// not the brief moment a broken image should take to give up. We enforce
// our own short deadline and treat "still nothing after this long" the
// same as an explicit error, so a retry (and the eventual fallback icon)
// never waits on that.
const AVATAR_LOAD_TIMEOUT_MS = 3000;

export function RepoDetailScreen({ route }: RepoDetailScreenProps) {
  const { fullName, seedRepo } = route.params;
  const { colors } = useResolvedTheme();
  const { data: repo } = useRepoDetail(fullName, seedRepo);
  // Show the smaller size first — the same one `RepoListItem` requests, so
  // it's already sitting in FastImage's cache for any repo the user has
  // scrolled past in the list, meaning an instant, network-free first paint
  // even offline. We used to request the sharper size first and fall back
  // *after* it failed, but a failed request offline can take several
  // seconds to actually time out — that's the "shows up late" delay this
  // replaces. The sharper size now loads silently in the background via the
  // hidden probe below and swaps in once (and only if) it's ready, so
  // there's never a visible wait either way.
  const [avatarSize, setAvatarSize] = useState(LIST_AVATAR_SIZE);
  const [avatarFailed, setAvatarFailed] = useState(false);
  // Same reasoning as RepoListItem: a failure is often just a dropped
  // request, not a real absence of the image — one retry before giving up
  // to the fallback icon.
  const [retryCount, setRetryCount] = useState(0);
  const hasAvatarUrl = Boolean(repo?.owner.avatar_url);
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
  }, [hasAvatarUrl, avatarFailed, avatarSize, retryCount, handleAvatarError]);

  if (!repo) return null;

  const stats: Array<[string, number]> = [
    ['Stars', repo.stargazers_count],
    ['Forks', repo.forks_count],
    ['Watchers', repo.watchers_count],
    ['Open issues', repo.open_issues_count],
  ];

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        {hasAvatarUrl && !avatarFailed ? (
          <>
            <FastImage
              key={`${avatarSize}-${retryCount}`}
              source={{
                uri: withAvatarSize(repo.owner.avatar_url, avatarSize),
                // The single hero image on this screen (not a list item
                // competing with dozens of others) — safe to prioritize.
                priority: FastImage.priority.high,
              }}
              style={styles.avatar}
              resizeMode={FastImage.resizeMode.cover}
              accessibilityLabel={`${repo.owner.login} avatar`}
              onLoad={() => {
                loadedRef.current = true;
              }}
              onError={handleAvatarError}
            />
            {avatarSize === LIST_AVATAR_SIZE ? (
              <FastImage
                key={repo.owner.avatar_url}
                source={{ uri: withAvatarSize(repo.owner.avatar_url, DETAIL_AVATAR_SIZE) }}
                style={styles.avatarPreloadProbe}
                onLoad={() => setAvatarSize(DETAIL_AVATAR_SIZE)}
              />
            ) : null}
          </>
        ) : (
          <View
            style={[styles.avatar, styles.avatarFallback, { backgroundColor: colors.fieldBackground }]}
            accessibilityLabel={`${repo.owner.login} avatar`}
          >
            <AvatarDefaultSvg width={32} height={32} color={colors.textMuted} />
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.text }]}>{repo.name}</Text>
          <Text style={[styles.owner, { color: colors.textMuted }]}>
            by {repo.owner.login}
          </Text>
        </View>
      </View>

      {repo.description ? (
        <Text style={[styles.description, { color: colors.text }]}>
          {repo.description}
        </Text>
      ) : null}

      <View
        style={[
          styles.statsGrid,
          {
            borderColor: colors.border,
            backgroundColor: colors.fieldBackground,
          },
        ]}
      >
        {stats.map(([label, value]) => (
          <View key={label} style={styles.statCell}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {formatCount(value)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.metaList}>
        {repo.language ? (
          <MetaRow label="Language" value={repo.language} colors={colors} />
        ) : null}
        {repo.license ? (
          <MetaRow label="License" value={repo.license.name} colors={colors} />
        ) : null}
        <MetaRow
          label="Created"
          value={formatRelativeDate(repo.created_at)}
          colors={colors}
        />
        <MetaRow
          label="Last updated"
          value={formatRelativeDate(repo.updated_at)}
          colors={colors}
        />
      </View>

      <Pressable
        style={[styles.linkButton, { backgroundColor: colors.accent }]}
        onPress={() => Linking.openURL(repo.html_url)}
        accessibilityRole="link"
      >
        <Text style={styles.linkButtonText}>Open on GitHub</Text>
      </Pressable>
    </ScrollView>
  );
}

import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import type { GithubRepo } from '@/api/types';
import { useResolvedTheme } from '@/theme/colors';
import { formatCount, formatRelativeDate, withAvatarSize } from '@utils/format';
import { styles } from './styles';

const AVATAR_SIZE = 44; // matches styles.avatar — requesting a bigger image than this just wastes bandwidth/decode time

interface Props {
  repo: GithubRepo;
  onPress: (repo: GithubRepo) => void;
}

function RepoListItemComponent({ repo, onPress }: Props) {
  const { colors } = useResolvedTheme();

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
      <FastImage
        source={{
          uri: withAvatarSize(repo.owner.avatar_url, AVATAR_SIZE),
          priority: FastImage.priority.normal,
        }}
        style={styles.avatar}
        resizeMode={FastImage.resizeMode.cover}
        accessibilityLabel={`${repo.owner.login} avatar`}
      />
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

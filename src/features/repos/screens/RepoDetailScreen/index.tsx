import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { useResolvedTheme } from '@/theme/colors';
import type { RepoDetailScreenProps } from '@/navigation/types';
import { useRepoDetail } from '@hooks/useRepoDetail';
import { formatCount, formatRelativeDate, withAvatarSize } from '@utils/format';
import { MetaRow } from './components/MetaRow';
import { styles } from './styles';

const AVATAR_SIZE = 64;

export function RepoDetailScreen({ route }: RepoDetailScreenProps) {
  const { fullName, seedRepo } = route.params;
  const { colors } = useResolvedTheme();
  const { data: repo } = useRepoDetail(fullName, seedRepo);

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
        <FastImage
          source={{
            uri: withAvatarSize(repo.owner.avatar_url, AVATAR_SIZE),
            // The single hero image on this screen (not a list item competing
            // with dozens of others) — safe to prioritize.
            priority: FastImage.priority.high,
          }}
          style={styles.avatar}
          resizeMode={FastImage.resizeMode.cover}
          accessibilityLabel={`${repo.owner.login} avatar`}
        />
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

      <View style={[styles.statsGrid, { borderColor: colors.border }]}>
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

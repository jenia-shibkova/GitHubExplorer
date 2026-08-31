import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 14,
  },
  // Offscreen probe for the sharper avatar — never shown, just used to know
  // when it's safe to swap the visible one without a network wait.
  avatarPreloadProbe: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  owner: {
    fontSize: 14,
    marginTop: 2,
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    marginBottom: 16,
  },
  statCell: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 14,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  metaList: {
    marginBottom: 24,
  },
  linkButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#161210',
    fontWeight: '700',
    fontSize: 15,
  },
});

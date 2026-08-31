import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    margin: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  input: {
    height: 44,
    fontSize: 16,
  },
  resultCount: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontSize: 12,
  },
  loader: { marginTop: 60 },
  footerLoader: { paddingVertical: 20 },
  footerError: {
    paddingVertical: 20,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: { paddingBottom: 24 },
});

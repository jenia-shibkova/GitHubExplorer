import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  clearButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  clearButtonText: {
    fontSize: 16,
  },
});

import { StyleSheet, View } from 'react-native';

export function ListSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
});

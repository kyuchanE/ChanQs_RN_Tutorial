import { StyleSheet, Text, View } from 'react-native';

export interface LoadingStateProps {
  readonly title?: string;
  readonly description?: string;
}

export function LoadingState({
  title = '불러오는 중',
  description,
}: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description === undefined ? null : (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#6b7280',
  },
});

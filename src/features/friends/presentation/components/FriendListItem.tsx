import { Image, StyleSheet, Text, View } from 'react-native';

import type { Friend } from '../../domain';

export interface FriendListItemProps {
  readonly friend: Friend;
}

const createInitial = (name: string): string => {
  const trimmedName = name.trim();

  return trimmedName.length === 0
    ? '?'
    : trimmedName.slice(0, 1).toUpperCase();
};

const formatContactLine = (friend: Friend): string => {
  if (friend.email !== null) {
    return friend.email;
  }

  if (friend.phone !== null) {
    return friend.phone;
  }

  return '연락처 정보 없음';
};

export function FriendListItem({ friend }: FriendListItemProps) {
  return (
    <View style={styles.container}>
      {friend.profileImageUrl === null ? (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{createInitial(friend.name)}</Text>
        </View>
      ) : (
        <Image
          source={{ uri: friend.profileImageUrl }}
          style={styles.avatarImage}
        />
      )}
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {friend.name}
        </Text>
        <Text numberOfLines={1} style={styles.contact}>
          {formatContactLine(friend)}
        </Text>
        {friend.addressLabel === null ? null : (
          <Text numberOfLines={1} style={styles.meta}>
            {friend.addressLabel}
          </Text>
        )}
        {friend.website === null ? null : (
          <Text numberOfLines={1} style={styles.meta}>
            {friend.website}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dbeafe',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    color: '#111827',
  },
  contact: {
    fontSize: 14,
    lineHeight: 19,
    color: '#374151',
  },
  meta: {
    fontSize: 12,
    lineHeight: 17,
    color: '#6b7280',
  },
});

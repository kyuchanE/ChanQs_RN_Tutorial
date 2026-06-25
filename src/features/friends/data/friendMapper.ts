import type { Friend } from '../domain';
import type { FriendResponseDto } from './dtos';

const normalizeOptionalString = (value: string | undefined): string | null =>
  value === undefined || value.trim().length === 0 ? null : value.trim();

const compactStringParts = (
  parts: readonly (string | undefined)[],
): readonly string[] =>
  parts
    .map(normalizeOptionalString)
    .filter((part): part is string => part !== null);

const createAddressLabel = (response: FriendResponseDto): string | null => {
  const directAddressParts = compactStringParts([
    response.province,
    response.city,
    response.district,
    response.street,
    response.zipcode,
  ]);

  if (directAddressParts.length > 0) {
    return directAddressParts.join(' ');
  }

  const nestedAddressParts = compactStringParts([
    response.address?.city,
    response.address?.street,
    response.address?.suite,
    response.address?.zipcode,
  ]);

  return nestedAddressParts.length === 0
    ? null
    : nestedAddressParts.join(' ');
};

const normalizeProfileImageUrl = (
  response: FriendResponseDto,
): string | null =>
  normalizeOptionalString(
    response.profileImageUrl ??
      response.profileImage ??
      response.avatar ??
      response.image,
  );

export const mapFriendResponseDtoToFriend = (
  response: FriendResponseDto,
): Friend => ({
  id: response.id,
  name: response.name,
  username: normalizeOptionalString(response.username),
  email: normalizeOptionalString(response.email),
  phone: normalizeOptionalString(response.phone),
  website: normalizeOptionalString(response.website),
  addressLabel: createAddressLabel(response),
  profileImageUrl: normalizeProfileImageUrl(response),
});

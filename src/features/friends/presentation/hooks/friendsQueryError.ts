import axios from 'axios';

import { FriendsDomainException } from '../../domain';

const getMessageByStatus = (status: number | undefined): string => {
  if (status === 401) {
    return '인증이 필요합니다.';
  }

  if (status === 403) {
    return '친구 목록을 조회할 권한이 없습니다.';
  }

  if (status === 404) {
    return '친구 목록을 찾을 수 없습니다.';
  }

  if (status !== undefined && status >= 500) {
    return '서버 오류로 친구 목록을 불러오지 못했습니다.';
  }

  return '친구 목록을 불러오지 못했습니다.';
};

export const mapFriendsQueryError = (
  error: unknown,
): FriendsDomainException => {
  if (error instanceof FriendsDomainException) {
    return error;
  }

  if (!axios.isAxiosError(error)) {
    return new FriendsDomainException({
      kind: 'unknown',
      message: '알 수 없는 오류가 발생했습니다.',
    });
  }

  if (error.code === 'ECONNABORTED') {
    return new FriendsDomainException({
      kind: 'timeout',
      message: '요청 시간이 초과되었습니다.',
    });
  }

  const status = error.response?.status;

  if (status === undefined) {
    return new FriendsDomainException({
      kind: 'network',
      message: '네트워크 연결을 확인해 주세요.',
    });
  }

  if (status === 401) {
    return new FriendsDomainException({
      kind: 'unauthorized',
      message: getMessageByStatus(status),
      status,
    });
  }

  if (status === 403) {
    return new FriendsDomainException({
      kind: 'forbidden',
      message: getMessageByStatus(status),
      status,
    });
  }

  if (status === 404) {
    return new FriendsDomainException({
      kind: 'notFound',
      message: getMessageByStatus(status),
      status,
    });
  }

  if (status >= 500) {
    return new FriendsDomainException({
      kind: 'server',
      message: getMessageByStatus(status),
      status,
    });
  }

  return new FriendsDomainException({
    kind: 'unknown',
    message: getMessageByStatus(status),
    status,
  });
};

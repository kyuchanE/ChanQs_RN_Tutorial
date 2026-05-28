# AGENTS.md

이 문서는 이 저장소에서 작업하는 AI 에이전트와 개발자가 따라야 할 React Native/Expo 구현 지침이다. 새 기능을 추가하거나 코드를 수정할 때 아래 요구사항을 우선 적용한다.


## 프로젝트 전제

- Expo 기반 React Native 앱으로 구현한다.
- 언어는 TypeScript를 기본으로 사용한다.
- UI는 React Native 기본 컴포넌트와 StyleSheet/Flexbox를 중심으로 작성한다.
- 구조는 Clean Architecture를 따른다.
- 전역 client state는 Zustand로 관리한다.
- server state와 API 캐시는 TanStack Query로 관리한다.
- HTTP 통신은 axios instance를 통해서만 수행한다.

## TypeScript 규칙

- 모든 화면, 컴포넌트, hook, store, API 응답, navigation param은 명시적인 type/interface를 사용한다.
- 재사용 가능한 응답 래퍼, repository, use case, list item 컴포넌트에는 generic을 적극 사용한다.
- `any`는 금지한다. 불가피한 경우 `unknown`을 사용하고 type guard 또는 명시적 변환을 둔다.
- React component props는 `type` 또는 `interface`로 분리한다.
- navigation param은 route별 param list type으로 선언한다.

## React Native 구현 규칙

- 화면과 공통 UI는 React component로 작성한다.
- props/state/hooks를 명확히 분리한다.
- state는 목적에 따라 다음처럼 구분한다.
  - local UI state: `useState`, `useMemo`, `useCallback`
  - client state: Zustand
  - server state: TanStack Query
- 화면 구성에는 다음 React Native 기본 컴포넌트를 사용한다.
  - `View`
  - `Text`
  - `Image`
  - `TextInput`
  - `Pressable`
- 스타일은 `StyleSheet.create`와 Flexbox를 사용한다.
- 레이아웃은 다양한 화면 크기와 notch 영역을 고려한다.
- 키보드 입력 화면은 `KeyboardAvoidingView`, `Keyboard`, `TouchableWithoutFeedback` 또는 Expo/React Native에서 적절한 키보드 대응 방식을 사용한다.
- safe area는 `react-native-safe-area-context`의 `SafeAreaProvider`, `SafeAreaView`, `useSafeAreaInsets`를 사용한다.

## Clean Architecture

기능은 presentation, domain, data, infrastructure 관심사를 분리한다.

권장 구조:

```text
src/
  app/
    providers/
    navigation/
    config/
  features/
    auth/
      presentation/
      domain/
      data/
    posts/
      presentation/
      domain/
      data/
    friends/
      presentation/
      domain/
      data/
    profile/
      presentation/
      domain/
      data/
  shared/
    api/
    components/
    hooks/
    storage/
    permissions/
    native/
    notifications/
    types/
    utils/
```

계층 규칙:

- `presentation`: screen, component, hook, view model, navigation adapter를 둔다.
- `domain`: entity, use case, repository interface를 둔다.
- `data`: DTO, mapper, repository implementation, remote/local data source를 둔다.
- `shared/api`: axios instance, interceptor, 공통 error handling을 둔다.
- `shared/storage`: AsyncStorage와 Secure Storage adapter를 둔다.
- `presentation`은 `data` 구현체에 직접 의존하지 않고 use case 또는 hook을 통해 접근한다.
- DTO와 domain model은 분리하고 mapper를 둔다.

## Navigation 요구사항

- React Navigation을 사용한다.
- Stack Navigation, Tab Navigation, Nested Navigation을 모두 적용한다.
- 메인 페이지는 하단 Tab Navigation이 존재하는 화면이어야 한다.
- 하단 navigation item은 다음 3개를 사용한다.
  - `로그인/마이페이지`
  - `게시글목록`
  - `친구목록`
- 인증 상태에 따라 첫 번째 탭은 다음처럼 동작한다.
  - 미로그인: 로그인 화면
  - 로그인: 마이페이지 화면
- 게시글 목록에서 게시글을 누르면 Stack Navigation으로 게시글 상세 화면에 진입한다.
- 게시글 상세 화면은 게시글의 `id` 값을 route param으로 받아 조회한다.

권장 navigation 구조:

```text
RootStack
  AuthFlow
  MainTabs
    LoginOrMyPageStack
    PostsStack
      PostsListScreen
      PostDetailScreen
    FriendsStack
      FriendsListScreen
```

## Auth Flow

- 인증 흐름을 반드시 구현한다.
- access token과 refresh token을 분리해 처리한다.
- access token은 API 요청 Authorization header에 사용한다.
- refresh token은 access token 재발급에 사용한다.
- 민감한 토큰은 Secure Storage에 저장한다.
- 비민감한 앱 설정과 캐시성 값은 AsyncStorage에 저장한다.
- 앱 시작 시 저장된 토큰을 복원하고 인증 상태를 초기화한다.
- 로그아웃 시 Zustand auth store, TanStack Query cache, Secure Storage의 토큰을 정리한다.

## API 요구사항

게시글 API:

- 목록 조회: `GET https://koreanjson.com/posts`
- 상세 조회: `GET https://koreanjson.com/posts/{id}`
- 목록 화면은 `FlatList`를 사용한다.
- 게시글을 누르면 해당 item의 `id`를 사용해 상세 API를 호출한다.

친구 API:

- 목록 조회: `GET https://koreanjson.com/users`
- 목록 화면은 `FlatList` 또는 그룹이 필요한 경우 `SectionList`를 사용한다.

List 구현:

- `FlatList`를 게시글 목록에 사용한다.
- `FlatList` 또는 `SectionList`를 친구 목록에 사용한다.
- loading, error, empty state를 모두 처리한다.
- list item key는 안정적인 id 기반 key를 사용한다.

## Axios와 Interceptor

- 모든 HTTP 요청은 공통 axios instance를 통해 수행한다.
- baseURL, timeout, default headers를 설정한다.
- request interceptor에서 access token을 Authorization header에 추가한다.
- response interceptor에서 401 에러를 공통 처리한다.
- 401 처리 규칙:
  - refresh token이 있으면 access token 재발급을 시도한다.
  - 재발급 성공 시 실패한 요청을 1회 재시도한다.
  - 재발급 실패 또는 refresh token 부재 시 로그아웃 처리한다.
  - 중복 refresh 요청이 발생하지 않도록 refresh queue 또는 mutex를 둔다.
- interceptor 내부에서도 무한 재시도가 발생하지 않도록 `_retry` 같은 플래그를 둔다.

## TanStack Query

- API 조회는 TanStack Query hook으로 감싼다.
- query key는 feature 단위로 상수화한다.
- 게시글 목록 query key 예:
  - `['posts']`
- 게시글 상세 query key 예:
  - `['posts', id]`
- 친구 목록 query key 예:
  - `['friends']`
- mutation이 생기면 성공 시 관련 query를 invalidate한다.
- 화면 unmount와 refetch 정책은 UX에 맞게 명시적으로 설정한다.

## Zustand

- Zustand store는 feature별로 분리한다.
- 인증 상태, 사용자 profile, UI preference 등 client state를 관리한다.
- server에서 내려온 목록 데이터는 Zustand에 중복 저장하지 않고 TanStack Query cache를 사용한다.
- store action type을 명확히 유지한다.

## Storage

- AsyncStorage:
  - 온보딩 완료 여부
  - 테마/언어 등 비민감 설정
  - 최근 검색어 등 민감하지 않은 값
- Secure Storage:
  - access token
  - refresh token
  - 민감한 사용자 인증 정보
- storage adapter를 만들어 직접 import 확산을 막는다.

## Permission

- 권한 요청은 shared permission module로 분리한다.
- 카메라, 갤러리, push notification 권한을 명시적으로 처리한다.
- 권한 상태별 UI를 제공한다.
  - granted
  - denied
  - blocked 또는 canAskAgain false
  - undetermined
- 권한이 거부된 경우 설정 화면 이동 안내를 제공한다.

## Camera/Gallery

- Expo 환경에서는 `expo-camera`, `expo-image-picker`, `expo-media-library` 등 Expo 호환 라이브러리를 우선 사용한다.
- 카메라 촬영과 갤러리 선택 기능을 분리된 hook 또는 service로 구현한다.
- 선택 결과는 uri, width, height, mime type 등 필요한 metadata를 type으로 정의한다.
- 이미지 미리보기에는 `Image` 컴포넌트를 사용한다.

## Push Notification

- Expo Push Notification을 사용한다.
- push token 등록, 권한 요청, foreground/background 수신 처리를 분리한다.
- notification click 또는 response는 navigation과 연결한다.
- 필요한 경우 deep link와 동일한 route resolver를 사용한다.

## Deep Link

- React Navigation linking config를 작성한다.
- 게시글 상세 deep link는 `posts/{id}` 형태를 지원한다.
- auth가 필요한 route는 인증 상태 확인 후 적절히 redirect한다.
- notification tap과 외부 deep link가 동일한 navigation path를 사용하도록 유지한다.

## Android BackHandler

- Android hardware back button 처리를 구현한다.
- 상세 화면에서는 이전 화면으로 이동한다.
- root tab 화면에서는 앱 종료 확인 또는 기본 동작을 명확히 한다.
- modal, selection mode, search mode 등 임시 UI state가 있으면 back button으로 먼저 해제한다.
- 이벤트 listener는 cleanup을 반드시 수행한다.

## Native Module

- Expo에서 가능한 기능은 Expo Module 또는 config plugin을 우선 사용한다.
- 직접 Native Module이 필요한 경우 Android/iOS 구현을 모두 고려한다.
- TypeScript wrapper를 제공하고 platform별 미지원 처리를 둔다.
- native bridge의 input/output type을 명확히 정의한다.

## Android/iOS 설정

- Android와 iOS 설정은 Expo config에서 관리한다.
- app name, bundle identifier/package name, scheme, permission message, splash, icon을 명시한다.
- 플랫폼별 권한 문구를 누락하지 않는다.
- native 설정 변경 후에는 prebuild 필요 여부를 문서화한다.

## Env 분리

- local, development, staging, production 환경을 분리한다.
- 환경 변수는 Expo config와 app runtime config에서 일관되게 읽는다.
- API URL, deep link scheme, feature flag, logging level을 env별로 분리한다.
- secret은 repository에 commit하지 않는다.

## Splash 화면

- Expo splash screen을 사용한다.
- 앱 시작 시 token restore, font loading, critical config loading이 끝난 뒤 splash를 숨긴다.
- splash가 불필요하게 오래 유지되지 않도록 timeout 또는 fallback을 고려한다.

## 화면 요구사항

### 로그인/마이페이지

- 하단 Tab의 첫 번째 item이다.
- 인증 상태에 따라 로그인 또는 마이페이지를 보여준다.
- 로그인 화면은 `TextInput`과 `Pressable`을 사용한다.
- 로그인 성공 시 token 저장, auth store 갱신, query cache 준비를 수행한다.
- 마이페이지는 사용자 정보, 로그아웃 버튼, 필요한 profile 이미지를 표시한다.

### 게시글목록

- 하단 Tab의 두 번째 item이다.
- `GET https://koreanjson.com/posts`로 데이터를 조회한다.
- TanStack Query를 사용한다.
- `FlatList`로 게시글 목록을 표시한다.
- 각 item은 `Pressable`로 구현한다.
- item press 시 `id`를 param으로 넘겨 게시글 상세 화면으로 이동한다.

### 게시글상세

- 게시글 목록 item의 `id`를 사용한다.
- `GET https://koreanjson.com/posts/{id}`로 상세 데이터를 조회한다.
- loading, error, retry UI를 제공한다.
- Android back button과 navigation back 동작을 확인한다.

### 친구목록

- 하단 Tab의 세 번째 item이다.
- `GET https://koreanjson.com/users`로 데이터를 조회한다.
- TanStack Query를 사용한다.
- 기본은 `FlatList`로 구현한다.
- 그룹 표시가 필요하면 `SectionList`를 사용한다.
- profile 이미지 또는 placeholder를 표시할 때 `Image`를 사용한다.

## 구현 전 확인 체크리스트

- TypeScript type/interface/generic이 필요한 곳에 정의되었는가?
- component props, state, hook 책임이 분리되었는가?
- Clean Architecture 계층 의존성이 지켜졌는가?
- axios instance와 interceptor를 우회한 API 호출이 없는가?
- access/refresh token 처리와 401 공통 처리가 구현되었는가?
- Zustand와 TanStack Query의 책임이 섞이지 않았는가?
- AsyncStorage와 Secure Storage 사용 기준이 지켜졌는가?
- SafeArea와 Keyboard 대응이 포함되었는가?
- FlatList/SectionList의 loading/error/empty state가 구현되었는가?
- Stack/Tab/Nested Navigation이 모두 적용되었는가?
- Auth Flow와 Deep Link가 navigation과 연결되었는가?
- Android BackHandler cleanup이 구현되었는가?
- Permission, Camera/Gallery, Push Notification 흐름이 분리되었는가?
- Native Module과 Android/iOS 설정 변경점이 문서화되었는가?
- env 분리와 Expo Splash 처리가 적용되었는가?

## 작업 원칙

- 기능을 추가할 때는 먼저 domain type과 repository interface를 정의한다.
- API 응답 DTO는 domain model로 변환해서 presentation에 전달한다.
- 화면에서 axios를 직접 호출하지 않는다.
- 화면에서 storage를 직접 호출하지 않는다.
- 공통 error, loading, empty UI는 재사용 가능한 shared component로 분리한다.
- navigation route name, query key, env key는 상수화한다.
- 테스트 또는 수동 검증이 필요한 기능은 검증 절차를 README 또는 관련 문서에 남긴다.

## TODO List

아래 TODO는 완료 항목과 예정 항목을 분리해 관리한다. 구현이 끝난 항목은 `진행 예정`에서 `진행 완료`로 이동하고 체크박스를 `[x]`로 변경한다.

### 진행 완료

- [x] AGENTS.md 요구사항 전체 구조를 확인한다.
- [x] Expo 프로젝트 실행 가능 여부를 확인한다. `blank-typescript` 템플릿 생성 후 `npm run start -- --offline --port 8081`로 Metro Bundler 기동을 확인했다.
- [x] TypeScript 설정 파일을 확인한다. `tsconfig.json`이 `expo/tsconfig.base`를 확장한다.
- [x] `strict` 옵션 적용 여부를 확인한다. `compilerOptions.strict`가 `true`로 설정되어 있다.
- [x] 필요한 dependency 목록을 확인한다. Navigation, TanStack Query, Zustand, axios, storage, safe area, Expo native module 관련 의존성을 설치했다.
- [x] app entry point 구조를 확인한다. `package.json`의 `main`은 `index.ts`이고 `registerRootComponent(App)`로 `App.tsx`를 등록한다.
- [x] React Navigation dependency를 설치한다.
- [x] TanStack Query dependency를 설치한다.
- [x] Zustand dependency를 설치한다.
- [x] axios dependency를 설치한다.
- [x] AsyncStorage dependency를 설치한다.
- [x] Secure Storage dependency를 설치한다.
- [x] Safe Area dependency를 설치한다.
- [x] Expo Splash Screen dependency를 확인한다.
- [x] Expo Camera dependency를 확인한다.
- [x] Expo Image Picker dependency를 확인한다.
- [x] Expo Media Library dependency를 확인한다.
- [x] Expo Notifications dependency를 확인한다.
- [x] `src` 디렉터리를 생성한다.
- [x] `src/app` 디렉터리를 생성한다.
- [x] `src/app/providers` 디렉터리를 생성한다.
- [x] `src/app/navigation` 디렉터리를 생성한다.
- [x] `src/app/config` 디렉터리를 생성한다.
- [x] `src/features` 디렉터리를 생성한다.
- [x] `src/features/auth` 디렉터리를 생성한다.
- [x] `src/features/auth/presentation` 디렉터리를 생성한다.
- [x] `src/features/auth/domain` 디렉터리를 생성한다.
- [x] `src/features/auth/data` 디렉터리를 생성한다.
- [x] `src/features/posts` 디렉터리를 생성한다.
- [x] `src/features/posts/presentation` 디렉터리를 생성한다.
- [x] `src/features/posts/domain` 디렉터리를 생성한다.
- [x] `src/features/posts/data` 디렉터리를 생성한다.
- [x] `src/features/friends` 디렉터리를 생성한다.
- [x] `src/features/friends/presentation` 디렉터리를 생성한다.
- [x] `src/features/friends/domain` 디렉터리를 생성한다.
- [x] `src/features/friends/data` 디렉터리를 생성한다.
- [x] `src/features/profile` 디렉터리를 생성한다.
- [x] `src/features/profile/presentation` 디렉터리를 생성한다.
- [x] `src/features/profile/domain` 디렉터리를 생성한다.
- [x] `src/features/profile/data` 디렉터리를 생성한다.
- [x] `src/shared` 디렉터리를 생성한다.
- [x] `src/shared/api` 디렉터리를 생성한다.
- [x] `src/shared/components` 디렉터리를 생성한다.
- [x] `src/shared/hooks` 디렉터리를 생성한다.
- [x] `src/shared/storage` 디렉터리를 생성한다.
- [x] `src/shared/permissions` 디렉터리를 생성한다.
- [x] `src/shared/native` 디렉터리를 생성한다.
- [x] `src/shared/notifications` 디렉터리를 생성한다.
- [x] `src/shared/types` 디렉터리를 생성한다.
- [x] `src/shared/utils` 디렉터리를 생성한다.
- [x] 공통 API 응답 wrapper type을 정의한다.
- [x] 공통 API error type을 정의한다.
- [x] 공통 nullable type helper 필요 여부를 확인한다. `Nullable<T>`와 `Optional<T>`를 공통 helper로 정의했다.
- [x] navigation route name 상수를 정의한다.
- [x] query key 상수를 정의한다.
- [x] env key 상수를 정의한다.
- [x] storage key 상수를 정의한다.
- [x] permission status type을 정의한다.
- [x] image asset metadata type을 정의한다.
- [x] push notification payload type을 정의한다.
- [x] deep link path type을 정의한다.
- [x] `any` 사용 여부를 검색한다. 앱 코드와 `src`에는 `any` 사용이 없다.
- [x] 불가피한 동적 값은 `unknown`으로 변경한다. 동적 payload와 error detail 기본 타입은 `unknown`으로 둔다.
- [x] `unknown` 값에 type guard를 추가한다.
- [x] `SafeAreaProvider`를 root에 연결한다.
- [x] `QueryClient` 생성 파일을 추가한다.
- [x] `QueryClientProvider`를 root에 연결한다.
- [x] query 기본 stale time을 정의한다.
- [x] query 기본 retry 정책을 정의한다.
- [x] query cache clear helper를 정의한다.
- [x] app bootstrap provider를 작성한다.
- [x] token restore 완료 전 loading 상태를 정의한다.
- [x] critical config loading 상태를 정의한다.
- [x] bootstrap 실패 fallback UI를 정의한다.

### 진행 예정

#### Env 분리

- [ ] local env 파일 규칙을 정한다.
- [ ] development env 파일 규칙을 정한다.
- [ ] staging env 파일 규칙을 정한다.
- [ ] production env 파일 규칙을 정한다.
- [ ] API URL env 값을 정의한다.
- [ ] deep link scheme env 값을 정의한다.
- [ ] feature flag env 값을 정의한다.
- [ ] logging level env 값을 정의한다.
- [ ] Expo config에서 env를 읽는다.
- [ ] runtime config adapter를 작성한다.
- [ ] secret이 repository에 포함되지 않는지 확인한다.

#### Storage

- [ ] AsyncStorage adapter interface를 정의한다.
- [ ] AsyncStorage adapter 구현체를 작성한다.
- [ ] Secure Storage adapter interface를 정의한다.
- [ ] Secure Storage adapter 구현체를 작성한다.
- [ ] access token 저장 함수를 작성한다.
- [ ] access token 조회 함수를 작성한다.
- [ ] access token 삭제 함수를 작성한다.
- [ ] refresh token 저장 함수를 작성한다.
- [ ] refresh token 조회 함수를 작성한다.
- [ ] refresh token 삭제 함수를 작성한다.
- [ ] token 전체 삭제 함수를 작성한다.
- [ ] 비민감 설정 저장 함수를 작성한다.
- [ ] 비민감 설정 조회 함수를 작성한다.
- [ ] storage adapter 단위 검증 절차를 문서화한다.

#### Auth Domain

- [ ] auth user entity를 정의한다.
- [ ] token pair entity를 정의한다.
- [ ] login credential entity를 정의한다.
- [ ] auth repository interface를 정의한다.
- [ ] login use case를 정의한다.
- [ ] logout use case를 정의한다.
- [ ] restore token use case를 정의한다.
- [ ] refresh token use case를 정의한다.
- [ ] auth state type을 정의한다.
- [ ] auth error type을 정의한다.

#### Auth Data

- [ ] login request DTO를 정의한다.
- [ ] login response DTO를 정의한다.
- [ ] refresh request DTO를 정의한다.
- [ ] refresh response DTO를 정의한다.
- [ ] profile response DTO를 정의한다.
- [ ] auth DTO mapper를 작성한다.
- [ ] auth remote data source interface를 정의한다.
- [ ] auth remote data source 구현체를 작성한다.
- [ ] auth local data source interface를 정의한다.
- [ ] auth local data source 구현체를 작성한다.
- [ ] auth repository 구현체를 작성한다.

#### Zustand Auth Store

- [ ] auth store state type을 정의한다.
- [ ] auth store action type을 정의한다.
- [ ] initial auth state를 정의한다.
- [ ] set authenticated action을 작성한다.
- [ ] set unauthenticated action을 작성한다.
- [ ] set restoring action을 작성한다.
- [ ] set profile action을 작성한다.
- [ ] clear auth action을 작성한다.
- [ ] auth selector를 작성한다.
- [ ] logout 시 store 초기화를 연결한다.

#### Axios Instance

- [ ] axios baseURL을 설정한다.
- [ ] axios timeout을 설정한다.
- [ ] axios default header를 설정한다.
- [ ] request interceptor를 추가한다.
- [ ] request interceptor에서 access token을 조회한다.
- [ ] Authorization header 추가 로직을 작성한다.
- [ ] response interceptor를 추가한다.
- [ ] 401 status 감지 로직을 작성한다.
- [ ] `_retry` 플래그 type을 확장한다.
- [ ] refresh token 조회 로직을 작성한다.
- [ ] token refresh 요청 함수를 작성한다.
- [ ] refresh 성공 시 token 저장 로직을 작성한다.
- [ ] refresh 성공 시 원 요청 재시도 로직을 작성한다.
- [ ] refresh 실패 시 logout 로직을 호출한다.
- [ ] refresh token이 없을 때 logout 로직을 호출한다.
- [ ] 중복 refresh 방지 mutex를 작성한다.
- [ ] 대기 요청 queue를 작성한다.
- [ ] queue 성공 처리 로직을 작성한다.
- [ ] queue 실패 처리 로직을 작성한다.
- [ ] 무한 재시도 방지 동작을 확인한다.

#### Navigation

- [ ] root stack param list type을 정의한다.
- [ ] main tab param list type을 정의한다.
- [ ] login or mypage stack param list type을 정의한다.
- [ ] posts stack param list type을 정의한다.
- [ ] friends stack param list type을 정의한다.
- [ ] navigation container를 연결한다.
- [ ] linking config를 navigation container에 연결한다.
- [ ] RootStack navigator를 작성한다.
- [ ] AuthFlow navigator를 작성한다.
- [ ] MainTabs navigator를 작성한다.
- [ ] LoginOrMyPageStack navigator를 작성한다.
- [ ] PostsStack navigator를 작성한다.
- [ ] FriendsStack navigator를 작성한다.
- [ ] 첫 번째 tab label을 `로그인/마이페이지`로 설정한다.
- [ ] 두 번째 tab label을 `게시글목록`으로 설정한다.
- [ ] 세 번째 tab label을 `친구목록`으로 설정한다.
- [ ] 인증 상태에 따른 첫 번째 tab screen 분기 로직을 작성한다.
- [ ] 게시글 상세 route param으로 `id`를 정의한다.
- [ ] 게시글 목록에서 상세로 이동하는 navigation helper를 작성한다.

#### Deep Link

- [ ] app scheme을 정의한다.
- [ ] `posts/{id}` path를 linking config에 추가한다.
- [ ] post id parse 함수를 작성한다.
- [ ] 잘못된 post id fallback을 작성한다.
- [ ] auth 필요 route 판별 함수를 작성한다.
- [ ] 미인증 상태 redirect 로직을 작성한다.
- [ ] notification route resolver와 deep link resolver를 공유한다.
- [ ] deep link 수동 검증 절차를 문서화한다.

#### Posts Domain

- [ ] post entity를 정의한다.
- [ ] post id type을 정의한다.
- [ ] post list item type을 정의한다.
- [ ] posts repository interface를 정의한다.
- [ ] get posts use case를 정의한다.
- [ ] get post detail use case를 정의한다.
- [ ] posts domain error type을 정의한다.

#### Posts Data

- [ ] post response DTO를 정의한다.
- [ ] post detail response DTO를 정의한다.
- [ ] post DTO mapper를 작성한다.
- [ ] posts remote data source interface를 정의한다.
- [ ] posts remote data source 구현체를 작성한다.
- [ ] `GET /posts` 호출 함수를 작성한다.
- [ ] `GET /posts/{id}` 호출 함수를 작성한다.
- [ ] posts repository 구현체를 작성한다.
- [ ] posts API가 공통 axios instance를 사용하는지 확인한다.

#### Posts Query

- [ ] posts query key factory를 작성한다.
- [ ] posts list query hook을 작성한다.
- [ ] post detail query hook을 작성한다.
- [ ] posts list stale time을 명시한다.
- [ ] post detail stale time을 명시한다.
- [ ] refetch on mount 정책을 명시한다.
- [ ] refetch on reconnect 정책을 명시한다.
- [ ] posts query error mapping을 작성한다.

#### Posts Presentation

- [ ] posts list screen props type을 정의한다.
- [ ] posts list item component props type을 정의한다.
- [ ] posts list item component를 작성한다.
- [ ] posts list screen을 작성한다.
- [ ] posts list `FlatList`를 연결한다.
- [ ] posts list keyExtractor를 id 기반으로 작성한다.
- [ ] posts list loading UI를 연결한다.
- [ ] posts list error UI를 연결한다.
- [ ] posts list retry UI를 연결한다.
- [ ] posts list empty UI를 연결한다.
- [ ] posts item `Pressable`을 작성한다.
- [ ] item press 시 post id를 route param으로 전달한다.
- [ ] post detail screen props type을 정의한다.
- [ ] post detail screen을 작성한다.
- [ ] post detail route param id를 읽는다.
- [ ] post detail query를 연결한다.
- [ ] post detail loading UI를 연결한다.
- [ ] post detail error UI를 연결한다.
- [ ] post detail retry UI를 연결한다.
- [ ] post detail content UI를 작성한다.
- [ ] post detail navigation back 동작을 확인한다.

#### Friends Domain

- [ ] friend entity를 정의한다.
- [ ] friend id type을 정의한다.
- [ ] friends repository interface를 정의한다.
- [ ] get friends use case를 정의한다.
- [ ] friends domain error type을 정의한다.

#### Friends Data

- [ ] friend response DTO를 정의한다.
- [ ] friend DTO mapper를 작성한다.
- [ ] friends remote data source interface를 정의한다.
- [ ] friends remote data source 구현체를 작성한다.
- [ ] `GET /users` 호출 함수를 작성한다.
- [ ] friends repository 구현체를 작성한다.
- [ ] friends API가 공통 axios instance를 사용하는지 확인한다.

#### Friends Query

- [ ] friends query key factory를 작성한다.
- [ ] friends list query hook을 작성한다.
- [ ] friends list stale time을 명시한다.
- [ ] refetch on mount 정책을 명시한다.
- [ ] refetch on reconnect 정책을 명시한다.
- [ ] friends query error mapping을 작성한다.

#### Friends Presentation

- [ ] friends list screen props type을 정의한다.
- [ ] friend list item component props type을 정의한다.
- [ ] friend list item component를 작성한다.
- [ ] friends list screen을 작성한다.
- [ ] friends list `FlatList`를 연결한다.
- [ ] friends list keyExtractor를 id 기반으로 작성한다.
- [ ] friends list loading UI를 연결한다.
- [ ] friends list error UI를 연결한다.
- [ ] friends list retry UI를 연결한다.
- [ ] friends list empty UI를 연결한다.
- [ ] friend profile image `Image`를 연결한다.
- [ ] friend profile placeholder UI를 작성한다.
- [ ] SectionList 필요 여부를 검토한다.

#### Login Presentation

- [ ] login screen props type을 정의한다.
- [ ] login form state type을 정의한다.
- [ ] email input state를 작성한다.
- [ ] password input state를 작성한다.
- [ ] email `TextInput`을 작성한다.
- [ ] password `TextInput`을 작성한다.
- [ ] login `Pressable`을 작성한다.
- [ ] login form validation 함수를 작성한다.
- [ ] login loading 상태를 표시한다.
- [ ] login error 상태를 표시한다.
- [ ] login success 시 token 저장을 호출한다.
- [ ] login success 시 auth store 갱신을 호출한다.
- [ ] login success 시 query cache 준비 로직을 호출한다.
- [ ] login screen에 `KeyboardAvoidingView`를 적용한다.
- [ ] login screen에 keyboard dismiss 처리를 적용한다.
- [ ] login screen에 `SafeAreaView`를 적용한다.

#### My Page Presentation

- [ ] my page screen props type을 정의한다.
- [ ] profile user info UI를 작성한다.
- [ ] profile image `Image`를 연결한다.
- [ ] profile image fallback을 작성한다.
- [ ] logout `Pressable`을 작성한다.
- [ ] logout confirm 필요 여부를 검토한다.
- [ ] logout 시 auth store를 초기화한다.
- [ ] logout 시 query cache를 정리한다.
- [ ] logout 시 Secure Storage token을 삭제한다.
- [ ] logout 후 login 화면 전환을 확인한다.

#### Shared UI

- [ ] 공통 loading component props type을 정의한다.
- [ ] 공통 loading component를 작성한다.
- [ ] 공통 error component props type을 정의한다.
- [ ] 공통 error component를 작성한다.
- [ ] 공통 retry button을 작성한다.
- [ ] 공통 empty state component props type을 정의한다.
- [ ] 공통 empty state component를 작성한다.
- [ ] 공통 screen container component를 작성한다.
- [ ] 공통 list separator component를 작성한다.
- [ ] 공통 avatar component를 작성한다.
- [ ] 공통 form field component 필요 여부를 검토한다.

#### Permission

- [ ] permission domain type을 정의한다.
- [ ] permission result type을 정의한다.
- [ ] camera permission service를 작성한다.
- [ ] gallery permission service를 작성한다.
- [ ] notification permission service를 작성한다.
- [ ] `granted` 상태 UI를 작성한다.
- [ ] `denied` 상태 UI를 작성한다.
- [ ] `blocked` 상태 UI를 작성한다.
- [ ] `canAskAgain false` 상태 UI를 작성한다.
- [ ] `undetermined` 상태 UI를 작성한다.
- [ ] 설정 화면 이동 안내 함수를 작성한다.
- [ ] permission hook을 작성한다.
- [ ] permission cleanup 필요 여부를 확인한다.

#### Camera/Gallery

- [ ] camera capture result type을 정의한다.
- [ ] gallery picker result type을 정의한다.
- [ ] image metadata type을 정의한다.
- [ ] camera service interface를 정의한다.
- [ ] camera service 구현체를 작성한다.
- [ ] gallery service interface를 정의한다.
- [ ] gallery service 구현체를 작성한다.
- [ ] camera hook을 작성한다.
- [ ] gallery hook을 작성한다.
- [ ] image uri 처리 로직을 작성한다.
- [ ] image width 처리 로직을 작성한다.
- [ ] image height 처리 로직을 작성한다.
- [ ] image mime type 처리 로직을 작성한다.
- [ ] image preview component를 작성한다.
- [ ] image preview에 `Image`를 사용한다.

#### Push Notification

- [ ] notification permission 요청 함수를 작성한다.
- [ ] Expo push token 등록 함수를 작성한다.
- [ ] push token 저장 위치를 결정한다.
- [ ] foreground notification listener를 작성한다.
- [ ] background notification 처리 방식을 확인한다.
- [ ] notification response listener를 작성한다.
- [ ] notification tap route resolver를 작성한다.
- [ ] notification tap과 navigation 연결을 작성한다.
- [ ] notification listener cleanup을 작성한다.
- [ ] push notification 수동 검증 절차를 문서화한다.

#### Android BackHandler

- [ ] root tab back 동작 정책을 정의한다.
- [ ] 상세 화면 back 동작을 확인한다.
- [ ] 앱 종료 확인 필요 여부를 결정한다.
- [ ] modal dismiss back handler를 작성한다.
- [ ] selection mode 해제 back handler를 작성한다.
- [ ] search mode 해제 back handler를 작성한다.
- [ ] BackHandler listener cleanup을 작성한다.
- [ ] Android back 동작 수동 검증 절차를 문서화한다.

#### Native Module

- [ ] Expo Module로 대체 가능한 기능을 검토한다.
- [ ] config plugin 필요 여부를 검토한다.
- [ ] 직접 Native Module 필요 여부를 검토한다.
- [ ] Native Module input type을 정의한다.
- [ ] Native Module output type을 정의한다.
- [ ] platform 미지원 fallback을 정의한다.
- [ ] TypeScript wrapper를 작성한다.
- [ ] Android 구현 필요 여부를 문서화한다.
- [ ] iOS 구현 필요 여부를 문서화한다.

#### Android/iOS Expo Config

- [ ] app name을 설정한다.
- [ ] Android package name을 설정한다.
- [ ] iOS bundle identifier를 설정한다.
- [ ] app scheme을 설정한다.
- [ ] icon 설정을 확인한다.
- [ ] splash 설정을 확인한다.
- [ ] camera permission message를 설정한다.
- [ ] gallery permission message를 설정한다.
- [ ] notification permission message를 설정한다.
- [ ] platform별 권한 문구 누락 여부를 확인한다.
- [ ] native 설정 변경 후 prebuild 필요 여부를 문서화한다.

#### Splash

- [ ] Expo splash screen 설정을 확인한다.
- [ ] token restore 완료 조건을 정의한다.
- [ ] font loading 완료 조건을 정의한다.
- [ ] critical config loading 완료 조건을 정의한다.
- [ ] splash hide 호출 위치를 작성한다.
- [ ] splash timeout fallback을 작성한다.
- [ ] splash가 오래 유지되지 않는지 확인한다.

#### Styling and Layout

- [ ] 모든 화면에 `StyleSheet.create`를 사용한다.
- [ ] 주요 layout에 Flexbox를 사용한다.
- [ ] notch 영역 대응을 확인한다.
- [ ] 작은 화면 layout을 확인한다.
- [ ] 큰 화면 layout을 확인한다.
- [ ] keyboard 입력 화면 layout을 확인한다.
- [ ] `View` 사용 위치를 확인한다.
- [ ] `Text` 사용 위치를 확인한다.
- [ ] `Image` 사용 위치를 확인한다.
- [ ] `TextInput` 사용 위치를 확인한다.
- [ ] `Pressable` 사용 위치를 확인한다.

#### 검증

- [ ] TypeScript type check를 실행한다.
- [ ] lint script를 실행한다.
- [ ] Expo app start를 실행한다.
- [ ] posts list API 조회를 확인한다.
- [ ] post detail API 조회를 확인한다.
- [ ] friends list API 조회를 확인한다.
- [ ] login flow를 확인한다.
- [ ] token restore flow를 확인한다.
- [ ] logout flow를 확인한다.
- [ ] 401 refresh 성공 flow를 확인한다.
- [ ] 401 refresh 실패 flow를 확인한다.
- [ ] refresh 중복 요청 방지를 확인한다.
- [ ] deep link `posts/{id}`를 확인한다.
- [ ] notification tap navigation을 확인한다.
- [ ] Android hardware back 동작을 확인한다.
- [ ] loading state를 확인한다.
- [ ] error state를 확인한다.
- [ ] empty state를 확인한다.
- [ ] README에 수동 검증 절차를 추가한다.

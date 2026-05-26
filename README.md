# ChanQs RN Tutorial

Expo 기반 React Native 학습/구현 프로젝트입니다. TypeScript를 기본으로 사용하며, 이후 작업은 `AGENTS.md`에 정의된 Clean Architecture, Zustand, TanStack Query, axios instance, React Navigation 기준을 따라 진행합니다.

## 현재 진행 상황

### 1. Expo 프로젝트 생성

생성에 사용한 템플릿:

```bash
npx create-expo-app@latest <temp-dir> --template blank-typescript
```

생성 주요 파일:

- `package.json`
- `package-lock.json`
- `app.json`
- `index.ts`
- `App.tsx`
- `tsconfig.json`
- `assets/`

### 2. 프로젝트 메타데이터 정리

임시 디렉터리 이름으로 생성된 기본 메타데이터를 실제 프로젝트 기준으로 변경했습니다.

- package name: `chanqs-rn-tutorial`
- Expo app name: `ChanQs RN Tutorial`
- Expo slug: `chanqs-rn-tutorial`
- Expo scheme: `chanqs-rn-tutorial`

### 3. TypeScript 설정

`tsconfig.json`은 Expo 기본 TypeScript 설정을 확장하고, `strict` 옵션을 활성화했습니다.

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

### 4. 현재 설치된 의존성

Expo `blank-typescript` 템플릿 기본 의존성에 더해 AGENTS.md 기반 구현에 필요한 프로젝트 기반 의존성을 설치했습니다.

```text
expo ~56.0.5
expo-status-bar ~56.0.4
react 19.2.3
react-native 0.85.3
typescript ~6.0.3
@types/react ~19.2.2
@react-navigation/native ^7.2.5
@react-navigation/native-stack ^7.16.0
@react-navigation/bottom-tabs ^7.16.2
react-native-screens 4.25.2
react-native-safe-area-context ~5.7.0
@tanstack/react-query ^5.100.14
zustand ^5.0.13
axios ^1.16.1
@react-native-async-storage/async-storage 2.2.0
expo-secure-store ~56.0.4
expo-splash-screen ~56.0.10
expo-camera ~56.0.7
expo-image-picker ~56.0.14
expo-media-library ~56.0.6
expo-notifications ~56.0.14
```

`expo-secure-store`와 `expo-splash-screen`은 Expo config plugin으로 `app.json`에 등록되어 있습니다.

### 5. 공통 타입과 상수 정의

AGENTS.md의 `공통 타입과 상수` TODO를 기준으로 다음 기반 파일을 추가했습니다.

- `src/shared/types/api.ts`: `ApiResponse<T>`, `ApiListResponse<T>`, `ApiError<TDetails>`, `ApiResult<TData>`
- `src/shared/types/common.ts`: `Nullable<T>`, `Optional<T>`, `EntityId`
- `src/app/navigation/routeNames.ts`: Root/Tab/Stack screen route name 상수와 route name type
- `src/shared/api/queryKeys.ts`: auth/posts/friends query key factory
- `src/app/config/envKeys.ts`: Expo public env key와 environment/logging type
- `src/shared/storage/storageKeys.ts`: AsyncStorage/Secure Storage key 상수
- `src/shared/permissions/types.ts`: permission type/status/result type
- `src/shared/types/image.ts`: image asset metadata type
- `src/shared/notifications/types.ts`: push notification payload type
- `src/shared/types/deepLink.ts`: `posts/{id}` deep link path type
- `src/shared/utils/typeGuards.ts`: `unknown` 값을 좁히는 공통 type guard

앱 코드와 `src` 기준으로 `any` 사용 여부를 검색했고, 현재 `any` 사용은 없습니다.

## 실행 스크립트

```bash
npm run start
npm run android
npm run ios
npm run web
npm run typecheck
```

`typecheck`는 다음 명령을 실행합니다.

```bash
tsc --noEmit
```

## 검증 결과

초기 세팅 후 다음 검증을 완료했습니다.

```bash
npm install
npm run typecheck
npm run start -- --offline --port 8081
```

검증 결과:

- `npm install`: 성공
- `npm run typecheck`: 성공
- `npm run start -- --offline --port 8081`: Metro Bundler 기동 성공
- Metro URL: `http://localhost:8081`

참고: Expo CLI에서 `--offline`과 `--localhost`는 동시에 사용할 수 없어, 실행 검증은 `--offline` 단독 옵션으로 진행했습니다.

## 현재 파일 구조

```text
.
├── AGENTS.md
├── App.tsx
├── README.md
├── app.json
├── assets/
├── index.ts
├── package-lock.json
├── package.json
├── src/
│   ├── app/
│   │   ├── config/
│   │   ├── navigation/
│   │   └── providers/
│   ├── features/
│   │   ├── auth/
│   │   ├── friends/
│   │   ├── posts/
│   │   └── profile/
│   └── shared/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── native/
│       ├── notifications/
│       ├── permissions/
│       ├── storage/
│       ├── types/
│       └── utils/
└── tsconfig.json
```

## 다음 작업

`AGENTS.md` TODO 기준으로 다음 단계는 App Provider 구성입니다.

- `SafeAreaProvider` root 연결
- `QueryClient` 생성 파일 추가
- `QueryClientProvider` root 연결
- query 기본 stale time/retry 정책 정의
- query cache clear helper 정의
- app bootstrap provider 작성
- token restore/critical config loading 상태와 bootstrap 실패 fallback UI 정의

## 작업 메모

- `AGENTS.md`는 TODO 관리와 구현 규칙 문서로 사용하므로 `.gitignore`에서 제외하지 않도록 정리했습니다.
- `.expo/`, `node_modules/`, native generated folder(`/android`, `/ios`)는 Git에 포함하지 않습니다.
- 이후 기능 구현 시 화면에서 직접 API나 storage를 호출하지 않고, domain/data/shared 계층을 분리해서 구현합니다.

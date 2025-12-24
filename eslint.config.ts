import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      'dist',
      'node_modules',
      'build',
      '.next',
      'coverage',
      '.react-router', // React Router 생성 파일 무시
      '**/.react-router/**', // React Router 타입 파일 무시
    ],
  },
  js.configs.recommended, // ESLint 추천 규칙 적용
  ...tseslint.configs.recommended, // TypeScript ESLint 추천 규칙 적용
  ...tseslint.configs.stylistic, // TypeScript ESLint 스타일 규칙 적용
  {
    files: ['**/*.{ts,tsx}'], // ESLint가 검사할 파일 확장자 설정
    languageOptions: {
      parser: tseslint.parser, // TypeScript 파서 사용
      ecmaVersion: 'latest', // 최신 ECMAScript 버전 지원
      globals: {
        ...globals.browser, // 브라우저 전역 변수 허용
        ...globals.node, // Node.js 전역 변수 허용 (React Router SSR용)
      },
      parserOptions: {
        sourceType: 'module', // ECMAScript 모듈 사용
        ecmaFeatures: { jsx: true }, // JSX 지원
        project: './tsconfig.json', // TypeScript 프로젝트 설정 참조
      },
    },
    settings: {
      react: { version: 'detect' }, // React 버전 자동 감지
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin, // TypeScript ESLint 플러그인 명시적 추가
      react, // React ESLint 플러그인
      'react-hooks': reactHooks as any, // React Hooks 플러그인
      'react-refresh': reactRefresh, // React Fast Refresh 플러그인
      prettier: prettierPlugin, // Prettier 플러그인 추가
    },
    rules: {
      ...react.configs.recommended.rules, // React 추천 규칙 적용
      ...react.configs['jsx-runtime'].rules, // JSX 런타임 관련 규칙
      ...reactHooks.configs.recommended.rules, // React Hooks 추천 규칙 적용
      ...prettier.rules, // Prettier와 충돌하는 ESLint 규칙 비활성화

      // React 관련 규칙
      'react/jsx-no-target-blank': 'off', // target="_blank" 보안 경고 비활성화
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          // React Router는 meta, loader, action 등 함수 export 허용
          allowExportNames: ['meta', 'loader', 'action', 'headers', 'shouldRevalidate', 'handle', 'clientLoader', 'clientAction'],
        },
      ],
      'react/prop-types': 'off', // TypeScript 사용 시 불필요
      'react/react-in-jsx-scope': 'off', // React 17+ JSX Transform 사용 시 불필요

      // TypeScript 관련 규칙
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          // React Router의 Route 타입 매개변수는 사용하지 않아도 허용
          args: 'after-used',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn', // any 타입 사용 시 경고
      '@typescript-eslint/no-var-requires': 'error', // require() 사용 금지 (import 사용 권장)

      // 일반적인 코드 품질 규칙
      'no-console': 'warn', // console 사용 시 경고
      'no-debugger': 'error', // debugger 사용 금지
      'prefer-const': 'error', // let 대신 const 사용 강제
      'no-var': 'error', // var 사용 금지 (let/const 사용 권장)

      // Prettier 관련 규칙
      'prettier/prettier': ['error', { endOfLine: 'auto' }], // Prettier 규칙을 위반하면 ESLint에서 에러로 처리
    },
  },
  // React Router 서버 전용 코드 설정 (.server 디렉토리)
  {
    files: ['**/.server/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node, // 서버 코드는 Node.js 전역 변수만 사용
      },
    },
    rules: {
      'no-console': 'off', // 서버 코드에서는 console 사용 허용
    },
  },
  // React Router 클라이언트 전용 코드 설정 (.client 디렉토리)
  {
    files: ['**/.client/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser, // 클라이언트 코드는 브라우저 전역 변수만 사용
      },
    },
  },
);

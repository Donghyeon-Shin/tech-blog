import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [tailwindcss(), svgr(), reactRouter(), tsconfigPaths()],
  ssr: {
    // 에러를 일으키는 패키지를 노드 외부 모듈에서 제외하고 번들링에 포함시킵니다.
    noExternal: ['react-syntax-highlighter', 'refractor'],
  },
});

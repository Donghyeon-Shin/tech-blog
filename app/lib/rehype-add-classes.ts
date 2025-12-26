import type { Root } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

/**
 * rehype 플러그인: HTML 요소에 클래스 추가
 */
export const rehypeAddClasses: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h1') {
        node.properties = {
          ...node.properties,
          className: [
            'text-3xl',
            'scroll-mt-24',
            'font-extrabold',
            'tracking-tight',
            'mb-10',
            'mt-6',
          ],
        };
      } else if (node.tagName === 'h2') {
        node.properties = {
          ...node.properties,
          className: ['text-2xl', 'scroll-mt-20', 'font-bold', 'mb-6', 'mt-12'],
        };
      } else if (node.tagName === 'h3') {
        node.properties = {
          ...node.properties,
          className: ['text-xl', 'scroll-mt-20', 'font-semibold', 'mb-4', 'mt-8'],
        };
      } else if (node.tagName === 'h4') {
        node.properties = {
          ...node.properties,
          className: ['text-lg', 'scroll-mt-20', 'font-semibold', 'mb-4', 'mt-8'],
        };
      } else if (node.tagName === 'h5') {
        node.properties = {
          ...node.properties,
          className: ['text-base', 'scroll-mt-20', 'font-semibold', 'mb-4', 'mt-8'],
        };
      } else if (node.tagName === 'p') {
        node.properties = {
          ...node.properties,
          className: ['whitespace-pre-wrap'],
        };
      } else if (node.tagName === 'ul') {
        node.properties = {
          ...node.properties,
          className: ['list-disc', 'ml-6', 'mb-2'],
        };
      } else if (node.tagName === 'li') {
        node.properties = {
          ...node.properties,
          className: ['mb-3', 'last:mb-0', 'leading-relaxed'],
        };
      } else if (node.tagName === 'code') {
        // 인라인 코드인지 확인 (language- 클래스가 없는 경우)
        const className = node.properties?.className;
        const hasLanguageClass =
          Array.isArray(className) && className.some((c) => String(c).includes('language-'));
        const isInlineCode = !hasLanguageClass;
        if (isInlineCode) {
          node.properties = {
            ...node.properties,
            className: [
              'text-sm',
              'font-mono',
              'text-code-content-color',
              'bg-code-background',
              'p-1',
              'rounded-md',
            ],
          };
        }
      } else if (node.tagName === 'pre') {
        // 기존 className이 있으면 병합 (rehype-highlight가 추가한 hljs 클래스 유지)
        const existingClassName = Array.isArray(node.properties?.className)
          ? node.properties.className
          : node.properties?.className
            ? [String(node.properties.className)]
            : [];
        node.properties = {
          ...node.properties,
          className: [
            ...existingClassName,
            'rounded-md',
            'bg-code-background',
            'p-4',
            'border',
            'border-code-border',
            'relative',
            'block',
          ],
        };
        // pre 안의 code에도 스타일 추가 (하이라이팅 색상 유지를 위해 text-code-content-color 제거)
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach((child) => {
            if (child.type === 'element' && child.tagName === 'code') {
              const existingCodeClassName = Array.isArray(child.properties?.className)
                ? child.properties.className
                : child.properties?.className
                  ? [String(child.properties.className)]
                  : [];
              child.properties = {
                ...child.properties,
                className: [...existingCodeClassName, 'text-sm', 'font-mono', 'relative', 'z-0'],
              };
            }
          });
        }
      }
    });
  };
};

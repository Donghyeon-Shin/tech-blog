import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { rehypeAddClasses } from './rehype-add-classes';
import remarkWikiLink from 'remark-wiki-link';

/**
 * 서버 사이드에서 마크다운을 HTML로 변환
 * @param markdown 마크다운 텍스트
 * @returns HTML 문자열
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  // Zero-width space 문자 제거 (KaTeX 경고 방지)
  const cleanedMarkdown = markdown.replace(/\u200B/g, '');

  const result = await unified()
    .use(remarkParse)
    .use(remarkWikiLink, {
      hrefTemplate: (permalink: string) => {
        // 앵커가 포함된 경우 (#로 구분)
        const [slug, anchor] = permalink.split('#');
        const baseUrl = `/post/${slug}`;
        return anchor ? `${baseUrl}#${anchor}` : baseUrl;
      },
      aliasDivider: '|',
    })
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeKatex, {
      throwOnError: false,
      strict: false,
    })
    .use(rehypeSlug)
    .use(rehypeHighlight)
    .use(rehypeAddClasses) // rehypeHighlight 이후에 실행하여 클래스 병합
    .use(rehypeStringify)
    .process(cleanedMarkdown);

  return String(result);
}

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { rehypeAddClasses } from './rehype-add-classes';

/**
 * 서버 사이드에서 마크다운을 HTML로 변환
 * @param markdown 마크다운 텍스트
 * @returns HTML 문자열
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkWikiLink)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeHighlight)
    .use(rehypeAddClasses) // rehypeHighlight 이후에 실행하여 클래스 병합
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}

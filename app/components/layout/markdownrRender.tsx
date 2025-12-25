import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';
import type { Components } from 'react-markdown';
import { cn } from '~/lib/utils';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import { CopyIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const components: Components = {
  h1: ({ node: _node, ...props }) => {
    return (
      <div>
        <h1 className='text-3xl font-bold' {...props} />
      </div>
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pre: ({ node: _node, children, ...props }: any) => {
    let isFenced = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.Children.forEach(children, (child: any) => {
      if (child?.props?.className) {
        isFenced = true;
      }
    });

    if (isFenced) {
      // Fenced 코드 블록 (```)
      return (
        <div className={cn('rounded-md bg-code-background p-4 border border-code-border relative')}>
          <Button
            variant='ghost'
            size='icon'
            className='absolute top-2 right-2 z-10'
            onClick={(e) => {
              const preElement = (e.currentTarget as HTMLElement)
                .closest('div')
                ?.querySelector('pre');
              const text = preElement?.textContent || '';
              navigator.clipboard.writeText(text);
              toast.success('코드가 복사되었습니다.');
            }}
          >
            <CopyIcon className='size-4' />
          </Button>
          <pre className='text-sm font-mono text-code-content-color relative z-0' {...props}>
            {children}
          </pre>
        </div>
      );
    } else {
      // Tab 코드 블록 (들여쓰기)
      return (
        <div className={cn('rounded-md bg-code-background p-4 border border-code-border')}>
          <pre className='text-sm font-mono text-code-content-color' {...props}>
            {children}
          </pre>
        </div>
      );
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code: ({ node: _node, className, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const _language = match ? match[1] : 'plaintext';
    const isFenced = !!className; // className이 있으면 ``` 방식 (Fenced)
    const isInline = !isFenced; // className이 없으면 인라인 코드 (``)

    if (isInline) {
      // 인라인 코드 (``)
      return (
        <code
          className='text-sm font-mono text-code-content-color bg-code-background p-1 rounded-md'
          {...props}
        />
      );
    } else {
      // Fenced 코드 블록 (```) - pre 컴포넌트에서 스타일링 처리
      return (
        <SyntaxHighlighter
          style={oneDark}
          language={match?.[1]}
          PreTag='div'
          customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
          {...props}
          codeTagProps={{
            className:
              'text-sm font-mono text-code-content-color bg-code-background p-1 rounded-md inline-block',
          }}
        >
          {String(props.children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    }
  },

  li: ({ node: _node, ...props }) => {
    return <li className='list-disc mb-1' {...props} />;
  },

  a: ({ node: _node, href, children }) => {
    let to = href;
    if (href && !href.startsWith('http')) {
      to = href.replace('#/page/', '/post/');
    }
    return (
      <Link
        className='text-secondary-foreground hover:text-muted-foreground transition-colors'
        to={to as string}
      >
        {children}
      </Link>
    );
  },
};

export default function MarkdownrRender({ content }: { content: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm, remarkWikiLink]} components={components}>
      {content}
    </Markdown>
  );
}

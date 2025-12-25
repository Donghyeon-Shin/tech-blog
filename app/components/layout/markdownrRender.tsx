import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { cn } from '~/lib/utils';
import { Link } from 'react-router';

const components: Components = {
  h1: ({ node: _node, ...props }) => {
    return (
      <div>
        <h1 className='text-3xl font-bold' {...props} />
      </div>
    );
  },

  code: ({ node: _node, inline, className, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'plaintext';
    return (
      <div className={cn('rounded-md bg-code-background p-4 border border-code-border')}>
        <code className='text-sm font-mono text-code-content-color' {...props} />
      </div>
    );
  },

  li: ({ node: _node, ...props }) => {
    return <li className='list-disc mb-1' {...props} />;
  },

  link: ({ node: _node, href, children }) => {
    return (
      <Link className='text-primary underline' to={href as string}>
        {children}
      </Link>
    );
  },
};

export default function MarkdownrRender({ content }: { content: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </Markdown>
  );
}

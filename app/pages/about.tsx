import { DownloadIcon, Layers2, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

SyntaxHighlighter.registerLanguage('json', json.default || json);

export default function About() {
  return (
    <div className='flex flex-col gap-12 max-w-[1400px] md:ml-20'>
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-row gap-4'>
          <Avatar className='size-40 border-3 border-muted-foreground'>
            <AvatarImage src='https://github.com/Donghyeon-Shin.png' />
            <AvatarFallback>DH</AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-4'>
            <h1 className='text-4xl font-bold'>
              Hello, I&apos;m <span className='text-primary'>Dongle</span>
            </h1>
            <p className='text-muted-foreground text-xl font-semibold'>Undergraduate Researcher</p>
            <p className='text-muted-foreground'>
              &quot;I choose to grow at the tail of a dragon rather than lead as the head of a
              snake.&quot;
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-4 mx-4'>
          <Button variant='outline' size='lg' className='px-6 py-4 text-lg'>
            <DownloadIcon className='size-4' />
            Resume
          </Button>
          <div className='flex flex-row gap-2'>
            <MapPin className='size-4' />
            <p className='text-muted-foreground text-sm'>Seongnam, South Korea</p>
          </div>
        </div>
      </div>
      <div className='rounded-lg overflow-hidden border'>
        <div className='bg-[#282c34] px-4 py-2 border-b flex items-center gap-2'>
          <div className='flex gap-2'>
            <div className='size-3 rounded-full bg-[#ff5f56]'></div>
            <div className='size-3 rounded-full bg-[#ffbd2e]'></div>
            <div className='size-3 rounded-full bg-[#27c93f]'></div>
          </div>
          <span className='text-sm text-gray-400 ml-2'>about_me.json</span>
        </div>
        <SyntaxHighlighter
          language='json'
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: '#282c34',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
        >
          {JSON.stringify(
            {
              name: 'Donghyeon Shin',
              current_role: 'Undergraduate Researcher',
              years_of_exp: 3,
              hobbies: ['Study Tech', 'Exercise at the gym', 'Game'],
            },
            null,
            2,
          )}
        </SyntaxHighlighter>
      </div>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-row gap-4 items-center'>
          <Layers2 className='size-6 text-primary' />
          <h2 className='text-2xl font-bold'>Tech Stack</h2>
        </div>
        <div className='flex flex-col gap-3'>
          <h2 className='text-md font-semibold uppercase text-muted-foreground'>Frontend</h2>
          <div className='flex flex-row gap-4'>
            <h4 className='text-sm bg-primary/50 text-primary-foreground border rounded-md px-4 py-2'>
              React
            </h4>
            <h4 className='text-sm bg-primary/50 text-primary-foreground border rounded-md px-4 py-2'>
              React Router
            </h4>
            <h4 className='text-sm bg-primary/50 text-primary-foreground border rounded-md px-4 py-2'>
              TypeScript
            </h4>
            <h4 className='text-sm bg-primary/50 text-primary-foreground border rounded-md px-4 py-2'>
              Vue.js
            </h4>
            <h4 className='text-sm bg-primary/50 text-primary-foreground border rounded-md px-4 py-2'>
              Tailwind CSS
            </h4>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <h2 className='text-md font-semibold uppercase text-muted-foreground'>Database</h2>
          <div className='flex flex-row gap-4'>
            <h4 className='text-sm bg-primary/50 text-primary-foreground border rounded-md px-4 py-2'>
              MySQL
            </h4>
            <h4 className='text-sm bg-primary/50 text-primary-foreground border rounded-md px-4 py-2'>
              PostgreSQL
            </h4>
            <h4 className='text-sm bg-primary/50 text-primary-foreground border rounded-md px-4 py-2'>
              Supabase
            </h4>
            <h4 className='text-sm bg-primary/50 text-primary-foreground border rounded-md px-4 py-2'>
              Drizzle ORM
            </h4>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <h2 className='text-md font-semibold uppercase text-muted-foreground'>AI</h2>
          <div className='flex flex-row gap-4'>
            <h4 className='text-sm bg-primary/50 text-primary-foreground border rounded-md px-4 py-2'>
              Python
            </h4>
            <h4 className='text-sm bg-primary/50 text-primary-foreground border rounded-md px-4 py-2'>
              PyTorch
            </h4>
            <h4 className='text-sm bg-primary/50 text-primary-foreground border rounded-md px-4 py-2'>
              LangChain
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  BookOpen,
  Code,
  DownloadIcon,
  Earth,
  FilePenIcon,
  Layers2,
  MapPin,
  Microscope,
  TerminalSquareIcon,
  Waypoints,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Link } from 'react-router';
import TechBadge from '~/components/ui/techBadge';

SyntaxHighlighter.registerLanguage('json', json.default || json);

export default function About() {
  return (
    <div className='flex flex-col gap-12 max-w-[1400px] px-4 md:ml-20 md:px-0'>
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div className='flex flex-col sm:flex-row gap-4 w-full md:w-auto'>
          <Avatar className='size-40 border-3 border-muted-foreground shrink-0'>
            <AvatarImage src='https://github.com/Donghyeon-Shin.png' />
            <AvatarFallback>DH</AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-4 min-w-0'>
            <h1 className='text-2xl sm:text-4xl font-bold'>
              Hello, I&apos;m <span className='text-primary'>Dongle</span>
            </h1>
            <p className='text-muted-foreground text-lg sm:text-xl font-semibold'>
              Undergraduate Researcher
            </p>
            <p className='text-muted-foreground text-sm sm:text-base'>
              &quot;I choose to grow at the tail of a dragon rather than lead as the head of a
              snake.&quot;
            </p>
          </div>
        </div>
        <div className='flex-col gap-4 mx-4 hidden lg:flex'>
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
      <div className='rounded-lg overflow-hidden border overflow-x-auto'>
        <div className='bg-[#282c34] px-4 py-2 border-b flex items-center gap-2 min-w-fit'>
          <div className='flex gap-2 shrink-0'>
            <div className='size-3 rounded-full bg-[#ff5f56]'></div>
            <div className='size-3 rounded-full bg-[#ffbd2e]'></div>
            <div className='size-3 rounded-full bg-[#27c93f]'></div>
          </div>
          <span className='text-sm text-gray-400 ml-2 whitespace-nowrap'>about_me.json</span>
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
            minWidth: 'fit-content',
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
          <div className='flex flex-row flex-wrap gap-4'>
            <TechBadge title='React' />
            <TechBadge title='React Router' />
            <TechBadge title='TypeScript' />
            <TechBadge title='Vue.js' />
            <TechBadge title='Tailwind CSS' />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <h2 className='text-md font-semibold uppercase text-muted-foreground'>Database</h2>
          <div className='flex flex-row flex-wrap gap-4'>
            <TechBadge title='MySQL' />
            <TechBadge title='PostgreSQL' />
            <TechBadge title='Supabase' />
            <TechBadge title='Drizzle ORM' />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <h2 className='text-md font-semibold uppercase text-muted-foreground'>AI</h2>
          <div className='flex flex-row flex-wrap gap-4'>
            <TechBadge title='Python' />
            <TechBadge title='PyTorch' />
            <TechBadge title='LangChain' />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-row gap-4 items-center'>
          <FilePenIcon className='size-6 text-primary' />
          <h2 className='text-2xl font-bold'>Experience</h2>
        </div>
        <div className='relative pl-8'>
          <div className='absolute left-4 top-3 bottom-0 w-0.5 bg-primary/30 -translate-x-1/2'></div>
          {/* 경력 항목들 */}
          <div className='flex flex-col gap-8'>
            {/* 첫 번째 경력 */}
            <div className='relative'>
              <div className='absolute -left-4 top-1 size-4 rounded-full bg-primary border-2 border-background -translate-x-1/2'></div>
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4'>
                  <div className='flex flex-col gap-1 min-w-0'>
                    <h3 className='text-xl font-bold'>Undergraduate Researcher</h3>
                    <p className='text-muted-foreground'>Professional Knowledge</p>
                  </div>
                  <span className='text-primary border border-primary rounded-md px-3 py-1 text-sm whitespace-nowrap shrink-0'>
                    2025 - Present
                  </span>
                </div>
                <ul className='flex flex-col gap-2 text-muted-foreground list-disc list-inside'>
                  <li>VOM Lab Researcher</li>
                  <li>Learn Langchain and LLM</li>
                  <li>Developing a custom AI agent for document analysis</li>
                </ul>
                <div className='flex flex-row gap-2 flex-wrap'>
                  <Link
                    to='https://github.com/Donghyeon-Shin/DocumentSecretary'
                    target='_blank'
                    className='border-primary text-primary hover:bg-primary/10 border rounded-md px-3 py-1 text-sm whitespace-nowrap flex flex-row items-center gap-2'
                  >
                    <Code className='size-4' />
                    View GitHub (Project)
                  </Link>
                </div>
              </div>
            </div>

            {/* 두 번째 경력 */}
            <div className='relative'>
              <div className='absolute -left-4 top-1 size-4 rounded-full bg-primary border-2 border-background -translate-x-1/2'></div>
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4'>
                  <div className='flex flex-col gap-1 min-w-0'>
                    <h3 className='text-xl font-bold'>College student & Soldier</h3>
                    <p className='text-muted-foreground'>A variety of experiences</p>
                  </div>
                  <span className='bg-muted/50 text-muted-foreground border border-muted rounded-md px-3 py-1 text-sm whitespace-nowrap shrink-0'>
                    2022 - 2025
                  </span>
                </div>
                <ul className='flex flex-col gap-2 text-muted-foreground list-disc list-inside'>
                  <li>Entering Gachon University</li>
                  <li>Acquisition of 1 unmanned multi-copter</li>
                  <li>Acquisition of TESAT Grade 1</li>
                  <li>Study React</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-row gap-4 items-center'>
          <Earth className='size-6 text-primary' />
          <h2 className='text-2xl font-bold'>Dive Deeper</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <Link
            to='https://github.com/Donghyeon-Shin'
            target='_blank'
            className='border rounded-lg p-4 flex flex-col gap-2 bg-primary/10 px-6 py-8 hover:bg-primary/20 transition-all duration-300'
          >
            <div className='flex flex-row gap-2 items-center'>
              <TerminalSquareIcon className='size-6 text-primary' />
              <h3 className='text-xl font-bold'>GitHub Profile</h3>
            </div>
            <p className='text-muted-foreground'>
              Explore my GitHub repositories, and code activities.
            </p>
          </Link>
          <Link
            to='https://gcu-vomlab.github.io/VOM/index.html'
            target='_blank'
            className='border rounded-lg p-4 flex flex-col gap-2 bg-primary/10 px-6 py-8 hover:bg-primary/20 transition-all duration-300'
          >
            <div className='flex flex-row gap-2 items-center'>
              <Microscope className='size-6 text-primary' />
              <h3 className='text-xl font-bold'>VOM Lab</h3>
            </div>
            <p className='text-muted-foreground'>
              Introducing the major projects and achievements of the VOM Lab that challenge
              technical limitations.
            </p>
          </Link>
          <Link
            to='https://solved.ac/profile/sdh0321'
            target='_blank'
            className='border rounded-lg p-4 flex flex-col gap-2 bg-primary/10 px-6 py-8 hover:bg-primary/20 transition-all duration-300'
          >
            <div className='flex flex-row gap-2 items-center'>
              <Waypoints className='size-6 text-primary' />
              <h3 className='text-xl font-bold'>Algorithm Practice</h3>
            </div>
            <p className='text-muted-foreground'>
              View my competitive programming and algorithm problem-solving progress.
            </p>
          </Link>
          <Link
            to='/posts/all'
            className='border rounded-lg p-4 flex flex-col gap-2 bg-primary/10 px-6 py-8 hover:bg-primary/20 transition-all duration-300'
          >
            <div className='flex flex-row gap-2 items-center'>
              <BookOpen className='size-6 text-primary' />
              <h3 className='text-xl font-bold'>Tech Blog</h3>
            </div>
            <p className='text-muted-foreground'>
              A space where I document and share my technical knowledge and growth.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

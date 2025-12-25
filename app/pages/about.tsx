import { DownloadIcon, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';

export default function About() {
  return (
    <div className='flex flex-col gap-8 max-w-[1400px] md:ml-20'>
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
    </div>
  );
}

import { ArrowRightIcon, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import Searchbar from '~/components/layout/searchbar';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';

export default function NotFound() {
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  const handleCopyEmail = async () => {
    const email = 'shindong0321@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      toast.success('이메일 주소가 복사되었습니다');
    } catch {
      // 클립보드 API가 실패하면 mailto 링크로 대체
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className='flex flex-col items-center gap-8 px-8'>
      <div className='relative mt-16'>
        <h1 className='text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary/80 to-primary/10 select-none'>
          404
        </h1>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 blur-3xl opacity-20 bg-primary rounded-full'></div>
      </div>
      <div className='flex flex-col items-center gap-4 w-120'>
        <h2 className='text-2xl md:text-3xl font-bold'>Oops! This Page is missing.</h2>
        <p className='text-base md:text-lg text-muted-foreground text-center'>
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable. Maybe a search can help?
        </p>
      </div>
      <div className='flex flex-col items-center gap-6 w-100 md:w-120'>
        <Button
          variant='outline'
          className='w-full justify-start cursor-text text-muted-foreground p-6'
          onClick={() => setSearchBarOpen(true)}
        >
          <Search className='size-4' />
          <span className='text-sm font-medium'>Search for articles, projects...</span>
        </Button>
        <div className='flex flex-row gap-2 items-center'>
          <Button asChild className='w-40 p-2'>
            <Link to='/' className='text-sm font-medium'>
              Back to Home
            </Link>
          </Button>
          <Button variant='outline' className='w-40 p-2' onClick={() => handleCopyEmail()}>
            Contact Support
          </Button>
        </div>
      </div>
      <Separator />
      <div className='w-full mt-4'>
        <div className='flex flex-row gap-2 justify-between'>
          <h2 className='text-xl md:text-2xl font-bold'>
            While you&apos;re here, check out these popular posts :
          </h2>
          <Link
            to='/posts/all'
            className='hidden md:flex flex-row gap-2 items-center text-sm font-medium text-primary'
          >
            <span>View all posts</span>
            <ArrowRightIcon className='size-4' />
          </Link>
        </div>
      </div>
      <Searchbar open={searchBarOpen} setOpen={setSearchBarOpen} />
      <Toaster position='top-center' />
    </div>
  );
}

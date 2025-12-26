import { cva } from 'class-variance-authority';
import { format } from 'date-fns';
import { DotIcon, EyeIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Separator } from '~/components/ui/separator';

const categoryVariants = cva(
  'rounded-md border px-2 md:px-4 text-xs md:text-sm font-medium shrink-0',
  {
    variants: {
      category: {
        Algorithm: 'bg-[#1E293B] text-[#60A5FA]',
        Book: 'bg-[#2A1F1D] text-[#F59E0B]',
        LangChain: 'bg-[#052E2B] text-[#2DD4BF]',
        React: 'bg-[#0F172A] text-[#38BDF8]',
        Research: 'bg-[#1C1917] text-[#A78BFA]',
        SQL: 'bg-[#1F2937] text-[#34D399]',
        Project: 'bg-[#18181B] text-[#F472B6]',
      },
    },
  },
);

export default function PopularPostCard({
  title,
  description,
  category,
  date,
  link,
  views,
  readTime,
  rank,
}: {
  title: string;
  description: string;
  category: 'Algorithm' | 'Book' | 'LangChain' | 'React' | 'Research' | 'SQL' | 'Project';
  date: Date;
  link: string;
  views: number;
  readTime: number;
  rank: number;
}) {
  const formattedDate = format(date, 'MMM dd, yyyy');

  return (
    <Link
      to={link}
      className='border rounded-lg p-8 flex flex-col gap-4 hover:bg-primary/10 relative'
    >
      <div className='absolute bottom-3 right-5 lg:top-5'>
        <div className='flex flex-row gap-5 items-center h-12 lg:h-16'>
          <Separator orientation='vertical' className='h-12 lg:h-16' />
          <div className='text-muted text-3xl lg:text-4xl font-extrabold tracking-wider'>
            {rank.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
      <div className='flex flex-row gap-1 items-center text-muted-foreground w-full flex-nowrap'>
        <div className={categoryVariants({ category })}>{category}</div>
        <DotIcon className='size-4 shrink-0' />
        <div className='text-muted-foreground text-xs whitespace-nowrap shrink-0'>
          {readTime} min read
        </div>
        <DotIcon className='size-4 shrink-0' />
        <div className='text-muted-foreground text-xs whitespace-nowrap shrink-0'>
          {formattedDate}
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <p className='text-muted-foreground text-sm line-clamp-2'>{description}</p>
      </div>
      <div className='flex flex-row gap-2 items-center'>
        <EyeIcon className='size-4 text-muted-foreground ' />
        <div className='text-muted-foreground text-xs'>{views} views</div>
      </div>
    </Link>
  );
}

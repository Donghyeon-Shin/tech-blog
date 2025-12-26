import { cva } from 'class-variance-authority';
import { format } from 'date-fns';
import { ClockIcon, DotIcon } from 'lucide-react';
import { Link } from 'react-router';

const categoryVariants = cva('rounded-md border px-4 text-sm font-medium', {
  variants: {
    category: {
      Algorithm: 'bg-[#1E293B] text-[#60A5FA]',
      Book: 'bg-[#2A1F1D] text-[#F59E0B]',
      LangChain: 'bg-[#052E2B] text-[#2DD4BF]',
      React: 'bg-[#0F172A] text-[#38BDF8]',
      Research: 'bg-[#1C1917] text-[#A78BFA]',
      SQL: 'bg-[#1F2937] text-[#34D399]',
      Project: 'bg-[#18181B] text-[#F472B6]',
      null: 'bg-transparent text-primary',
    },
  },
});

export default function PostCard({
  title,
  description,
  categoryName,
  date,
  link,
  readTime,
}: {
  title: string;
  description: string;
  categoryName: string;
  date: Date;
  link: string;
  readTime: number;
}) {
  const formattedDate = format(date, 'MMM dd, yyyy');

  return (
    <Link to={link} className='border rounded-lg p-8 flex flex-col gap-4 hover:bg-primary/10'>
      <div className='flex flex-row gap-2 items-center text-muted-foreground'>
        <div
          className={categoryVariants({
            category: categoryName as
              | 'Algorithm'
              | 'Book'
              | 'LangChain'
              | 'React'
              | 'Research'
              | 'SQL'
              | 'Project'
              | 'null',
          })}
        >
          {categoryName}
        </div>
        <DotIcon className='size-5' />
        <div className='text-muted-foreground text-sm'>{formattedDate}</div>
      </div>
      <div className='flex flex-col gap-2'>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <p className='text-muted-foreground text-sm line-clamp-2'>{description}</p>
      </div>
      <div className='flex flex-row gap-2 items-center'>
        <ClockIcon className='size-4 text-muted-foreground ' />
        <div className='text-muted-foreground text-xs'>{readTime} min read</div>
      </div>
    </Link>
  );
}

import { format } from 'date-fns';
import { ClockIcon, DotIcon } from 'lucide-react';
import { Link } from 'react-router';
import { categoryColors } from '~/lib/category-config';
import type { CategoryName } from '~/lib/category-config';

function getCategoryStyle(categoryName: CategoryName) {
  if (categoryName === 'null' || !categoryName) {
    return { className: 'bg-transparent text-primary' };
  }
  const colors = categoryColors[categoryName];
  if (!colors) {
    return { className: 'bg-transparent text-primary' };
  }
  return {
    style: {
      backgroundColor: colors.bgColor,
      color: colors.textColor,
    },
    className: 'rounded-md border px-4 text-sm font-medium',
  };
}

export default function PostCard({
  title,
  description,
  categoryName,
  date,
  readTime,
}: {
  title: string;
  description: string;
  categoryName: string;
  date: Date;
  readTime: number;
}) {
  const formattedDate = format(date, 'MMM dd, yyyy');

  return (
    <Link
      to={`/post/${title}`}
      className='border rounded-lg p-8 flex flex-col gap-4 hover:bg-primary/10'
    >
      <div className='flex flex-row gap-2 items-center text-muted-foreground'>
        <div {...getCategoryStyle(categoryName as CategoryName)}>{categoryName}</div>
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

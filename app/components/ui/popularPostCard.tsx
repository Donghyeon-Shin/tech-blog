import { format } from 'date-fns';
import { DotIcon, EyeIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Separator } from '~/components/ui/separator';
import { categoryColors } from '~/lib/category-config';
import type { CategoryName } from '~/lib/category-config';

function getPopularPostCategoryStyle(category: CategoryName) {
  if (category === 'null' || !category) {
    return {
      className:
        'rounded-md border px-2 md:px-4 text-xs md:text-sm font-medium shrink-0 bg-transparent text-primary',
    };
  }
  const colors = categoryColors[category];
  if (!colors) {
    return {
      className:
        'rounded-md border px-2 md:px-4 text-xs md:text-sm font-medium shrink-0 bg-transparent text-primary',
    };
  }
  return {
    style: {
      backgroundColor: colors.bgColor,
      color: colors.textColor,
    },
    className: 'rounded-md border px-2 md:px-4 text-xs md:text-sm font-medium shrink-0',
  };
}

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
  category: CategoryName;
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
        <div {...getPopularPostCategoryStyle(category)}>{category}</div>
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

import PopularPostCard from '~/components/ui/popularPostCard';

interface Post {
  title: string;
  description: string;
  category: 'Algorithm' | 'Book' | 'LangChain' | 'React' | 'Research' | 'SQL' | 'Project';
  date: Date;
  link: string;
  views: number;
  readTime: number;
  rank: number;
}

const postList: Post[] = [
  {
    title: 'Post 1',
    description: 'Post 1 description',
    category: 'Algorithm',
    date: new Date('2025-01-01'),
    link: '/post/post-1',
    views: 10,
    readTime: 10,
    rank: 1,
  },
  {
    title: 'Post 2',
    description: 'Post 2 description',
    category: 'Book',
    date: new Date('2025-01-01'),
    link: '/post/post-2',
    views: 10,
    readTime: 10,
    rank: 2,
  },
  {
    title: 'Post 3',
    description: 'Post 3 description',
    category: 'LangChain',
    date: new Date('2025-01-01'),
    link: '/post/post-3',
    views: 10,
    readTime: 10,
    rank: 3,
  },
  {
    title: 'Post 4',
    description: 'Post 4 description',
    category: 'React',
    date: new Date('2025-01-01'),
    link: '/post/post-4',
    views: 10,
    readTime: 10,
    rank: 4,
  },
  {
    title: 'Post 5',
    description: 'Post 5 description',
    category: 'Research',
    date: new Date('2025-01-01'),
    link: '/post/post-5',
    views: 10,
    readTime: 10,
    rank: 5,
  },
];

export default function PopularPosts() {
  return (
    <div className='flex flex-col gap-8 max-w-[1400px] md:ml-20'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-4xl font-bold'>Popular Posts</h1>
        <p className='text-muted-foreground'>Most read articles on my blog</p>
      </div>
      <div className='flex flex-col gap-4'>
        {postList.map((post) => (
          <PopularPostCard
            key={post.title}
            title={post.title}
            description={post.description}
            category={post.category}
            date={post.date}
            link={post.link}
            views={post.views}
            readTime={post.readTime}
            rank={post.rank}
          />
        ))}
      </div>
    </div>
  );
}

import { ClockIcon, EyeIcon, ReceiptTextIcon, ShapesIcon } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '~/components/ui/chart';
import DashboardCard from '~/components/ui/dashboardCard';
import client from '~/supa-client';
import { getAllPostsForOverview, getViewCountByTag } from '~/api/posts/posts-api';
import type { Route } from './+types/dashboard';
import { Link } from 'react-router';

const chartConfig = {
  algorithm: {
    label: 'Algorithm',
    color: 'oklch(73.57% 0.158 251.78)',
  },
  react: {
    label: 'React',
    color: 'oklch(76.22% 0.15 237.05)',
  },
  book: {
    label: 'Book',
    color: 'oklch(73.91% 0.198 71.04)',
  },
  langchain: {
    label: 'LangChain',
    color: 'oklch(77.56% 0.169 189.69)',
  },
  research: {
    label: 'Research',
    color: 'oklch(67.54% 0.183 279.77)',
  },
  sql: {
    label: 'SQL',
    color: 'oklch(77.2% 0.182 161.46)',
  },
  project: {
    label: 'Project',
    color: 'oklch(68.17% 0.208 4.74)',
  },
} satisfies ChartConfig;

function transformViewCountByTagToChartData(
  viewCountByTag: Awaited<ReturnType<typeof getViewCountByTag>>,
) {
  // 모든 카테고리 키 목록
  const allCategoryKeys = Object.keys(chartConfig);

  // month별로 그룹화
  const groupedByMonth = viewCountByTag.reduce(
    (acc, tag) => {
      const month = tag.year_month as string;
      const categoryKey = tag.category_name.toLowerCase();
      if (!acc[month]) {
        acc[month] = { month };
        // 모든 카테고리를 0으로 초기화
        allCategoryKeys.forEach((key) => {
          acc[month][key] = 0;
        });
      }
      if (allCategoryKeys.includes(categoryKey)) {
        acc[month][categoryKey] = (acc[month][categoryKey] as number) + Number(tag.view_count);
      }
      return acc;
    },
    {} as Record<string, Record<string, number | string>>,
  );

  return Object.values(groupedByMonth).sort((a, b) =>
    (a.month as string).localeCompare(b.month as string),
  );
}

export const loader = async () => {
  const posts = await getAllPostsForOverview(client);
  const viewCountByTag = await getViewCountByTag(client);

  const totalViews = posts.reduce((acc, post) => acc + post.view_count, 0);
  const averageReadTime = posts.reduce((acc, post) => acc + post.read_time, 0) / posts.length;
  const averageReadTimeHours = Math.floor(averageReadTime / 60);
  const averageReadTimeMinutes = Math.floor(averageReadTime % 60);
  const totalPosts = posts.length;

  const mostViewedPosts = posts.sort((a, b) => b.view_count - a.view_count).slice(0, 4);

  return {
    totalViews,
    averageReadTimeHours,
    averageReadTimeMinutes,
    totalPosts,
    viewCountByTag,
    mostViewedPosts,
  };
};

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const {
    totalViews,
    averageReadTimeHours,
    averageReadTimeMinutes,
    totalPosts,
    viewCountByTag,
    mostViewedPosts,
  } = loaderData;

  return (
    <div className='flex flex-col gap-6 max-w-[1400px] md:ml-20'>
      <h1 className='text-4xl font-bold'>Overview</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
        <DashboardCard
          title='Total Views'
          value={totalViews.toLocaleString()}
          icon={<EyeIcon className='size-9 text-primary bg-primary/10 rounded-md p-2' />}
        />
        <DashboardCard
          title='Avg. Read Time'
          value={`${averageReadTimeHours}h ${averageReadTimeMinutes}m`}
          icon={<ClockIcon className='size-9 text-[#f95e27] bg-[#f95e27]/10 rounded-md p-2' />}
        />
        <DashboardCard
          title='Total Categories'
          value={'13'}
          icon={<ShapesIcon className='size-9 text-[#14b8a6] bg-[#14b8a6]/10 rounded-md p-2' />}
        />
        <DashboardCard
          title='Total Posts'
          value={totalPosts}
          icon={
            <ReceiptTextIcon className='size-9 text-[#8b45da] bg-[#8b45da]/10 rounded-md p-2' />
          }
        />
      </div>
      <Card className='w-full bg-primary/10 border-primary/20'>
        <CardHeader>
          <CardTitle>Category Views Trend</CardTitle>
          <CardDescription>Aggregated view trends for each blog category over time</CardDescription>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={transformViewCountByTagToChartData(viewCountByTag)}
                margin={{
                  left: 12,
                  right: 12,
                  top: 30,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='month'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  padding={{ left: 12, right: 12 }}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent className='flex-wrap' />} />
                <Line
                  dataKey='algorithm'
                  type='monotone'
                  stroke='var(--color-algorithm)'
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey='react'
                  type='monotone'
                  stroke='var(--color-react)'
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey='book'
                  type='monotone'
                  stroke='var(--color-book)'
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey='langchain'
                  type='monotone'
                  stroke='var(--color-langchain)'
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey='research'
                  type='monotone'
                  stroke='var(--color-research)'
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey='sql'
                  type='monotone'
                  stroke='var(--color-sql)'
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey='project'
                  type='monotone'
                  stroke='var(--color-project)'
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </CardHeader>
      </Card>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <Card className='w-full bg-primary/10 border-primary/20'>
          <CardHeader>
            <CardTitle>Views by Category</CardTitle>
            <CardDescription>Top 4 categories by percentage of views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-4'>
              {[
                { name: 'Algorithm', percentage: 45, color: 'oklch(73.57% 0.158 251.78)' },
                { name: 'React', percentage: 28, color: 'oklch(76.22% 0.15 237.05)' },
                { name: 'Book', percentage: 15, color: 'oklch(73.91% 0.198 71.04)' },
                { name: 'LangChain', percentage: 12, color: 'oklch(77.56% 0.169 189.69)' },
              ].map((category) => (
                <div key={category.name} className='flex flex-col gap-2'>
                  <div className='flex flex-row items-center justify-between'>
                    <span className='text-sm font-medium'>{category.name}</span>
                    <span className='text-sm text-muted-foreground'>{category.percentage}%</span>
                  </div>
                  <div className='h-2 w-full rounded-full bg-muted overflow-hidden'>
                    <div
                      className='h-full rounded-full transition-all'
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className='w-full bg-primary/10 border-primary/20'>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>Top 4 posts by views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-2'>
              {/* 테이블 헤더 */}
              <div className='grid grid-cols-[1fr_auto] gap-4 px-4 py-2 bg-primary/10 rounded-lg'>
                <span className='text-sm font-semibold text-muted-foreground uppercase'>
                  Post Title
                </span>
                <span className='text-sm font-semibold text-muted-foreground uppercase'>Views</span>
              </div>
              {/* 테이블 데이터 */}
              {mostViewedPosts.map((post, index) => (
                <Link
                  to={`/post/${post.post_id}`}
                  key={index}
                  className='hover:bg-primary/10 rounded-md'
                >
                  <div
                    key={index}
                    className='grid grid-cols-[1fr_auto] gap-4 items-center px-4 py-2'
                  >
                    <span className='text-sm font-medium'>{post.title}</span>
                    <span className='text-sm font-bold text-muted-foreground'>
                      {post.view_count.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

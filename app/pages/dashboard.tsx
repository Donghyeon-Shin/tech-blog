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

export default function Dashboard() {
  return (
    <div className='flex flex-col gap-12 max-w-[1400px] md:ml-20'>
      <h1 className='text-4xl font-bold'>Overview</h1>
      <div className='grid grid-cols-4 gap-4'>
        <DashboardCard
          title='Total Views'
          value={'124,592'}
          icon={<EyeIcon className='size-9 text-primary bg-primary/10 rounded-md p-2' />}
        />
        <DashboardCard
          title='Avg. Read Time'
          value={'4m 12s'}
          icon={<ClockIcon className='size-9 text-[#f95e27] bg-[#f95e27]/10 rounded-md p-2' />}
        />
        <DashboardCard
          title='Total Categories'
          value={'18'}
          icon={<ShapesIcon className='size-9 text-[#14b8a6] bg-[#14b8a6]/10 rounded-md p-2' />}
        />
        <DashboardCard
          title='Total Posts'
          value={'256'}
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
                data={[
                  {
                    month: 'Jan',
                    algorithm: 100,
                    react: 80,
                    book: 60,
                    langchain: 40,
                    research: 20,
                    sql: 10,
                    project: 5,
                  },
                  {
                    month: 'Feb',
                    algorithm: 200,
                    react: 150,
                    book: 120,
                    langchain: 80,
                    research: 40,
                    sql: 20,
                    project: 10,
                  },
                  {
                    month: 'Mar',
                    algorithm: 300,
                    react: 220,
                    book: 180,
                    langchain: 120,
                    research: 30,
                    sql: 15,
                    project: 7,
                  },
                  {
                    month: 'Apr',
                    algorithm: 400,
                    react: 290,
                    book: 240,
                    langchain: 160,
                    research: 60,
                    sql: 30,
                    project: 15,
                  },
                  {
                    month: 'May',
                    algorithm: 500,
                    react: 360,
                    book: 300,
                    langchain: 200,
                    research: 80,
                    sql: 40,
                    project: 20,
                  },
                  {
                    month: 'Jun',
                    algorithm: 600,
                    react: 430,
                    book: 360,
                    langchain: 240,
                    research: 100,
                    sql: 50,
                    project: 25,
                  },
                ]}
                margin={{
                  left: 12,
                  right: 12,
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
                <ChartLegend content={<ChartLegendContent />} />
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
    </div>
  );
}

import { ClockIcon, EyeIcon, ReceiptTextIcon, ShapesIcon } from 'lucide-react';
import DashboardCard from '~/components/ui/dashboardCard';

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
    </div>
  );
}

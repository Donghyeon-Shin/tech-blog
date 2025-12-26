export default function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className='border border-primary/20 rounded-lg flex flex-col gap-2 bg-primary/10 px-4 md:px-6 py-4 md:py-6 hover:bg-primary/20 transition-all duration-300 min-w-0'>
      <div className='flex flex-row items-center justify-between gap-2 min-w-0'>
        <h3 className='text-xs md:text-sm text-muted-foreground font-bold truncate'>{title}</h3>
        <div className='shrink-0'>{icon}</div>
      </div>
      <p className='text-xl md:text-2xl font-bold truncate'>{value}</p>
    </div>
  );
}

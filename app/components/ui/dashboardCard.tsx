export default function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className='border border-primary/20 rounded-lg flex flex-col gap-2 bg-primary/10 px-6 py-6 hover:bg-primary/20 transition-all duration-300'>
      <div className='flex flex-row items-center justify-between'>
        <h3 className='text-sm text-muted-foreground font-bold'>{title}</h3>
        {icon}
      </div>
      <p className='text-2xl font-bold'>{value}</p>
    </div>
  );
}

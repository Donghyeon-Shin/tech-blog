export default function TechBadge({ title }: { title: string }) {
  return (
    <h4 className='text-xs bg-accent/50 text-accent-foreground border rounded-md px-4 py-2'>
      {title}
    </h4>
  );
}

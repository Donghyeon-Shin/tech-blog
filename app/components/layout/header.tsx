import { CodeXmlIcon } from 'lucide-react';

export default function Header() {
  return (
    <div className='sticky top-0 z-50 w-full border-b border-border-dark bg-background backdrop-blur'>
      <div className='h-16 flex justify-between items-center px-10'>
        <div className='flex items-center gap-2'>
          <CodeXmlIcon className='size-6' />
          <p className='text-2xl font-bold'>Dongle</p>
        </div>
        <div>오른쪽</div>
      </div>
      <div
        aria-hidden='true'
        className='absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 w-[35%]'
      ></div>
    </div>
  );
}

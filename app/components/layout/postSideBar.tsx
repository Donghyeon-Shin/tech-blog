import { cva } from 'class-variance-authority';
import { Link } from 'react-router';
import { cn } from '~/lib/utils';

const actvieVariant = cva(
  'block text-xs no-underline transition-all border-l-2 border-l-oklch-32-06-285 ml-[-1.5px] truncate',
  {
    variants: {
      isActive: {
        true: 'font-bold text-primary border-l-2 border-l-primary',
        false: 'text-muted-foreground border-l-2 border-l-transparent',
      },
    },
  },
);

export default function PostSidebar({
  activeId,
  setActiveId,
  isScrollingRef,
  toc,
}: {
  activeId: string;
  setActiveId: (id: string) => void;
  isScrollingRef: React.RefObject<boolean>;
  toc: { level: number; text: string; id: string }[];
}) {
  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    // 1. 옵저버 잠금 시작
    isScrollingRef.current = true;
    setActiveId(id);

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    // 2. 스크롤이 끝날 때쯤(보통 800ms~1000ms) 잠금 해제
    // 이 시간 동안은 옵저버가 setActiveId를 호출해도 무시됩니다.
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-sm font-bold text-muted-foreground'>ON THIS PAGE</h2>
      {toc.length === 0 ? (
        <p className='text-sm text-muted-foreground'>Loading...</p>
      ) : (
        <ul className='list-none border-l-1 border-l-oklch-32-06-285 p-0'>
          {toc.map((header) => (
            <li key={header.id} className='mb-2'>
              <Link
                to={`#${header.id.toLowerCase()}`}
                className={cn(actvieVariant({ isActive: activeId === header.id }))}
                style={{
                  paddingLeft: `${header.level * 12}px`,
                }}
                onClick={(e) => handleClick(e, header.id)}
              >
                {header.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { cva } from 'class-variance-authority';
import { cn } from '~/lib/utils';
import { useRef } from 'react';

const actvieVariant = cva(
  'block text-xs no-underline transition-all border-l-2 border-l-oklch-32-06-285 ml-[-1.5px] truncate cursor-pointer',
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
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    // 기존 타이머 취소
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 옵저버 잠금 시작
    isScrollingRef.current = true;
    setActiveId(id);

    const element = document.getElementById(id);
    if (element) {
      // 스크롤 실행
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // smooth 스크롤 완료 후 잠금 해제 (보통 500-1000ms 소요)
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    } else {
      // 요소를 찾지 못한 경우 즉시 잠금 해제
      isScrollingRef.current = false;
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-sm font-bold text-muted-foreground'>ON THIS PAGE</h2>
      {toc.length === 0 ? (
        <p className='text-sm text-muted-foreground'>Loading...</p>
      ) : (
        <ul className='list-none border-l border-l-oklch-32-06-285 p-0'>
          {toc.map((header) => (
            <li key={header.id} className='mb-2'>
              <button
                type='button'
                className={cn(actvieVariant({ isActive: activeId === header.id }))}
                style={{
                  paddingLeft: `${header.level * 12}px`,
                  textAlign: 'left',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                }}
                onClick={(e) => handleClick(e, header.id)}
              >
                {header.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

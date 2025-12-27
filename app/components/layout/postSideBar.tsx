import { cva } from 'class-variance-authority';
import { cn } from '~/lib/utils';
import { useEffect, useRef } from 'react';

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
  const scrollCheckRef = useRef<number | null>(null);
  const lastScrollTopRef = useRef<number>(0);

  useEffect(() => {
    // 마운트 상태 추적
    let isMounted = true;
    
    // 스크롤 완료 감지를 위한 이벤트 리스너
    const handleScroll = () => {
      if (!isMounted || !isScrollingRef.current) return;

      // 기존 타이머와 애니메이션 프레임 취소
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (scrollCheckRef.current) {
        cancelAnimationFrame(scrollCheckRef.current);
      }

      // 스크롤이 멈췄는지 확인
      scrollCheckRef.current = requestAnimationFrame(() => {
        // 컴포넌트가 언마운트되었으면 실행하지 않음
        if (!isMounted) return;
        
        const newScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 스크롤 위치가 변경되지 않았으면 스크롤 완료로 간주
        if (Math.abs(newScrollTop - lastScrollTopRef.current) < 1) {
          scrollTimeoutRef.current = setTimeout(() => {
            // 컴포넌트가 언마운트되었으면 실행하지 않음
            if (!isMounted) return;
            
            // 추가로 100ms 대기하여 완전히 멈췄는지 확인
            const finalScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (Math.abs(finalScrollTop - lastScrollTopRef.current) < 1) {
              isScrollingRef.current = false;
            }
          }, 100);
        } else {
          lastScrollTopRef.current = newScrollTop;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      isMounted = false;
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (scrollCheckRef.current) {
        cancelAnimationFrame(scrollCheckRef.current);
      }
    };
  }, [isScrollingRef]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    // 기존 타이머와 애니메이션 프레임 취소
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    if (scrollCheckRef.current) {
      cancelAnimationFrame(scrollCheckRef.current);
    }

    // 1. 옵저버 잠금 시작 (requestAnimationFrame으로 다음 프레임에 실행하여 스크롤 시작 전에 확실히 잠금)
    requestAnimationFrame(() => {
      isScrollingRef.current = true;
      setActiveId(id);

      const element = document.getElementById(id);
      if (element) {
        // 해시 변경을 막기 위해 프로그래밍 방식으로만 스크롤
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        lastScrollTopRef.current = window.pageYOffset || document.documentElement.scrollTop;
      } else {
        // 요소를 찾지 못한 경우 잠금 해제
        isScrollingRef.current = false;
      }
    });
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

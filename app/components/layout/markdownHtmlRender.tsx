import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function MarkdownHtmlRender({
  htmlContent,
  setActiveId,
  isScrollingRef,
}: {
  htmlContent: string;
  setActiveId: (id: string) => void;
  isScrollingRef?: React.RefObject<boolean>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 마운트 상태 추적
    let isMounted = true;

    if (!containerRef.current) return;

    // 코드 블록에 복사 버튼 추가 함수
    const addCopyButtons = () => {
      if (!isMounted || !containerRef.current) return;

      const preElements = containerRef.current.querySelectorAll('pre:not(.has-copy-button)');
      preElements.forEach((preElement) => {
        const codeElement = preElement.querySelector('code');
        if (!codeElement) return;

        const code = codeElement.textContent || '';

        // 복사 버튼 추가
        const copyButton = document.createElement('button');
        copyButton.className =
          'absolute top-2 right-2 z-50 p-2 hover:bg-accent rounded-md transition-colors bg-background/90 border border-border shadow-sm';
        copyButton.setAttribute('type', 'button');
        copyButton.setAttribute('aria-label', '코드 복사');
        copyButton.innerHTML =
          '<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
        copyButton.onclick = (e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(code);
          toast.success('코드가 복사되었습니다.');
        };

        // pre 요소에 relative 클래스가 없으면 추가
        if (!preElement.classList.contains('relative')) {
          preElement.classList.add('relative');
        }
        preElement.appendChild(copyButton);
        preElement.classList.add('has-copy-button');
      });
    };

    // DOM이 준비될 때까지 대기
    const processElements = () => {
      if (!isMounted || !containerRef.current) return;

      // 헤더 스타일 적용
      const h1Elements = containerRef.current.querySelectorAll('h1');
      h1Elements.forEach((h1) => {
        if (!h1.classList.contains('styled')) {
          const wrapper = document.createElement('div');
          h1.className = 'text-3xl scroll-mt-24 font-extrabold tracking-tight mb-10 mt-6';
          h1.classList.add('styled');
          h1.parentNode?.insertBefore(wrapper, h1);
          wrapper.appendChild(h1);
        }
      });

      const h2Elements = containerRef.current.querySelectorAll('h2');
      h2Elements.forEach((h2) => {
        if (!h2.classList.contains('styled')) {
          const wrapper = document.createElement('div');
          h2.className = 'text-2xl scroll-mt-20 font-bold mb-6 mt-12';
          h2.classList.add('styled');
          h2.parentNode?.insertBefore(wrapper, h2);
          wrapper.appendChild(h2);
          // Separator 추가
          const separator = document.createElement('div');
          separator.className = 'bg-slate-200/60 h-px my-2';
          wrapper.appendChild(separator);
        }
      });

      const h3Elements = containerRef.current.querySelectorAll('h3');
      h3Elements.forEach((h3) => {
        if (!h3.classList.contains('styled')) {
          const wrapper = document.createElement('div');
          h3.className = 'text-xl scroll-mt-20 font-semibold mb-4 mt-8';
          h3.classList.add('styled');
          h3.parentNode?.insertBefore(wrapper, h3);
          wrapper.appendChild(h3);
        }
      });

      const h4Elements = containerRef.current.querySelectorAll('h4');
      h4Elements.forEach((h4) => {
        if (!h4.classList.contains('styled')) {
          const wrapper = document.createElement('div');
          h4.className = 'text-lg scroll-mt-20 font-semibold mb-4 mt-8';
          h4.classList.add('styled');
          h4.parentNode?.insertBefore(wrapper, h4);
          wrapper.appendChild(h4);
        }
      });

      const h5Elements = containerRef.current.querySelectorAll('h5');
      h5Elements.forEach((h5) => {
        if (!h5.classList.contains('styled')) {
          const wrapper = document.createElement('div');
          h5.className = 'text-base scroll-mt-20 font-semibold mb-4 mt-8';
          h5.classList.add('styled');
          h5.parentNode?.insertBefore(wrapper, h5);
          wrapper.appendChild(h5);
        }
      });

      // p 태그 스타일 적용
      const pElements = containerRef.current.querySelectorAll('p');
      pElements.forEach((p) => {
        if (!p.classList.contains('styled')) {
          p.className = 'whitespace-pre-wrap';
          p.classList.add('styled');
        }
      });

      // ul, li 스타일 적용
      const ulElements = containerRef.current.querySelectorAll('ul');
      ulElements.forEach((ul) => {
        if (!ul.classList.contains('styled')) {
          ul.className = 'list-disc ml-6 mb-2';
          ul.classList.add('styled');
        }
      });

      const liElements = containerRef.current.querySelectorAll('li');
      liElements.forEach((li) => {
        if (!li.classList.contains('styled')) {
          li.className = 'mb-3 last:mb-0 leading-relaxed';
          li.classList.add('styled');
        }
      });

      // 인라인 코드 스타일 적용
      const inlineCodeElements = containerRef.current.querySelectorAll('code:not(pre code)');
      inlineCodeElements.forEach((code) => {
        if (!code.classList.contains('styled')) {
          code.className =
            'text-sm font-mono text-code-content-color bg-code-background p-1 rounded-md';
          code.classList.add('styled');
        }
      });

      // 코드 블록에 복사 버튼 추가
      addCopyButtons();
    };

    // MutationObserver로 DOM 변경 감지하여 복사 버튼 추가
    // attributes 변경은 무시하고 childList만 감지
    const observer = new MutationObserver((mutations) => {
      // 버튼 추가로 인한 변경은 무시 (has-copy-button 클래스 추가 등)
      const hasRelevantChanges = mutations.some((mutation) => {
        if (mutation.type === 'childList') {
          // 새로 추가된 노드 중 pre 요소가 있는지 확인
          return Array.from(mutation.addedNodes).some(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE &&
              ((node as Element).tagName === 'PRE' || (node as Element).querySelector('pre')),
          );
        }
        return false;
      });

      if (hasRelevantChanges) {
        addCopyButtons();
      }
    });

    // 초기 실행
    const timeoutId = setTimeout(() => {
      if (!isMounted) return;

      processElements();
      addCopyButtons();

      // DOM 변경 감지 시작 (childList만 감지)
      if (containerRef.current) {
        observer.observe(containerRef.current, {
          childList: true,
          subtree: true,
          attributes: false, // attributes 변경은 무시
        });
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [htmlContent]);

  useEffect(() => {
    // 마운트 상태 추적
    let isMounted = true;

    // 옵저버 설정
    let observer: IntersectionObserver | null = null;
    const timeoutId = setTimeout(() => {
      // 컴포넌트가 언마운트되었으면 실행하지 않음
      if (!isMounted || !containerRef.current) return;

      observer = new IntersectionObserver(
        (entries) => {
          // 컴포넌트가 언마운트되었으면 실행하지 않음
          if (!isMounted) return;

          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // 스크롤 중이 아닐 때만 activeId 업데이트
              if (!isScrollingRef?.current) {
                setActiveId(entry.target.id);
              }
            }
          });
        },
        { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
      );

      const headerElements = containerRef.current?.querySelectorAll(
        'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]',
      );
      headerElements?.forEach((el) => observer?.observe(el));
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [htmlContent, setActiveId, isScrollingRef]);

  return (
    <div
      ref={containerRef}
      className='markdown-content flex flex-col gap-4'
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

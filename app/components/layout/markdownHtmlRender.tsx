import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import GitHubSlugger from 'github-slugger';

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

  // 코드 블록에 복사 버튼 추가 함수
  const addCopyButtons = () => {
    if (!containerRef.current) return;

    const preElements = containerRef.current.querySelectorAll('pre:not(.has-copy-button)');
    preElements.forEach((preElement) => {
      const codeElement = preElement.querySelector('code');
      if (!codeElement) return;

      const code = codeElement.textContent || '';

      // 이미 래퍼로 감싸져 있는지 확인
      const parent = preElement.parentElement;
      const isWrapped = parent?.classList.contains('code-block-wrapper');

      // 래퍼가 없으면 생성
      let wrapper: HTMLDivElement;
      if (!isWrapped) {
        wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper relative my-4';
        preElement.parentNode?.insertBefore(wrapper, preElement);
        wrapper.appendChild(preElement);
      } else {
        wrapper = parent as HTMLDivElement;
      }

      // 복사 버튼 추가
      const copyButton = document.createElement('button');
      copyButton.className =
        'absolute top-2 right-2 z-10 p-2 hover:bg-accent rounded-md transition-colors bg-background/90 border border-border shadow-sm';
      copyButton.setAttribute('type', 'button');
      copyButton.setAttribute('aria-label', '코드 복사');
      copyButton.innerHTML =
        '<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
      copyButton.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        toast.success('코드가 복사되었습니다.');
      };

      // pre 요소에 스타일 적용 (반응형 스크롤 및 텍스트 크기)
      preElement.classList.add('relative', 'overflow-x-auto', 'custom-scrollbar');
      (preElement as HTMLElement).style.whiteSpace = 'pre';
      (preElement as HTMLElement).style.maxWidth = '100%';

      // code 요소 스타일 적용
      if (codeElement) {
        (codeElement as HTMLElement).style.whiteSpace = 'pre';
        (codeElement as HTMLElement).style.display = 'block';
        codeElement.classList.add('text-sm', 'md:text-base'); // Code 블록 반응형
      }

      // 래퍼에 복사 버튼 추가 (이미 있으면 추가하지 않음)
      if (!wrapper.querySelector('.code-copy-button')) {
        copyButton.classList.add('code-copy-button');
        wrapper.appendChild(copyButton);
      }

      preElement.classList.add('has-copy-button');
    });
  };

  useEffect(() => {
    // 마운트 상태 추적
    let isMounted = true;

    if (!containerRef.current) return;

    // DOM이 준비될 때까지 대기
    const processElements = () => {
      if (!isMounted || !containerRef.current) return;

      const slugger = new GitHubSlugger(); // 여기서도 동일한 slugger 인스턴스 사용
      const headers = containerRef.current.querySelectorAll('h1, h2, h3, h4, h5');

      // 헤더 스타일 설정 매핑
      const headerStyles: Record<string, { className: string; hasSeparator?: boolean }> = {
        H1: {
          className: 'text-2xl md:text-3xl scroll-mt-24 font-extrabold tracking-tight my-5',
          hasSeparator: true,
        },
        H2: {
          className: 'text-xl md:text-2xl scroll-mt-20 font-bold mb-2 mt-12',
          hasSeparator: true,
        },
        H3: {
          className: 'text-lg md:text-xl scroll-mt-20 font-semibold mb-2 mt-8 text-cyan-200',
          hasSeparator: false,
        },
        H4: {
          className: 'text-base md:text-lg scroll-mt-20 font-medium mt-4',
          hasSeparator: false,
        },
        H5: {
          className: 'text-sm md:text-base scroll-mt-20 font-semibold mb-4 mt-8',
          hasSeparator: false,
        },
      };

      // 헤더 스타일 적용
      headers.forEach((header) => {
        if (!header.classList.contains('styled')) {
          // ID 설정
          if (!header.id) {
            header.id = slugger.slug(header.textContent || '');
          }

          const tagName = header.tagName;
          const style = headerStyles[tagName];

          if (style) {
            const wrapper = document.createElement('div');
            header.className = style.className;
            header.classList.add('styled');

            // Separator 추가 (h1, h2만)
            if (style.hasSeparator) {
              const separator = document.createElement('div');
              separator.className = 'bg-border h-px my-2 w-50%';
              header.parentNode?.insertBefore(wrapper, header);
              wrapper.appendChild(header);
              wrapper.appendChild(separator);
            } else {
              header.parentNode?.insertBefore(wrapper, header);
              wrapper.appendChild(header);
            }
          }
        }
      });

      // p 태그 스타일 적용
      const pElements = containerRef.current.querySelectorAll('p');
      pElements.forEach((p) => {
        if (!p.classList.contains('styled')) {
          p.className =
            'text-sm md:text-base whitespace-pre-wrap break-words overflow-wrap-anywhere';
          p.classList.add('styled');
        }
      });

      // ul, ol, li 스타일 적용
      const ulElements = containerRef.current.querySelectorAll('ul');
      ulElements.forEach((ul) => {
        if (!ul.classList.contains('styled')) {
          ul.className = 'text-sm md:text-base list-disc ml-6 mb-2';
          ul.classList.add('styled');
        }
      });

      const olElements = containerRef.current.querySelectorAll('ol');
      olElements.forEach((ol) => {
        if (!ol.classList.contains('styled')) {
          ol.className = 'text-sm md:text-base list-decimal ml-6 mb-2';
          ol.classList.add('styled');
        }
      });

      const liElements = containerRef.current.querySelectorAll('li');
      liElements.forEach((li) => {
        if (!li.classList.contains('styled')) {
          li.className = 'text-sm md:text-base mb-3 last:mb-0 leading-relaxed';
          li.classList.add('styled');
        }

        // 중첩된 리스트 처리
        const nestedList = li.querySelector('ul, ol');
        if (nestedList) {
          // 부모 li에 margin-bottom 추가
          li.classList.add('mb-4', 'relative');

          // 중첩된 리스트에 스타일 추가
          (nestedList as HTMLElement).classList.add(
            'mt-3',
            'ml-6',
            'mb-2',
            'space-y-2',
            'pl-4',
            'relative',
          );

          // 세로선만 별도 div로 추가 (리스트 내용은 그대로 두고 세로선만 이동)
          const lineDiv = document.createElement('div');
          lineDiv.className = 'absolute top-0 bottom-0 w-0.5 bg-zinc-600 pointer-events-none';
          lineDiv.style.left = '-2.5rem';
          nestedList.insertBefore(lineDiv, nestedList.firstChild);

          // 중첩된 리스트의 각 항목에 패딩 추가
          const nestedItems = nestedList.querySelectorAll('li');
          nestedItems.forEach((nestedItem) => {
            (nestedItem as HTMLElement).classList.add('pl-2');
          });
        }
      });

      // 인라인 코드 스타일 적용
      const inlineCodeElements = containerRef.current.querySelectorAll('code:not(pre code)');
      inlineCodeElements.forEach((code) => {
        if (!code.classList.contains('styled')) {
          code.className =
            'text-xs md:text-sm font-mono text-code-content-color bg-code-background p-1 rounded-md break-words whitespace-pre-wrap';
          code.classList.add('styled');
        }
      });

      // a 태그 스타일 적용
      const aElements = containerRef.current.querySelectorAll('a');
      aElements.forEach((a) => {
        if (!a.classList.contains('styled')) {
          a.className =
            'text-sm md:text-base hover:text-primary/80 underline underline-offset-4 transition-colors';
          a.classList.add('styled');
        }
      });

      // 인용구(>) 스타일 적용
      const quoteElements = containerRef.current.querySelectorAll('blockquote');
      quoteElements.forEach((quote) => {
        if (!quote.classList.contains('styled')) {
          quote.className =
            'text-sm md:text-base border-l-4 border-primary/50 bg-muted/30 p-4 my-4 italic rounded-r-md';
          quote.classList.add('styled');
        }
      });

      // table 스타일 적용
      const tableElements = containerRef.current.querySelectorAll('table');
      tableElements.forEach((table) => {
        if (!table.classList.contains('styled')) {
          // 테이블을 감싸는 wrapper div 생성 (스크롤용)
          const wrapper = document.createElement('div');
          wrapper.className = 'overflow-x-auto my-4 custom-scrollbar';
          wrapper.style.width = '100%';

          // 테이블에 최소 너비 설정 (작은 화면에서 스크롤 가능하도록)
          (table as HTMLElement).style.tableLayout = 'auto';
          (table as HTMLElement).style.width = 'auto';
          table.className =
            'border-collapse border border-border rounded-lg text-sm md:text-base sm:min-w-[800px]';
          table.classList.add('styled');

          // 부모 노드에 wrapper 삽입하고 테이블을 wrapper 안으로 이동
          const parent = table.parentNode;
          if (parent) {
            parent.insertBefore(wrapper, table);
            wrapper.appendChild(table);
          }
        }
      });

      // thead 스타일 적용
      const tableheadElements = containerRef.current.querySelectorAll('thead');
      tableheadElements.forEach((tablehead) => {
        if (!tablehead.classList.contains('styled')) {
          tablehead.className = 'bg-muted/30';
          tablehead.classList.add('styled');
        }
      });

      // th 스타일 적용
      const thElements = containerRef.current.querySelectorAll('th');
      thElements.forEach((th) => {
        if (!th.classList.contains('styled')) {
          (th as HTMLElement).className =
            'px-4 py-2 text-left font-semibold bg-muted border-b border-muted';
          th.classList.add('styled');
        }
      });

      // td 스타일 적용
      const tdElements = containerRef.current.querySelectorAll('td');
      tdElements.forEach((td) => {
        if (!td.classList.contains('styled')) {
          const row = (td as HTMLElement).parentElement;
          const rowIndex = Array.from(row?.parentElement?.children || []).indexOf(row as Element);

          (td as HTMLElement).className = 'px-4 py-2 text-muted-foreground';
          td.classList.add('styled');

          // td 안의 이미지 크기 고정
          const images = td.querySelectorAll('img');
          images.forEach((img) => {
            (img as HTMLElement).style.width = '100px';
            (img as HTMLElement).style.height = '100px';
            (img as HTMLElement).style.objectFit = 'cover';
            (img as HTMLElement).classList.add('rounded');
          });

          // 짝수 행에 배경색 추가 (zebra striping)
          if (rowIndex % 2 === 1) {
            row?.classList.add('bg-muted');
          }
        }
      });

      // tbody tr 호버 효과
      const trElements = containerRef.current.querySelectorAll('tbody tr');
      trElements.forEach((tr) => {
        if (!tr.classList.contains('styled')) {
          (tr as HTMLElement).classList.add('hover:bg-primary/10', 'transition-colors', 'styled');
        }
      });

      // Wiki 링크 스타일 적용 (remark-wiki-link가 생성한 링크)
      // /post/로 시작하는 내부 링크에 스타일 적용
      const wikiLinks = containerRef.current.querySelectorAll('a[href^="/post/"]');
      wikiLinks.forEach((link) => {
        if (!link.classList.contains('wiki-link-styled')) {
          link.classList.add(
            'text-sm md:text-base',
            'hover:text-primary/80',
            'underline',
            'underline-offset-4',
            'transition-colors',
            'wiki-link-styled',
          );
        }
      });

      // PDF 이미지 링크 처리 (PDF 뷰어로 변환)
      const pdfImages = containerRef.current.querySelectorAll('img:not([data-pdf-processed])');
      pdfImages.forEach((img) => {
        const src = img.getAttribute('src');
        if (!src || !src.toLowerCase().endsWith('.pdf')) return;

        const alt = img.getAttribute('alt') || '';
        if (!alt.includes('PDF') && !alt.includes('pdf')) return;

        img.setAttribute('data-pdf-processed', 'true');

        // 1. PDF 임베드 컨테이너 (종횡비 유지용 래퍼)
        const pdfContainer = document.createElement('div');
        // 고정 높이 대신 상대적 위치와 너비 설정
        pdfContainer.className =
          'relative w-full my-6 rounded-md overflow-hidden border border-border shadow-sm';
        pdfContainer.setAttribute('data-pdf-container', 'true');

        // A4 비율(1:1.414)을 유지하기 위한 트릭
        pdfContainer.style.height = '0';
        pdfContainer.style.paddingBottom = '141.4%'; // 가로 너비 대비 세로 비율

        const pdfIframe = document.createElement('iframe');
        pdfIframe.src = src;
        // 2. iframe을 컨테이너에 꽉 채우기
        pdfIframe.className = 'absolute top-0 left-0 w-full h-full border-0';
        pdfIframe.setAttribute('title', alt || 'PDF 보기');
        pdfIframe.setAttribute('loading', 'lazy');

        pdfContainer.appendChild(pdfIframe);

        // 3. 모바일에서 보기 힘들 수 있으므로 다운로드/새창 링크 추가 (선택 사항)
        const downloadButtonWrapper = document.createElement('div');
        downloadButtonWrapper.className = 'flex justify-end';

        const downloadButton = document.createElement('button');
        downloadButton.className =
          'text-xs md:text-sm bg-transparent text-accent-foreground hover:cursor-pointer hover:underline';
        downloadButton.innerText = '새 창에서 PDF 열기';
        downloadButton.onclick = () => {
          window.open(src, '_blank');
        };

        downloadButtonWrapper.appendChild(downloadButton);

        // 이미지를 컨테이너로 교체
        const parent = img.parentNode;
        if (parent) {
          parent.replaceChild(pdfContainer, img);
          // 컨테이너 이전에 다운로드 버튼 wrapper 삽입
          parent.insertBefore(downloadButtonWrapper, pdfContainer);
        }
      });

      // !<video> 형식의 텍스트 노드를 비디오로 변환 (마크다운 파서가 처리하지 못한 경우)
      const textNodes: Text[] = [];
      const walker = document.createTreeWalker(containerRef.current, NodeFilter.SHOW_TEXT, null);
      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent?.includes('!<video')) {
          textNodes.push(node as Text);
        }
      }

      textNodes.forEach((textNode) => {
        const text = textNode.textContent || '';
        const videoMatch = text.match(/!<video[^>]*>.*?<\/video>/s);
        if (!videoMatch) return;

        const videoHtml = videoMatch[0].replace(/^!/, ''); // ! 제거
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = videoHtml;

        const videoElement = tempDiv.querySelector('video');
        if (videoElement) {
          videoElement.className = 'w-full rounded-md my-4';
          videoElement.setAttribute('data-video-styled', 'true');
          if (!videoElement.hasAttribute('controls')) {
            videoElement.setAttribute('controls', '');
          }

          // 텍스트 노드를 비디오로 교체
          const parent = textNode.parentNode;
          if (parent) {
            const newText = text.replace(videoMatch[0], '');
            if (newText.trim()) {
              parent.insertBefore(document.createTextNode(newText), textNode);
            }
            parent.insertBefore(videoElement, textNode);
            parent.removeChild(textNode);
          }
        }
      });

      // 비디오 태그 처리 및 스타일 적용
      const videoElements = containerRef.current.querySelectorAll('video:not([data-video-styled])');
      videoElements.forEach((video) => {
        video.setAttribute('data-video-styled', 'true');
        if (!video.hasAttribute('controls')) {
          video.setAttribute('controls', '');
        }
        video.className = 'w-full rounded-md my-4';
      });

      // data-video-src 속성이 있는 요소를 비디오로 변환
      const videoPlaceholders = containerRef.current.querySelectorAll('[data-video-src]');
      videoPlaceholders.forEach((placeholder) => {
        const src = placeholder.getAttribute('data-video-src');
        if (!src) return;

        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.className = 'w-full rounded-md my-4';
        video.setAttribute('data-video-styled', 'true');

        const source = document.createElement('source');
        source.src = src;
        const ext = src.split('.').pop()?.toLowerCase();
        if (ext === 'mp4') source.type = 'video/mp4';
        else if (ext === 'webm') source.type = 'video/webm';
        else if (ext === 'mov') source.type = 'video/quicktime';
        video.appendChild(source);

        placeholder.parentNode?.replaceChild(video, placeholder);
      });

      // 코드 블록에 복사 버튼 추가
      addCopyButtons();

      // SVG 이미지를 인라인으로 렌더링
      const imgElements = containerRef.current.querySelectorAll('img:not([data-svg-processed])');
      imgElements.forEach((img) => {
        const src = img.getAttribute('src');
        if (!src || !src.toLowerCase().endsWith('.svg')) {
          // 일반 이미지 에러 처리
          if (!img.hasAttribute('data-error-handled')) {
            img.setAttribute('data-error-handled', 'true');
            img.addEventListener('error', () => {
              const imgElement = img as HTMLImageElement;
              imgElement.style.display = 'none';
            });
          }
          return;
        }

        // SVG 처리 시작
        img.setAttribute('data-svg-processed', 'true');

        fetch(src)
          .then((response) => {
            // 404나 다른 에러 응답 체크
            if (!response.ok) {
              throw new Error(`Failed to load SVG: ${response.status}`);
            }
            return response.text();
          })
          .then((svgText) => {
            // 마운트 상태와 img 존재 여부 재확인
            if (!isMounted || !img.parentNode || !img.hasAttribute('data-svg-processed')) return;

            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            const svgElement = svgDoc.documentElement;

            // 파싱 에러 체크
            if (svgDoc.querySelector('parsererror')) return;

            // 스타일 적용
            svgElement.classList.add('max-w-full', 'h-auto', 'rounded-md', 'my-4');
            const alt = img.getAttribute('alt');
            if (alt) svgElement.setAttribute('aria-label', alt);

            // SVG에도 처리 완료 표시
            svgElement.setAttribute('data-svg-rendered', 'true');

            // 교체
            img.parentNode.replaceChild(svgElement, img);
          })
          .catch(() => {
            // 실패하면 원본 img 그대로 사용 (data-svg-processed는 유지해서 재시도 방지)
            // 이미지가 없으면 숨김 처리
            if (img.parentNode) {
              const imgElement = img as HTMLImageElement;
              imgElement.style.display = 'none';
            }
          });
      });
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

  // htmlContent가 변경될 때만 HTML 업데이트
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = htmlContent;

    // HTML 업데이트 후 복사 버튼 추가
    const timeoutId = setTimeout(() => {
      addCopyButtons();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [htmlContent]);

  return <div ref={containerRef} className='markdown-content flex flex-col gap-4' />;
}

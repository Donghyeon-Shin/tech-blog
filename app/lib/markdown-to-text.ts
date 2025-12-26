/**
 * 마크다운 텍스트에서 마크다운 문법을 제거하고 순수 텍스트만 추출
 * @param markdown 마크다운 텍스트
 * @param maxLength 최대 길이 (기본값: 100)
 * @returns 순수 텍스트
 */
export function markdownToText(markdown: string, maxLength = 100): string {
  if (!markdown) return '';

  let text = markdown;

  // 코드 블록 제거 (```...```)
  text = text.replace(/```[\s\S]*?```/g, '');

  // 인라인 코드 제거 (`...`)
  text = text.replace(/`[^`]*`/g, '');

  // 헤더 제거 (# ## ### 등)
  text = text.replace(/^#{1,6}\s+/gm, '');

  // 볼드/이탤릭 제거 (**text**, *text*, __text__, _text_)
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');

  // 링크 제거 ([text](url)) - 텍스트만 남김
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 이미지 제거 (![alt](url))
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');

  // 리스트 마커 제거 (-, *, +, 숫자.)
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');
  text = text.replace(/^[\s]*\d+\.\s+/gm, '');

  // 수평선 제거 (---, ***)
  text = text.replace(/^[-*]{3,}$/gm, '');

  // 인용구 제거 (>)
  text = text.replace(/^>\s+/gm, '');

  // HTML 태그 제거
  text = text.replace(/<[^>]+>/g, '');

  // 줄바꿈을 공백으로 변환 (문장이 끊기지 않도록)
  text = text.replace(/\n+/g, ' ');

  // 여러 공백을 하나로 정리
  text = text.replace(/[ \t]+/g, ' ');
  text = text.trim();

  // 최대 길이 제한 - 공백 기준으로만 자르기 (단어 중간에서 끊기지 않도록)
  if (text.length > maxLength) {
    // 더 넓은 범위에서 공백 찾기 (최대 50자 더 뒤까지)
    const searchRange = Math.min(maxLength + 50, text.length);
    const searchText = text.slice(0, searchRange);
    const lastSpace = searchText.lastIndexOf(' ');

    // 공백을 찾았으면 그 위치에서 자르기, 못 찾았으면 maxLength에서 자르기
    if (lastSpace > 0 && lastSpace >= maxLength * 0.3) {
      // 최소 30% 이상의 위치에 공백이 있으면 사용
      text = searchText.slice(0, lastSpace).trim();
    } else {
      // 공백을 찾지 못했거나 너무 앞에 있으면 maxLength에서 자르기
      text = text.slice(0, maxLength).trim();
    }
    text += '...';
  }

  return text;
}

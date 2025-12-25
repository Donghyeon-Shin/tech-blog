import { useSearchParams, useLocation } from 'react-router';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
} from '~/components/ui/pagination';

function getPageNumbers(currentPage: number, totalPages: number, delta = 2) {
  const pages: (number | 'ellipsis')[] = [];

  // 총 페이지가 1개 이하면 빈 배열 반환
  if (totalPages <= 1) {
    return pages;
  }

  // 첫 페이지
  pages.push(1);

  // 현재 페이지 주변 범위 계산
  const start = Math.max(2, currentPage - delta);
  const end = Math.min(totalPages - 1, currentPage + delta);

  // 시작 생략 표시
  if (start > 2) {
    pages.push('ellipsis');
  }

  // 현재 페이지 주변 페이지들
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // 끝 생략 표시
  if (end < totalPages - 1) {
    pages.push('ellipsis');
  }

  // 마지막 페이지 (첫 페이지와 다를 때만)
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export default function PostPagination({ totalPages }: { totalPages: number }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const page = Math.max(1, Math.min(totalPages, Number(searchParams.get('page') || 1)));

  const createPageUrl = (pageNum: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (pageNum === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', pageNum.toString());
    }
    const queryString = newSearchParams.toString();
    return `${location.pathname}${queryString ? `?${queryString}` : ''}`;
  };

  const handlePageClick = (pageNum: number, event?: React.MouseEvent) => {
    event?.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    if (pageNum === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', pageNum.toString());
    }
    setSearchParams(newSearchParams);
  };

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        {/* 이전 버튼 */}
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              to={createPageUrl(page - 1)}
              onClick={(e) => handlePageClick(page - 1, e)}
            />
          </PaginationItem>
        )}

        {/* 페이지 번호들 */}
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                to={createPageUrl(pageNum)}
                isActive={pageNum === page}
                onClick={(e) => handlePageClick(pageNum, e)}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* 다음 버튼 */}
        {page < totalPages && (
          <PaginationItem>
            <PaginationNext
              to={createPageUrl(page + 1)}
              onClick={(e) => handlePageClick(page + 1, e)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

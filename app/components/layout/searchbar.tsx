import type { getAllPostsForBuildingCategoriesTree, searchPosts } from '~/api/posts/posts-api';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Link, useFetcher } from 'react-router';
import { useEffect, useState } from 'react';

export default function Searchbar({
  open,
  setOpen,
  posts,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  posts: Awaited<ReturnType<typeof getAllPostsForBuildingCategoriesTree>>;
}) {
  const fetcher = useFetcher();
  const [searchTerm, setSearchTerm] = useState('');

  // 다이얼로그가 닫힐 때 searchValue 초기화
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchTerm('');
    }
  };

  useEffect(() => {
    // 300ms 디바운스 적용
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        // Resource Route 호출 (URL 변경 없음)
        fetcher.load(`/api/search/${encodeURIComponent(searchTerm.trim())}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const filteredPosts = posts
    .filter((post) => post.category_id !== null)
    .sort((a, b) => (a.category_id || 0) - (b.category_id || 0));

  // searchTerm이 있을 때만 검색 결과 사용 (다이얼로그가 닫히면 searchTerm이 빈 문자열이 되므로 검색 결과도 초기화됨)
  const isSearching = searchTerm.trim().length >= 2;
  const searchResults = isSearching
    ? (fetcher.data?.posts as Awaited<ReturnType<typeof searchPosts>>) || []
    : [];

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange} shouldFilter={false}>
      <CommandInput
        value={searchTerm}
        onValueChange={setSearchTerm}
        placeholder='Search documents...'
      />
      <CommandList>
        {isSearching ? (
          // 검색 결과 표시
          <>
            {fetcher.state === 'loading' && <CommandEmpty>Searching...</CommandEmpty>}
            {fetcher.state !== 'loading' && searchResults.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            {fetcher.state !== 'loading' && searchResults.length > 0 && (
              <CommandGroup heading='Documents'>
                {searchResults.map((post) => (
                  <CommandItem key={post.post_id}>
                    <Link to={`/post/${post.title}`}>{post.title}</Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        ) : (
          // 기본 포스트 목록 표시
          <CommandGroup heading='Documents'>
            {filteredPosts.map((post) => (
              <CommandItem key={post.post_id}>
                <Link to={`/post/${post.title}`}>{post.title}</Link>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

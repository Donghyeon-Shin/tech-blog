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
import { File, FileTerminal } from 'lucide-react';

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
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      shouldFilter={false}
      className='md:min-w-[800px]'
    >
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
                {searchResults.map((post) =>
                  post.found_in_title ? (
                    // 제목에 키워드가 포함되었으면 제목만 표시
                    <Link
                      to={`/post/${post.title}`}
                      key={post.post_id}
                      onClick={() => handleOpenChange(false)}
                      className='**:cursor-pointer'
                    >
                      <CommandItem>
                        <FileTerminal className='size-4' />
                        {post.title}
                      </CommandItem>
                    </Link>
                  ) : (
                    // 제목에 키워드가 포함되지 않았으면 본문 내용 중 일부를 표시
                    <Link
                      to={`/post/${post.title}`}
                      key={post.post_id}
                      onClick={() => handleOpenChange(false)}
                      className='**:cursor-pointer'
                    >
                      <CommandItem>
                        <div className='bg-primary/10 border border-primary/20 rounded-md p-2 text-muted-foreground flex flex-col gap-2'>
                          <div className='flex flex-row gap-2 items-center'>
                            <File className='size-4 text-foreground' />
                            <div className='text-foreground text-sm font-medium'>{post.title}</div>
                          </div>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: post.context_snippet.replace(
                                /<b>/g,
                                '<b class="text-white/80 bg-primary/20 rounded-sm p-1">',
                              ),
                            }}
                            className='line-clamp-3'
                          />
                        </div>
                      </CommandItem>
                    </Link>
                  ),
                )}
              </CommandGroup>
            )}
          </>
        ) : (
          // 기본 포스트 목록 표시
          <CommandGroup heading='Documents'>
            {filteredPosts.map((post) => (
              <Link
                to={`/post/${post.title}`}
                key={post.post_id}
                onClick={() => handleOpenChange(false)}
                className='**:cursor-pointer'
              >
                <CommandItem>
                  <FileTerminal className='size-4' />
                  {post.title}
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

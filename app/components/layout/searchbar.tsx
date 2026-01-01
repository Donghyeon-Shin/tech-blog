import type { getAllPostsForBuildingCategoriesTree } from '~/api/posts/posts-api';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Link } from 'react-router';

export default function Searchbar({
  open,
  setOpen,
  posts,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  posts: Awaited<ReturnType<typeof getAllPostsForBuildingCategoriesTree>>;
}) {
  const filteredPosts = posts
    .filter((post) => post.category_id !== null)
    .sort((a, b) => (a.category_id || 0) - (b.category_id || 0));

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Search documents...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading='Documents'>
          {filteredPosts.map((post) => (
            <CommandItem key={post.post_id}>
              <Link to={`/post/${post.title}`}>{post.title}</Link>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

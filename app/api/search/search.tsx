import { redirect } from 'react-router';
import type { Route } from './+types/search';
import { z } from 'zod';

const searchTermSchema = z.string().min(1);

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { searchTerm } = params;
  const { success, data } = searchTermSchema.safeParse(searchTerm);
  if (!success) {
    return redirect(`/`);
  }
  const posts = await searchPosts(data);
  return json({ posts });
};

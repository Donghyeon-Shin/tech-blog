import { redirect } from 'react-router';
import type { Route } from './+types/search';
import { z } from 'zod';
import { client } from '~/supa-client';
import { searchPosts } from '../posts/posts-api';
const searchTermSchema = z.string().min(1);

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { searchTerm } = params;
  const { success, data } = searchTermSchema.safeParse(searchTerm);
  if (!success) {
    return redirect(`/`);
  }
  const posts = await searchPosts(client, data);
  return { posts };
};

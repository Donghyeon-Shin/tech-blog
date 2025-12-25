import { redirect } from 'react-router';

export async function loader() {
  // redicrect to /posts/all
  return redirect('/posts/all');
}

export default function Index() {
  return null;
}

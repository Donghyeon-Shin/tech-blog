import type { Database } from '~/types/database';
import type { FolderItemProps } from '~/types/folderItemProps';

export const buildCategoriesTree = (
  categories: Database['public']['Tables']['categories']['Row'][],
  posts: Database['public']['Views']['posts_with_excerpt']['Row'][],
  parentId: number | null,
): FolderItemProps[] => {
  // A. 현재 레벨의 카테고리(폴더)들을 먼저 구성
  const categoryNodes: FolderItemProps[] = categories
    .filter((cat) => cat.parent_id === parentId)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((cat) => {
      // 재귀적으로 하위 카테고리와 포스트들을 가져옴
      const children = buildCategoriesTree(categories, posts, cat.category_id);

      return {
        id: cat.category_id,
        name: cat.name,
        isFolder: true,
        children: children.length > 0 ? children : undefined,
      };
    });

  // B. 현재 카테고리(parentId)에 바로 속해 있는 포스트(파일)들을 구성
  const postNodes: FolderItemProps[] = posts
    .filter((post) => post.category_id === parentId)
    .map((post) => ({
      name: post.title,
      isFolder: false, // 파일이므로 false
      id: post.post_id, // 상세 페이지 이동 경로
    }));

  // C. 폴더와 파일을 합쳐서 반환 (보통 폴더가 위에 오도록 합칩니다)
  return [...categoryNodes, ...postNodes];
};

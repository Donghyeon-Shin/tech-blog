import { Outlet, useOutletContext } from 'react-router';
import LeftSidebar from './leftSideBar';
import type { FolderItemProps } from '~/types/folderItemProps';
import type { Route } from '../../+types/root';

export default function LeftSidebarLayout() {
  const { loaderData } = useOutletContext<{
    loaderData: Route.ComponentProps['loaderData'];
  }>();
  return (
    <div className='mx-auto xl:mx-20 grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-8 px-6 py-8'>
      <LeftSidebar
        categoriesTree={loaderData.categoriesTree as FolderItemProps[]}
        events={loaderData.events}
      />
      <Outlet
        context={{
          topLevelCategories: loaderData?.topLevelCategories,
          allCategories: loaderData?.categories,
        }}
      />
    </div>
  );
}

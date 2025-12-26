import { useState } from 'react';
import { NavLink } from 'react-router';
import { ChevronRight } from 'lucide-react';
import type { FolderItemProps } from '~/types/folderItemProps';
import { cva } from 'class-variance-authority';

// 재사용할 수도 있음
const navLinkVariants = cva(
  'hover:bg-primary/10 hover:text-primary px-2 py-2 rounded-md transition-colors flex items-center gap-2',
  {
    variants: {
      isActive: {
        true: 'bg-primary/20 font-medium text-primary rounded-md',
        false: 'text-muted-foreground hover:bg-primary/10',
      },
    },
  },
);

export default function FolderItem({ item, level = 0 }: { item: FolderItemProps; level?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentLeft = `${8 + level * 16 + 16}px`;

  if (!item.isFolder) {
    return (
      <NavLink
        to={`/post/${item.id}`}
        prefetch='intent'
        className={({ isActive }) => navLinkVariants({ isActive })}
        style={{ paddingLeft: contentLeft }}
      >
        {item.icon}
        <span>{item.name}</span>
      </NavLink>
    );
  }

  return (
    <div className='relative'>
      <div className='relative flex items-center'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='flex items-center gap-2 px-2 py-2 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors w-full text-left relative z-10'
          style={{ paddingLeft: contentLeft }}
        >
          <ChevronRight className={`size-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          {item.icon}
          <span>{item.name}</span>
        </button>
      </div>
      {isOpen && item.children && (
        <div className='flex flex-col gap-1 mt-1'>
          {item.children.map((child) => (
            <FolderItem key={child.name} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

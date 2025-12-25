export interface FolderItemProps {
  name: string;
  isFolder: boolean;
  icon?: React.ReactNode;
  children?: FolderItemProps[];
}

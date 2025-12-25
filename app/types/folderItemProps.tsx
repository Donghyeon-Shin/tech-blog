export interface FolderItemProps {
  name: string;
  isFolder: boolean;
  id: number;
  icon?: React.ReactNode;
  children?: FolderItemProps[];
}

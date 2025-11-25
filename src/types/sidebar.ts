export interface Chat {
  id: string;
  title: string;
  lastMessage: string;
}

export interface SidebarHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export interface SidebarActionsProps {
  isOpen: boolean;
}

export interface ChatListProps {
  isOpen: boolean;
  chats: Chat[];
}

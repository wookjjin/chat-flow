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
  searchText: string;
  setSearchText: (v: string) => void;
  filteredChats: Array<{ id: string; title: string; lastMessage?: string }>;
}

export interface ChatListProps {
  isOpen: boolean;
  chats: Chat[];
}

export interface ChatItemProps {
  chat: { id: string; title: string; lastMessage?: string };
  onClick?: () => void;
}

export interface SearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  searchText: string;
  onSearchChange: (text: string) => void;
  filteredChats: Array<{
    id: string;
    title: string;
    lastMessage?: string;
  }>;
  onNewChat: () => void;
}

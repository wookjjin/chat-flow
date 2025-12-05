'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { PanelLeftClose, PanelLeftOpen, Search, SquarePen, XIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import EditableInput from '@/components/ui/editable-input';
import { Separator } from '@/components/ui/separator';

import type {
  Chat,
  ChatItemProps,
  ChatListProps,
  SearchDialogProps,
  SidebarActionsProps,
  SidebarHeaderProps,
} from '@/types/sidebar';

// ============================================================================
// Chat Item Component
// ============================================================================
function ChatItem({ chat, onClick }: ChatItemProps) {
  return (
    <div
      className="py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="font-medium">{chat.firstMessage}</div>
      {chat.lastMessage && <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>}
    </div>
  );
}

// ============================================================================
// Search Dialog Component
// ============================================================================
function SearchDialog({
  onOpenChange,
  searchText,
  onSearchChange,
  filteredChats,
  onNewChat,
}: SearchDialogProps) {
  const editableRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const handleClose = () => onOpenChange(false);

  const handleSelectChat = (chatId: string) => {
    handleClose();
    navigate(`/chat/${chatId}`);
  };

  return (
    <DialogContent
      className="w-full sm:w-[500px] md:w-[600px] lg:w-[678px] shadow-2xl rounded-3xl !max-w-none"
      showCloseButton={false}
    >
      <div className="flex min-h-6 items-center px-3">
        <EditableInput
          inputRef={editableRef}
          value={searchText}
          onChange={onSearchChange}
          placeholder="채팅 검색..."
          autoFocus
        />
        <XIcon className="cursor-pointer" color="gray" size={18} onClick={handleClose} />
      </div>

      <Separator />

      <div className="h-80 overflow-y-auto flex flex-col gap-2">
        <Button
          variant="ghost"
          className="cursor-pointer text-gray-700 justify-start"
          onClick={onNewChat}
        >
          <SquarePen />새 채팅
        </Button>

        <label className="px-3 text-gray-500">내 채팅</label>

        <div className={cn(filteredChats.length === 0 && 'justify-center items-center')}>
          {filteredChats.length === 0 ? (
            <div className="text-center text-gray-400 py-4">검색 결과가 없습니다.</div>
          ) : (
            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <ChatItem
                  key={chat.conversationId}
                  chat={chat}
                  onClick={() => handleSelectChat(chat.conversationId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  );
}

// ============================================================================
// Sidebar Header Component
// ============================================================================
function SidebarHeader({ isOpen, onToggle }: SidebarHeaderProps) {
  return (
    <div className="h-14 flex items-center justify-between px-4 overflow-hidden">
      {isOpen ? (
        <>
          <span className="font-semibold text-lg whitespace-nowrap animate-in slide-in-from-left-4 fade-in duration-300 delay-100">
            ChatFlow
          </span>
          <PanelLeftClose className="cursor-pointer" color="gray" size={18} onClick={onToggle} />
        </>
      ) : (
        <PanelLeftOpen
          className="flex-1 cursor-pointer"
          color="gray"
          size={18}
          onClick={onToggle}
        />
      )}
    </div>
  );
}

// ============================================================================
// Sidebar Actions Component
// ============================================================================
function SidebarActions({ isOpen, searchText, setSearchText, filteredChats }: SidebarActionsProps) {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNewChat = () => {
    setIsDialogOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Collapsed State: Icon Buttons */}
      <div
        className={cn(
          'flex flex-col gap-6 transition-all duration-300',
          isOpen ? 'opacity-0 hidden' : 'opacity-100 items-center delay-100',
        )}
      >
        <SquarePen className="cursor-pointer" color="gray" size={18} onClick={handleNewChat} />
        <Search
          className="cursor-pointer"
          color="gray"
          size={18}
          onClick={() => setIsDialogOpen(true)}
        />
      </div>

      {/* Expanded State: Full Buttons */}
      <div className={cn('flex flex-col gap-2', isOpen ? 'flex' : 'hidden')}>
        <Button
          variant="outline"
          className="cursor-pointer text-gray-700 animate-in slide-in-from-top-2 fade-in duration-300 delay-150"
          onClick={handleNewChat}
        >
          <SquarePen />새 채팅
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="cursor-pointer text-gray-700 animate-in slide-in-from-top-2 fade-in duration-300 delay-200"
            >
              <Search />
              채팅 검색
            </Button>
          </DialogTrigger>

          <SearchDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            searchText={searchText}
            onSearchChange={setSearchText}
            filteredChats={filteredChats}
            onNewChat={handleNewChat}
          />
        </Dialog>
      </div>
    </>
  );
}

// ============================================================================
// Chat List Component
// ============================================================================
function ChatList({ isOpen, chats }: ChatListProps) {
  const navigate = useNavigate();

  const handleSelectChat = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };
  return (
    <div
      className={cn(
        'transition-opacity duration-200',
        isOpen ? 'opacity-100 delay-300' : 'opacity-0',
      )}
    >
      {isOpen && (
        <>
          <label className="text-gray-500 mb-2">내 채팅</label>
          <div className="space-y-2">
            {chats.map((chat) => (
              <ChatItem
                key={chat.conversationId}
                chat={chat}
                onClick={() => handleSelectChat(chat.conversationId)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Main Sidebar Component
// ============================================================================
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [chatList, setChatList] = useState<Chat[]>([]);
  const debouncedSearch = useDebounce(searchText, 200);

  useEffect(() => {
    const getChatList = async () => {
      const response = await request.get<Chat[]>('/chats/list');
      console.log(response.data);

      setChatList(response.data);
    };
    getChatList();
  }, []);

  const filteredChats = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return chatList;

    return chatList.filter(
      (chat) =>
        chat.firstMessage?.toLowerCase().includes(query) ||
        chat.lastMessage?.toLowerCase().includes(query),
    );
  }, [debouncedSearch, chatList]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div
      className={cn(
        'h-screen border-r bg-white transition-all duration-300 flex flex-col',
        isOpen ? 'w-64' : 'w-14',
      )}
    >
      <SidebarHeader isOpen={isOpen} onToggle={toggleSidebar} />

      <div className="flex flex-1 flex-col p-4 gap-4">
        <SidebarActions
          isOpen={isOpen}
          searchText={searchText}
          setSearchText={setSearchText}
          filteredChats={filteredChats}
        />

        {isOpen && <Separator />}

        <div className="flex-1 flex flex-col overflow-auto">
          <ChatList isOpen={isOpen} chats={chatList} />
        </div>
      </div>
    </div>
  );
}

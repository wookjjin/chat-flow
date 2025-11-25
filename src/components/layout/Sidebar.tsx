'use client';

import { useState } from 'react';

import chatList from '@/api/chat/chatList.json' with { type: 'json' };
import { cn } from '@/lib/utils';
import { PanelLeftClose, PanelLeftOpen, Search, SquarePen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import type { ChatListProps, SidebarActionsProps, SidebarHeaderProps } from '@/types/sidebar';

function SidebarHeader({ isOpen, onToggle }: SidebarHeaderProps) {
  return (
    <div className="h-14 flex items-center justify-between px-4">
      {isOpen ? (
        <>
          <span className="font-semibold text-lg">ChatFlow</span>
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

function SidebarActions({ isOpen }: SidebarActionsProps) {
  if (!isOpen) {
    return (
      <div className="flex flex-col items-center gap-6">
        <SquarePen className="cursor-pointer" color="gray" size={18} />
        <Search className="cursor-pointer" color="gray" size={18} />
      </div>
    );
  }

  return (
    <>
      <Button variant="outline" className="cursor-pointer text-gray-700">
        <SquarePen />새 채팅
      </Button>
      <Button variant="outline" className="cursor-pointer text-gray-700">
        <Search />
        채팅 검색
      </Button>
    </>
  );
}

function ChatList({ isOpen, chats }: ChatListProps) {
  if (!isOpen) return null;

  return (
    <>
      <label className="text-gray-500 mb-2">내 채팅</label>
      <div className="space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <div className="font-medium">{chat.title}</div>
            <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

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
        <div className="flex flex-col gap-2">
          <SidebarActions isOpen={isOpen} />
        </div>

        {isOpen && <Separator />}

        <div className="flex-1 flex flex-col overflow-auto">
          <ChatList isOpen={isOpen} chats={chatList} />
        </div>
      </div>
    </div>
  );
}

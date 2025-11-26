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

function SidebarActions({ isOpen }: SidebarActionsProps) {
  return (
    <>
      <div
        className={cn(
          'flex flex-col gap-6 transition-all duration-300',
          isOpen ? 'opacity-0 hidden' : 'opacity-100 items-center delay-100',
        )}
      >
        <SquarePen className="cursor-pointer" color="gray" size={18} />
        <Search className="cursor-pointer" color="gray" size={18} />
      </div>

      <div className={cn('flex flex-col gap-2', isOpen ? 'flex' : 'hidden')}>
        <Button
          variant="outline"
          className="cursor-pointer text-gray-700 animate-in slide-in-from-top-2 fade-in duration-300 delay-150"
        >
          <SquarePen />새 채팅
        </Button>
        <Button
          variant="outline"
          className="cursor-pointer text-gray-700 animate-in slide-in-from-top-2 fade-in duration-300 delay-200"
        >
          <Search />
          채팅 검색
        </Button>
      </div>
    </>
  );
}

function ChatList({ isOpen, chats }: ChatListProps) {
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
      )}
    </div>
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

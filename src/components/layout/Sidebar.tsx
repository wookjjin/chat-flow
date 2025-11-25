'use client';

import { useState } from 'react';

import chatList from '@/api/chat/chatList.json' with { type: 'json' };
import { cn } from '@/lib/utils';
import { PanelLeftClose, PanelLeftOpen, Search, SquarePen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div
      className={cn(
        'h-screen border-r bg-white transition-all duration-300 flex flex-col',
        isOpen ? 'w-64' : 'w-14',
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4">
        {isOpen ? (
          <>
            <span className="font-semibold text-lg">ChatFlow</span>
            <PanelLeftClose
              className="cursor-pointer"
              color="gray"
              size={18}
              onClick={() => setIsOpen(false)}
            />
          </>
        ) : (
          <PanelLeftOpen
            className="flex-1 cursor-pointer"
            color="gray"
            size={18}
            onClick={() => setIsOpen(true)}
          />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 gap-4">
        <div className="flex flex-col gap-2">
          {isOpen ? (
            <>
              <Button variant="outline" className="cursor-pointer text-gray-700">
                <SquarePen />새 채팅
              </Button>
              <Button variant="outline" className="cursor-pointer text-gray-700">
                <Search />
                채팅 검색
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <SquarePen color="gray" size={18} />
              <Search color="gray" size={18} />
            </div>
          )}
        </div>
        {isOpen ? <Separator /> : <></>}
        {/* "내 채팅" 영역 */}
        <div className="flex-1 flex flex-col overflow-auto">
          {isOpen ? (
            <>
              <label className="text-gray-500 mb-2">내 채팅</label>
              <div className="space-y-2">
                {chatList.map((chat) => (
                  <div key={chat.id} className="p-2 rounded-lg hover-bg-gray-100 cursor-pointer">
                    <div className="font-medium">{chat.title}</div>
                    <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

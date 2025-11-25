import { useRef, useState } from 'react';

import { SendHorizontal } from 'lucide-react';

export default function ChatMain() {
  const editableRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setMessage('');
    if (editableRef.current) {
      editableRef.current.textContent = '';
      editableRef.current.focus();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || '';
    setMessage(text);

    if (!text.trim() && editableRef.current) {
      editableRef.current.textContent = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="h-85 flex flex-col items-center justify-end pb-6">
        <div className="text-3xl text-center">찾으시는 정보가 있으신가요?</div>
      </div>
      <div className="w-full max-w-2xl mx-auto pb-4 px-4">
        <div className="flex min-h-14 items-center rounded-xl border-2 border-gray-200 rounded-lg my-2.5 px-4 py-3">
          <div
            ref={editableRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            data-placeholder="무엇이든 물어보세요"
            className="flex-1 cursor-text outline-none min-h-6 max-h-52 overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
            suppressContentEditableWarning
          />
          <SendHorizontal
            aria-disabled={!message}
            className={!message ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            size={20}
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}

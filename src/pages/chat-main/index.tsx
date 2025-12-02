import { useRef, useState } from 'react';

import { generateUniqueKey } from '@/lib/utils';
import { SendHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router';

import EditableInput from '@/components/ui/editable-input';

export default function ChatMain() {
  const navigate = useNavigate();
  const editableRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;

    navigate(`/chat/${generateUniqueKey()}`, { state: { initialMessage: message } });

    setMessage('');
    if (editableRef.current) {
      editableRef.current.textContent = '';
      editableRef.current.focus();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="h-85 flex flex-col items-center justify-end pb-6">
        <div className="text-3xl text-center">찾으시는 정보가 있으신가요?</div>
      </div>
      <div className="w-full max-w-2xl mx-auto pb-4 px-4">
        <div className="flex min-h-14 items-center rounded-xl border-2 border-gray-200 my-2.5 px-4 py-3">
          <EditableInput
            inputRef={editableRef}
            value={message}
            onChange={setMessage}
            onEnter={handleSendMessage}
            placeholder="메시지를 입력하세요"
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

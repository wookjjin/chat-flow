import { useRef } from 'react';

export default function ChatMain() {
  const editableRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || '';
    // 입력값 처리
    console.log(text);
  };

  const handleFocus = () => {
    const el = editableRef.current;
    if (el && el.textContent === '무엇이든 물어보세요') {
      el.textContent = '';
      el.classList.remove('text-gray-400');
    }
  };

  const handleBlur = () => {
    const el = editableRef.current;
    if (el && !el.textContent?.trim()) {
      el.textContent = '무엇이든 물어보세요';
      el.classList.add('text-gray-400');
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="h-80 flex flex-col items-center justify-end pb-8">
        <div className="text-xl font-semibold text-center">Chat Main</div>
      </div>
      <div className="w-full max-w-2xl mx-auto pb-4 px-4">
        <div className="flex min-h-14 items-center rounded-xl border-2 border-gray-200 rounded-lg my-2.5 px-4 py-3">
          <div
            ref={editableRef}
            contentEditable
            onInput={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex-1 outline-none text-gray-400 min-h-6 max-h-52 overflow-y-auto"
            suppressContentEditableWarning
          >
            무엇이든 물어보세요
          </div>
        </div>
      </div>
    </div>
  );
}

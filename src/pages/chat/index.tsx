'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { SendHorizontal } from 'lucide-react';
import { useLocation } from 'react-router';

import EditableInput from '@/components/ui/editable-input';

import type { Message, StreamChunk } from '@/types/chat';

export default function ChatRoom() {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage;
  const editableRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitialMessage = useRef(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const [messages, setMessages] = useState<Message[]>(() => {
    if (initialMessage) {
      return [
        {
          id: Date.now().toString(),
          role: 'user',
          content: initialMessage,
          timestamp: new Date(),
        },
      ];
    }
    return [];
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim() || isStreaming) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      },
    ]);
    setMessage('');

    if (editableRef.current) {
      editableRef.current.textContent = '';
    }

    // SSE 연결 시작
    startStreaming(userMessage);
    scrollToBottom();
  };

  const startStreaming = useCallback((userMessage: string) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setIsStreaming(true);

    // 쿼리 파라미터로 메시지 전송
    const encodedMessage = encodeURIComponent(userMessage);
    const sseUrl = `http://localhost:3000/api/sse?message=${encodedMessage}`;

    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    let currentMessageId: string | null = null;
    let streamingContent = '';

    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    eventSource.onmessage = (event) => {
      try {
        const chunk: StreamChunk = JSON.parse(event.data);

        if (chunk.type === 'start') {
          // 새 메시지 시작
          currentMessageId = chunk.messageId;
          streamingContent = '';

          const assistantMessage: Message = {
            id: currentMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, assistantMessage]);
        } else if (chunk.type === 'chunk' && currentMessageId) {
          // 글자 추가
          streamingContent += chunk.content;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === currentMessageId ? { ...msg, content: streamingContent } : msg,
            ),
          );
          scrollToBottom();
        } else if (chunk.type === 'end') {
          // 스트리밍 완료
          eventSource.close();
          setIsStreaming(false);
          currentMessageId = null;
          streamingContent = '';
        }
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      eventSource.close();
      setIsStreaming(false);

      // 에러 메시지 추가
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '응답을 받는 중 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    };
  }, []);

  useEffect(() => {
    if (initialMessage && !hasProcessedInitialMessage.current) {
      hasProcessedInitialMessage.current = true;
      // 초기 메시지가 있으면 자동으로 전송
      setTimeout(() => {
        startStreaming(initialMessage);
      }, 500);
    }
  }, [initialMessage, startStreaming]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 클린업
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' ? 'bg-stone-700 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">
                  {msg.content}
                  {msg.role === 'assistant' &&
                    isStreaming &&
                    msg.id === messages[messages.length - 1]?.id && (
                      <span className="inline-block w-1 h-4 ml-1 bg-gray-900 animate-pulse" />
                    )}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="border-t bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex min-h-14 items-center rounded-xl border-2 border-gray-200 px-4 py-3">
            <EditableInput
              inputRef={editableRef}
              value={message}
              onChange={setMessage}
              onEnter={handleSendMessage}
              placeholder={isStreaming ? '응답 대기 중...' : '메시지를 입력하세요'}
              disabled={isStreaming}
            />
            <SendHorizontal
              aria-disabled={!message || isStreaming}
              className={
                !message || isStreaming ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }
              size={20}
              onClick={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

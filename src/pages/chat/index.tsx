'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { SendHorizontal } from 'lucide-react';
import { useParams } from 'react-router';

import EditableInput from '@/components/ui/editable-input';

import type { Message, StreamChunk } from '@/types/chat';

export default function ChatRoom() {
  const { id: conversationId } = useParams();

  const editableRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const [message, setMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isStreaming) return;

    const userMessage = message.trim();
    const messageId = crypto.randomUUID();
    setMessage('');

    if (editableRef.current) {
      editableRef.current.textContent = '';
    }

    const newUserMessage: Message = {
      messageId,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    scrollToBottom();

    try {
      await request.post(`/chats/${conversationId}/message`, {
        role: 'user',
        content: userMessage,
      });
    } catch (e) {
      console.error(e);
      return;
    }

    startStreaming(userMessage);
  };

  const startStreaming = useCallback(
    (userMessage: string) => {
      if (eventSourceRef.current) eventSourceRef.current.close();

      setIsStreaming(true);

      const encodedMessage = encodeURIComponent(userMessage);
      const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';
      const sseUri = `${API_BASE_URL}/api/sse?message=${encodedMessage}&conversationId=${conversationId}`;
      const eventSource = new EventSource(sseUri);
      eventSourceRef.current = eventSource;

      let currentMessageId: string | null = null;
      let streamingContent = '';

      eventSource.onmessage = (event) => {
        try {
          const chunk: StreamChunk = JSON.parse(event.data);

          if (chunk.type === 'start') {
            currentMessageId = chunk.messageId;
            streamingContent = '';

            const assistantMessage: Message = {
              messageId: currentMessageId,
              role: 'assistant',
              content: '',
              timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
          } else if (chunk.type === 'chunk' && currentMessageId) {
            streamingContent += chunk.content;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.messageId === currentMessageId ? { ...msg, content: streamingContent } : msg,
              ),
            );

            scrollToBottom();
          } else if (chunk.type === 'end') {
            eventSource.close();
            setIsStreaming(false);
            currentMessageId = null;
            streamingContent = '';
          }
        } catch (err) {
          console.error('SSE parse error:', err);
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        eventSource.close();
        setIsStreaming(false);
      };
    },
    [conversationId],
  );

  useEffect(() => {
    if (!conversationId) return;

    (async () => {
      try {
        const result = await request.get(`/chats/${conversationId}/messages`);
        setMessages(result.data);

        const isUserLastMessage = result.data[result.data.length - 1];

        if (isUserLastMessage && isUserLastMessage.role === 'user') {
          startStreaming(isUserLastMessage.content);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [conversationId, startStreaming]);

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
              key={msg.messageId}
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
                    msg.messageId === messages[messages.length - 1]?.messageId && (
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

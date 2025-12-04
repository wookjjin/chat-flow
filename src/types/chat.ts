export interface Message {
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface StreamChunk {
  type: 'start' | 'chunk' | 'end';
  content: string;
  messageId: string;
}

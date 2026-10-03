export interface Message {
  messageId: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;
}

export interface SendMessagePayload extends Omit<
  Message,
  "messageId" | "createdAt"
> {
  receiverId: number;
  createdAt: number;
}

export interface ChatMessage extends Message {
  pending?: boolean;
}

export interface MessagePages {
  data: Message[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Message {
  messageId: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;
}

export interface SendMessagePayload extends Omit<Message, "messageId" | "createdAt"> {
  receiverId: number;
  createdAt: number
}

export interface Message {
  messageId: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: number;
}

export interface SendMessagePayload extends Omit<Message, "messageId"> {
  receiverId: number;
}

export interface Conversation {
  id: string;
  createdAt: string;

  firstUser: UserSummary;
  secondUser: UserSummary;
}

type UserSummary = {
  id: number;
  username: string;
  email: string;
};

export interface createConversationPayload {
  withMemberId: string;
}

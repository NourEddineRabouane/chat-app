export interface Conversation {
  id: number;
  createdAt: string;

  firstUser: UserSummary;
  secondUser: UserSummary;
}

type UserSummary = {
  id: number;
  username: string;
  email: string;
};

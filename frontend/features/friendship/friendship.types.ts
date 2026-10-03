export interface UserSummary {
  id: number;
  username: string;
}

export type FriendshipStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELED";

export interface FriendshipRequest {
  id: number;
  fromUser: UserSummary;
  toUser: UserSummary;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Friend {
  user: UserSummary;
  friendsSince: string;
}

/** Matches the backend's PageResponse<T>. */
export interface PageResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
}
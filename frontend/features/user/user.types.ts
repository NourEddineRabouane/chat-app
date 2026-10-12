export interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  createdAt: string;
}

export interface UpdateUserProfileRequest {
  username: string;
  email: string;
}

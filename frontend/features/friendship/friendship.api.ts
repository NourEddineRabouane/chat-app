import { clientApi, type ApiOptions } from "@/lib/api/clientApi";
import type {
  Friend,
  FriendshipRequest,
  PageResponse,
  UserSummary,
} from "./friendship.types";

const PAGE_SIZE = 20;

/**
 * One place for fetch + error handling. `errors` maps an HTTP status to a message
 * that makes sense for that call (the backend only sends bare status codes).
 */
async function call<T>(
  path: string,
  options: ApiOptions = {},
  errors: Partial<Record<number, string>> = {},
): Promise<T> {
  const res = await clientApi(path, options);

  if (!res.ok) {
    throw new Error(errors[res.status] ?? `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

const page = (n: number) => ({ page: n, size: PAGE_SIZE });

// ---- Friends ---------------------------------------------------------------

export const getFriends = (pageNumber: number) =>
  call<PageResponse<Friend>>("/api/friends", { params: page(pageNumber) });

export const unfriend = (friendId: number) =>
  call<void>(
    `/api/friends/${friendId}`,
    { method: "DELETE" },
    { 404: "You are not friends with this user" },
  );

// ---- Requests --------------------------------------------------------------

export const getIncomingRequests = (pageNumber: number) =>
  call<PageResponse<FriendshipRequest>>("/api/friendship-requests/incoming", {
    params: page(pageNumber),
  });

export const getOutgoingRequests = (pageNumber: number) =>
  call<PageResponse<FriendshipRequest>>("/api/friendship-requests/outgoing", {
    params: page(pageNumber),
  });

export const getIncomingCount = () =>
  call<{ count: number }>("/api/friendship-requests/incoming/count");

export const sendFriendRequest = (toUserId: number) =>
  call<FriendshipRequest>(
    "/api/friendship-requests",
    { method: "POST", body: JSON.stringify({ toUserId }) },
    {
      400: "You can't send a request to this user",
      404: "User not found",
      409: "You're already friends, or a request is already pending",
    },
  );

const requestErrors = {
  404: "This request no longer exists",
  409: "This request was already handled",
};

export const acceptRequest = (id: number) =>
  call<FriendshipRequest>(
    `/api/friendship-requests/${id}/accept`,
    { method: "POST" },
    requestErrors,
  );

export const declineRequest = (id: number) =>
  call<FriendshipRequest>(
    `/api/friendship-requests/${id}/decline`,
    { method: "POST" },
    requestErrors,
  );

export const cancelRequest = (id: number) =>
  call<FriendshipRequest>(
    `/api/friendship-requests/${id}`,
    { method: "DELETE" },
    requestErrors,
  );

// ---- Find people (needs the small backend add-on: GET /api/users/search) -----

export const searchUsers = (q: string) =>
  call<UserSummary[]>("/api/users/search", { params: { q } });

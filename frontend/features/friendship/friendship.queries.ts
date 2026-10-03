import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  acceptRequest,
  cancelRequest,
  declineRequest,
  getFriends,
  getIncomingCount,
  getIncomingRequests,
  getOutgoingRequests,
  searchUsers,
  sendFriendRequest,
  unfriend,
} from "./friendship.api";

import type {
  Friend,
  FriendshipRequest,
  PageResponse,
  UserSummary,
} from "./friendship.types";

export const friendshipKeys = {
  all: ["friendship"] as const,
  friends: ["friendship", "friends"] as const,
  incoming: ["friendship", "incoming"] as const,
  outgoing: ["friendship", "outgoing"] as const,
  incomingCount: ["friendship", "incoming-count"] as const,
};

// ---- Paged lists -------------------------------------------------------------

type Paged<T> = { items: T[]; total: number };

function selectItems<T>(data: InfiniteData<PageResponse<T>, number>): Paged<T> {
  return {
    items: data.pages.flatMap((p) => p.data),
    total: data.pages[0]?.totalItems ?? 0,
  };
}

function usePaged<T>(
  queryKey: readonly string[],
  fetchPage: (page: number) => Promise<PageResponse<T>>,
) {
  return useInfiniteQuery<
    PageResponse<T>,
    Error,
    Paged<T>,
    readonly string[],
    number
  >({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.hasNext ? last.currentPage + 1 : undefined,
    select: selectItems<T>,
  });
}

export const useFriends = () =>
  usePaged<Friend>(friendshipKeys.friends, getFriends);

export const useIncomingRequests = () =>
  usePaged<FriendshipRequest>(friendshipKeys.incoming, getIncomingRequests);

export const useOutgoingRequests = () =>
  usePaged<FriendshipRequest>(friendshipKeys.outgoing, getOutgoingRequests);

/** Badge number. The backend has no push for this, so poll gently and refresh on focus. */
export function useIncomingCount() {
  return useQuery<{ count: number }, Error, number>({
    queryKey: friendshipKeys.incomingCount,
    queryFn: getIncomingCount,
    select: (d) => d.count,
    staleTime: 15_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}

// ---- Search ------------------------------------------------------------------

export const MIN_SEARCH_LENGTH = 2;

export function useSearchUsers(term: string) {
  const q = term.trim();
  return useQuery<UserSummary[], Error>({
    queryKey: ["users", "search", q],
    queryFn: () => searchUsers(q),
    enabled: q.length >= MIN_SEARCH_LENGTH,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

// ---- Mutations ---------------------------------------------------------------
// Every action can change friends, both request lists and the badge, and the
// server is the source of truth, so refetch the whole "friendship" family.

function useFriendshipMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
) {
  const queryClient = useQueryClient();
  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: friendshipKeys.all }),
  });
}

export const useSendFriendRequest = () =>
  useFriendshipMutation(sendFriendRequest);
export const useAcceptRequest = () => useFriendshipMutation(acceptRequest);
export const useDeclineRequest = () => useFriendshipMutation(declineRequest);
export const useCancelRequest = () => useFriendshipMutation(cancelRequest);
export const useUnfriend = () => useFriendshipMutation(unfriend);

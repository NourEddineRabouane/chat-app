"use client";

import { MessageCircle, UserMinus, Loader2 } from "lucide-react";
import { useFriends, useUnfriend } from "../friendship.queries";
import {
  ActionError,
  Card,
  formatDate,
  ghostButton,
  LoadMore,
  StateMessage,
  UserRow,
} from "./Shared";
import { useCreateConversation } from "@/features/conversations/conversations.queries";
import { useSession } from "next-auth/react";

export default function FriendList() {
  // Session to get the current user id;
  const { data: sessionData } = useSession();
  const currentUserId = sessionData?.user.id;

  const {
    data,
    isPending,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFriends();

  const remove = useUnfriend();

  const createConversation = useCreateConversation();

  if (isPending) return <StateMessage>Loading friends...</StateMessage>;
  if (error) return <StateMessage tone="error">{error.message}</StateMessage>;
  if (data.items.length === 0) {
    return (
      <StateMessage>
        No friends yet. Use the “Add friend” tab to send a request.
      </StateMessage>
    );
  }

  return (
    <>
      <p className="mb-2 px-1 text-xs text-text-muted">
        {data.total} {data.total === 1 ? "friend" : "friends"}
      </p>

      <Card>
        {data.items.map(({ user, friendsSince }) => (
          <li key={user.id}>
            <UserRow
              user={user}
              subtitle={`Friends since ${formatDate(friendsSince)}`}
            >
              <button
                type="button"
                className={`${ghostButton} text-accent-teal!`}
                disabled={createConversation.isPending}
                onClick={() =>
                  createConversation.mutate({
                    member1Id: String(currentUserId),
                    member2Id: String(user.id),
                  })
                }
              >
                {createConversation.isPending ? (
                  <Loader2
                    className="size-3.5 animate-spin"
                    aria-label="Creating conversation"
                  />
                ) : (
                  <>
                    <MessageCircle className="size-3.5" />
                    Message
                  </>
                )}
              </button>
              <button
                type="button"
                className={ghostButton}
                disabled={remove.isPending && remove.variables === user.id}
                onClick={() => {
                  if (
                    window.confirm(`Remove ${user.username} from your friends?`)
                  ) {
                    remove.mutate(user.id);
                  }
                }}
              >
                <UserMinus className="size-3.5" />
                Remove
              </button>
            </UserRow>
          </li>
        ))}
      </Card>

      <ActionError error={remove.error} />
      <LoadMore
        hasNextPage={hasNextPage}
        loading={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </>
  );
}

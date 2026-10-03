"use client";

import { Check, X } from "lucide-react";
import type { ReactNode } from "react";
import {
  useAcceptRequest,
  useCancelRequest,
  useDeclineRequest,
  useIncomingRequests,
  useOutgoingRequests,
} from "../friendship.queries";
import {
  ActionError,
  buttonBase,
  Card,
  formatDate,
  ghostButton,
  LoadMore,
  primaryButton,
  StateMessage,
  UserRow,
} from "./Shared";

export default function RequestsPanel() {
  return (
    <div className="space-y-8">
      <IncomingSection />
      <OutgoingSection />
    </div>
  );
}

function Section({
  title,
  total,
  children,
}: {
  title: string;
  total?: number;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-sm font-medium text-navy-950">
        {title}
        {total ? <span className="ml-2 text-text-muted">{total}</span> : null}
      </h2>
      {children}
    </section>
  );
}

function IncomingSection() {
  const {
    data,
    isPending,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useIncomingRequests();
  const accept = useAcceptRequest();
  const decline = useDeclineRequest();

  // Which request is being accepted/declined right now (if any)
  const busyId = accept.isPending
    ? accept.variables
    : decline.isPending
      ? decline.variables
      : undefined;

  return (
    <Section title="Received" total={data?.total}>
      {isPending ? (
        <StateMessage>Loading...</StateMessage>
      ) : error ? (
        <StateMessage tone="error">{error.message}</StateMessage>
      ) : data.items.length === 0 ? (
        <StateMessage>No pending requests.</StateMessage>
      ) : (
        <>
          <Card>
            {data.items.map((request) => (
              <li key={request.id}>
                <UserRow
                  user={request.fromUser}
                  subtitle={`Sent ${formatDate(request.updatedAt)}`}
                >
                  <button
                    type="button"
                    className={primaryButton}
                    disabled={busyId === request.id}
                    onClick={() => accept.mutate(request.id)}
                  >
                    <Check className="size-3.5" />
                    Accept
                  </button>
                  <button
                    type="button"
                    className={ghostButton}
                    disabled={busyId === request.id}
                    onClick={() => decline.mutate(request.id)}
                  >
                    <X className="size-3.5" />
                    Decline
                  </button>
                </UserRow>
              </li>
            ))}
          </Card>
          <LoadMore
            hasNextPage={hasNextPage}
            loading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          />
        </>
      )}
      <ActionError error={accept.error ?? decline.error} />
    </Section>
  );
}

function OutgoingSection() {
  const {
    data,
    isPending,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useOutgoingRequests();
  const cancel = useCancelRequest();

  return (
    <Section title="Sent" total={data?.total}>
      {isPending ? (
        <StateMessage>Loading...</StateMessage>
      ) : error ? (
        <StateMessage tone="error">{error.message}</StateMessage>
      ) : data.items.length === 0 ? (
        <StateMessage>You haven&apos;t sent any pending requests.</StateMessage>
      ) : (
        <>
          <Card>
            {data.items.map((request) => (
              <li key={request.id}>
                <UserRow
                  user={request.toUser}
                  subtitle={`Sent ${formatDate(request.updatedAt)}`}
                >
                  <button
                    type="button"
                    className={`${buttonBase} border border-text-muted/40 text-navy-950 hover:bg-bubble-incoming`}
                    disabled={
                      cancel.isPending && cancel.variables === request.id
                    }
                    onClick={() => cancel.mutate(request.id)}
                  >
                    <X className="size-3.5" />
                    Cancel
                  </button>
                </UserRow>
              </li>
            ))}
          </Card>
          <LoadMore
            hasNextPage={hasNextPage}
            loading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          />
        </>
      )}
      <ActionError error={cancel.error} />
    </Section>
  );
}

"use client";

import { useState } from "react";
import { useIncomingCount } from "../friendship.queries";
import AddFriend from "./AddFriend";
import FriendList from "./FriendshipList";
import RequestsPanel from "./RequestPanel"; 

type Tab = "friends" | "requests" | "add";

export default function FriendsView() {
  const [tab, setTab] = useState<Tab>("friends");
  const { data: incomingCount = 0 } = useIncomingCount();

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "friends", label: "Friends" },
    { id: "requests", label: "Requests", badge: incomingCount },
    { id: "add", label: "Add friend" },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl p-4 sm:p-8">
      <h1 className="mb-4 text-xl font-medium text-navy-950 sm:text-2xl">
        Friends
      </h1>

      <div
        role="tablist"
        aria-label="Friends sections"
        className="mb-5 flex gap-1 rounded-full bg-surface/70 p-1 shadow-sm"
      >
        {tabs.map(({ id, label, badge }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
              tab === id
                ? "bg-navy-950 text-white shadow"
                : "text-text-muted hover:text-navy-950"
            }`}
          >
            {label}
            {badge ? (
              <span className="grid min-w-5 place-items-center rounded-full bg-accent-orange px-1.5 text-[11px] font-bold leading-5 text-navy-950">
                {badge > 99 ? "99+" : badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "friends" && <FriendList />}
        {tab === "requests" && <RequestsPanel />}
        {tab === "add" && <AddFriend />}
      </div>
    </div>
  );
}

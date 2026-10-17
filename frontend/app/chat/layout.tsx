import Link from "next/link";
import { Plus } from "lucide-react";
import { ConversationList } from "@/features/conversations/components/ConversationList";
import { getConversations } from "@/features/conversations/conversations.api";
import { getCurrentUser } from "@/features/user/user.api";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, currentUser] = await Promise.all([
    getConversations(),
    getCurrentUser(),
  ]);

  return (
    // div, not <main>: the root layout already renders the page's <main>.
    <div className="group/chat flex h-full">
      {/*
        Mobile: the list is visible by default and hidden once a conversation is open
        (a [data-chat-open] element exists inside the group). From md up it is always visible.
      */}
      <aside
        className="relative flex w-full flex-col bg-surface
                   group-has-data-chat-open/chat:hidden
                   md:group-has-data-chat-open/chat:flex
                   md:w-80 md:shrink-0 lg:w-90"
      >
        <ConversationList
          conversations={conversations}
          currentUserId={currentUser?.id}
        />

        <Link
          href="/friends"
          aria-label="Start a new conversation"
          title="New conversation"
          className="absolute bottom-6 right-6 grid size-12 place-items-center rounded-full bg-mint-400 text-mint-900 shadow-bubble-in transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="size-6" strokeWidth={2.25} />
        </Link>
      </aside>

      {/* Mobile: hidden until a conversation is open. From md up always visible. */}
      <section
        className="hidden min-w-0 flex-1 flex-col bg-panel shadow-[inset_8px_0_16px_-12px_rgb(0_0_0/0.08)]
                   group-has-data-chat-open/chat:flex
                   md:flex"
      >
        {children}
      </section>
    </div>
  );
}

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
    <>
      {/* div, not <main>: the root layout already renders the page's <main>.
          h-dvh follows the visible viewport on phones (h-screen ignores the browser bar). */}
      <div className="group/chat flex h-dvh bg-white">
        {/*
          Mobile: this list is visible by default and hidden once a conversation is open
          (a [data-chat-open] element exists inside the group). From md up it is always visible.
        */}
        <aside
          className="flex w-full flex-col border-r border-r-text-muted/40 bg-gray-50
                     group-has-data-chat-open/chat:hidden
                     md:group-has-data-chat-open/chat:flex
                     md:w-80 md:shrink-0 lg:w-96"
        >
          <div className="border-b border-b-text-muted/40 p-4">
            <h1 className="text-xl font-semibold text-gray-600">
              Conversations
            </h1>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <ConversationList
              conversations={conversations}
              currentUserId={currentUser?.id}
            />
          </div>
        </aside>

        {/*
          Mobile: hidden by default (so the "select a conversation" empty state never squeezes
          the list), shown when a conversation is open. From md up it is always visible.
        */}
        <section
          className="hidden min-w-0 flex-1 flex-col bg-slate-50
                     group-has-data-chat-open/chat:flex
                     md:flex"
        >
          {children}
        </section>
      </div>
    </>
  );
}

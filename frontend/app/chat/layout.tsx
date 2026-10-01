import { ConversationList } from "@/features/conversations/components/ConversationList";
import { getConversations } from "@/features/conversations/conversations.api";
import { getCurrentUser } from "@/features/user/user.api";
import { StompProvider } from "@/providers/StompProvider";

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
    <StompProvider>
      {/* Changed to strictly h-screen to prevent window-level scrolling */}
      <main className="flex h-screen bg-white">
        <aside className="w-full md:w-1/3 lg:w-1/4 flex flex-col border-r bg-gray-50">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold text-gray-800">
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

        <section className="flex-1 flex flex-col bg-slate-50">
          {children}
        </section>
      </main>
    </StompProvider>
  );
}

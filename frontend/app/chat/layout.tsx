import { ConversationList } from "@/features/conversations/components/ConversationList";
import { getConversations } from "@/features/conversations/conversations.api";
import { getCurrentUser } from "@/features/user/user.api";

export default async function ChatLayout({ children }: LayoutProps<"/chat">) {
  const [conversations, currentUser] = await Promise.all([
    getConversations(),
    getCurrentUser(),
  ]);

  return (
    <main className="p-2 min-h-screen md:p-4 md:flex ">
      <div className="md:w-1/3 bg-blue-400 p-2 md:p-3 lg:p-4 rounded-tl-md rounded-bl-md">
        <h1 className="mb-4 text-xl font-semibold">Conversations</h1>
        <ConversationList
          conversations={conversations}
          currentUserId={currentUser?.id}
        />
      </div>
      <div className="md:w-2/3 bg-red-400 p-2 md:p-3 lg:p-4 rounded-tr-md rounded-br-md">
        {children}
      </div>
    </main>
  );
}

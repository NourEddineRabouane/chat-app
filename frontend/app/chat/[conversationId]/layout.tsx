export default function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // data-chat-open is what the parent layout's CSS looks for
    <div data-chat-open className="flex min-h-0 flex-1 flex-col">
      {children}
    </div>
  );
}

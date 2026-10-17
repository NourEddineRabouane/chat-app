import { MessageCircleMore } from "lucide-react";

export default function ChatEmptyState() {
  return (
    <section className="grid h-full w-full place-items-center p-6">
      <div className="flex max-w-xs flex-col items-center text-center">
        <div
          aria-hidden="true"
          className="mb-6 grid size-16 place-items-center rounded-2xl bg-mint-400 text-mint-900 shadow-bubble-in"
        >
          <MessageCircleMore className="size-8" strokeWidth={1.75} />
        </div>
        <h1 className="text-xl font-semibold text-ink-900">
          Select a conversation
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-400">
          Choose a chat from the list, or press the green + button to message a
          friend.
        </p>
      </div>
    </section>
  );
}

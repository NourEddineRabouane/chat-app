import { MessageCircleMore } from "lucide-react";

export default function ChatEmptyState() {
  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-page-from/70 p-4 sm:p-8">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        {/* ── Illustration: two skeleton bubbles + notification dot ── */}
        <div
          aria-hidden="true"
          className="relative mb-8 h-44 w-60 sm:mb-10 sm:h-52 sm:w-72"
        >
          {/* soft teal glow behind everything */}
          <div className="absolute inset-0 m-auto size-36 rounded-full bg-accent-teal/25 blur-3xl" />

          {/* incoming bubble (top-left) */}
          <div className="absolute left-0 top-0 w-40 space-y-2 rounded-2xl rounded-bl-md bg-surface p-3.5 shadow-xl shadow-navy-950/10 sm:w-48 sm:p-4">
            <div className="h-2 w-3/4 rounded-full bg-bubble-incoming" />
            <div className="h-2 w-full rounded-full bg-bubble-incoming" />
            <div className="h-2 w-1/2 rounded-full bg-bubble-incoming" />
            {/* unread-style dot, same orange as the badges in the list */}
            <span className="absolute -right-2 -top-2 size-4 rounded-full border-[3px] border-page-from bg-accent-orange" />
          </div>

          {/* outgoing bubble (bottom-right) with typing dots */}
          <div className="absolute bottom-0 right-0 flex w-32 items-center justify-center gap-1.5 rounded-2xl rounded-br-md bg-navy-950 px-4 py-4 shadow-xl shadow-navy-950/25 sm:w-36">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                style={{ animationDelay: `${delay}ms` }}
                className="size-2 animate-bounce rounded-full bg-accent-teal motion-reduce:animate-none"
              />
            ))}
          </div>

          <div className="absolute bottom-3 left-6 grid size-12 place-items-center rounded-2xl bg-accent-teal text-white shadow-lg shadow-accent-teal/40 sm:left-10 sm:size-14">
            <MessageCircleMore
              className="size-6 sm:size-7"
              strokeWidth={1.75}
            />
          </div>
        </div>

        <h1 className="text-xl font-medium text-navy-950 sm:text-2xl">
          Select a conversation
        </h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-muted sm:max-w-sm sm:text-base">
          Pick a chat from your list to start messaging, or begin a new one with
          the <span className="font-medium text-navy-950">+</span> button.
        </p>

      </div>
    </section>
  );
}

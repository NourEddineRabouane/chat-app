"use client";

import { Paperclip, Send } from "lucide-react";

export const MAX_MESSAGE_LENGTH = 2000;

type Props = {
  onSend: (content: string) => void;
  onTyping: () => void;
};

export default function MessageComposer({ onSend, onTyping }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem(
          "content",
        ) as HTMLInputElement;
        const text = input.value.trim();
        if (!text) return;
        onSend(text);
        input.value = "";
      }}
      className="flex shrink-0 items-center gap-3 border-t border-line bg-surface px-5 py-3.5"
    >
      <button
        type="button"
        disabled
        title="Attachments are coming soon"
        aria-label="Attach a file (coming soon)"
        className="grid size-9 place-items-center rounded-full text-ink-400 disabled:cursor-not-allowed"
      >
        <Paperclip className="size-5" strokeWidth={1.75} />
      </button>

      <input
        name="content"
        aria-label="Message"
        autoComplete="off"
        maxLength={MAX_MESSAGE_LENGTH}
        placeholder="Type your message here"
        onInput={onTyping}
        className="min-w-0 flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
      />

      <button
        type="submit"
        aria-label="Send message"
        className="grid size-9 cursor-pointer place-items-center rounded-full text-mint-600 transition hover:bg-mint-50 active:scale-90"
      >
        <Send className="size-5" strokeWidth={2} />
      </button>
    </form>
  );
}

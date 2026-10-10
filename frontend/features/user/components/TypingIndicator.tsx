interface TypingIndicatorProps {
  label?: string;
  short?: boolean;
}

export function TypingIndicator({ label, short }: TypingIndicatorProps) {
  if (short)  return (
        <div className="flex items-center gap-1 rounded-xl">
            <Dot delay="0ms" />
            <Dot delay="160ms" />
            <Dot delay="320ms" />
        </div>
    )

  return (
    <div className="flex items-end gap-2">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-bubble-incoming px-4 py-3 w-fit">
        <Dot delay="0ms" />
        <Dot delay="160ms" />
        <Dot delay="320ms" />
      </div>
      {label && (
        <span className="pb-1 text-xs text-text-muted">{label} is typing…</span>
      )}
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-2 w-2 rounded-full bg-accent-teal animate-typing-bounce motion-reduce:animate-none"
      style={{ animationDelay: delay }}
    />
  );
}

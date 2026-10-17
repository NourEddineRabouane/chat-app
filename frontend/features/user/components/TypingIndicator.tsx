interface TypingIndicatorProps {
  label?: string;
  short?: boolean;
}

export function TypingIndicator({ label, short }: TypingIndicatorProps) {
  const dots = (
    <>
      <Dot delay="0ms" />
      <Dot delay="160ms" />
      <Dot delay="320ms" />
    </>
  );

  if (short) return <div className="flex items-center gap-1">{dots}</div>;

  return (
    <div role="status" aria-label={label ? `${label} is typing` : "Typing"} className="flex items-end gap-2">
      <div className="flex w-fit items-center gap-1 rounded-xl bg-mint-100 px-4 py-3">
        {dots}
      </div>
      {label && <span className="pb-1 text-xs text-ink-400">{label} is typing…</span>}
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="size-2 animate-typing-bounce rounded-full bg-mint-600 motion-reduce:animate-none"
      style={{ animationDelay: delay }}
    />
  );
}

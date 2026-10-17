export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-full place-items-center bg-panel p-6">
      <div className="w-full max-w-sm rounded-3xl bg-surface p-8 shadow-bubble-out">
        {children}
      </div>
    </div>
  );
}

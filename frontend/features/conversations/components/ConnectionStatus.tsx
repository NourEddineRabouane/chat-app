// "use client";

// import {
//   useChatStore,
//   type ConnectionStatus as Status,
// } from "@/store/chatStore";

// const STATES: Record<Status, { label: string; dot: string; text: string }> = {
//   connected: { label: "Live", dot: "bg-online", text: "text-navy-950" },
//   connecting: {
//     label: "Connecting…",
//     dot: "bg-accent-orange",
//     text: "text-text-muted",
//   },
//   disconnected: {
//     label: "Offline",
//     dot: "bg-text-muted",
//     text: "text-text-muted",
//   },
// };

// export default function ConnectionStatus() {
//   // Subscribes to the status only: new messages never re-render this.
//   const status = useChatStore((s) => s.status);
//   const { label, dot, text } = STATES[status];

//   return (
//     <div
//       role="status"
//       title={label}
//       className="flex shrink-0 items-center gap-2 rounded-full bg-bubble-incoming px-3 py-1.5"
//     >
//       <span className="relative flex size-2">
//         {status !== "disconnected" && (
//           <span
//             className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:animate-none ${dot}`}
//           />
//         )}
//         <span className={`relative inline-flex size-2 rounded-full ${dot}`} />
//       </span>
//       {/* On phones only the dot is shown, the label is announced by role="status" + title */}
//       <span className={`hidden text-xs font-medium sm:inline ${text}`}>
//         {label}
//       </span>
//     </div>
//   );
// }

import { StatusDot } from "./StatusDot";

// Soft, low-saturation tints that sit well on the mint palette
const TINTS = [
  "bg-mint-100 text-mint-700",
  "bg-[#e6eef7] text-[#3b5b82]",
  "bg-[#f6ebdc] text-[#8a5a1f]",
  "bg-[#efe6f4] text-[#6b4580]",
  "bg-[#e3f1f0] text-[#2c6b69]",
];

const SIZES = {
  sm: "size-8 text-xs",
  md: "size-11 text-sm",
  lg: "size-12 text-base",
} as const;

type Props = {
  id: number | string;
  name: string;
  size?: keyof typeof SIZES;
  /** Show the online/offline dot for this user */
  presence?: boolean;
  className?: string;
};

export function Avatar({ id, name, size = "md", presence, className = "" }: Props) {
  const tint = TINTS[Number(id) % TINTS.length] ?? TINTS[0];
  return (
    <div
      aria-hidden="true"
      className={`relative grid shrink-0 place-items-center rounded-full font-semibold ${SIZES[size]} ${tint} ${className}`}
    >
      {(name || "?").charAt(0).toUpperCase()}
      {presence && (
        <StatusDot
          userId={id}
          size={11}
          className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4"
        />
      )}
    </div>
  );
}

"use client";

type Props = { rating: number | string; reviews?: number };

export default function RatingStars({ rating, reviews }: Props) {
  const r = typeof rating === "number" ? rating : parseFloat(String(rating));
  const outOf5 = Math.max(0, Math.min(5, r / 2)); // convert 10 -> 5
  const full = Math.floor(outOf5);
  const half = outOf5 - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f-${i}`} type="full" />
        ))}
        {half === 1 && <Star type="half" />}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e-${i}`} type="empty" />
        ))}
      </div>
      {typeof reviews === "number" && (
        <p className="text-[#bababa] text-sm">{reviews} reviews</p>
      )}
    </div>
  );
}

function Star({ type }: { type: "full" | "half" | "empty" }) {
  const base = "inline-block w-5 h-5";
  if (type === "full") return <span className={`${base} text-[#fe8c31]`}>★</span>;
  if (type === "half") return <span className={`${base} text-[#fe8c31]`}>☆</span>;
  return <span className={`${base} text-[#555]`}>☆</span>;
}

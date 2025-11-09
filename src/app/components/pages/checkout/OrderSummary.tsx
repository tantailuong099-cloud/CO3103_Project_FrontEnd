import Image from "next/image";
import type { CartItem } from "../cart/CartItem";
const money = (n: number) =>
  `$${Math.max(0, n).toFixed(2).replace(/\.00$/, "")}`;

export default function OrderItemsPanel({ items }: { items: CartItem[] }) {
  return (
    <div className="bg-[#141414] rounded-2xl border border-[#2a2a2a] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
        <h3 className="text-white text-lg font-semibold">Your Order</h3>
        <span className="text-[#bdbdbd] text-sm">{items.length} items</span>
      </div>

      <div className="p-5 space-y-4">
        {items.map((item) => {
          const finalUnit = Math.max(0, item.price - (0));
          const rowSubtotal = finalUnit * item.quantity;

          return (
            <div key={item.id} className="bg-[#1e1e1e] rounded-xl p-4">
              <div className="flex gap-4">
                {/* image */}
                <div className="relative w-[90px] h-[120px] rounded-md overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.image}
                    fill
                    className="object-cover"
                    sizes="90px"
                  />
                </div>

                {/* middle */}
                <div className="flex-1">
                  <p className="text-white text-base font-semibold line-clamp-2">
                    {item.title}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="bg-black text-[#dedddd] text-sm px-3 py-2 rounded-[10px]">
                      {item.version}
                    </div>
                    {item.isDigital && (
                      <span className="bg-[#0e5135] text-[#b6f3d2] text-xs px-2 py-1 rounded">
                        Digital
                      </span>
                    )}
                  </div>
                </div>

                {/* right */}
                <div className="flex flex-col items-end shrink-0 gap-1">
                  {
                    <span className="text-white text-lg font-semibold">
                      {money(item.price)}
                    </span>
                  }

                  <div className="text-[#bababa] text-sm">
                    Qty:{" "}
                    <span className="text-white font-medium">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[#bababa] text-sm">Subtotal:</span>
                    <span className="text-white text-lg font-semibold">
                      {money(rowSubtotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

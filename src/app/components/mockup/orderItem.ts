import { MockProduct } from "./product";


export type MockOrderItem = {
  orderItemId: number;
  productId: number;
  title: string;
  image: string;
  platform: "PS5" | "Nintendo Switch 2" | "XBOX" | "PC";
  version: string; // "Standard Edition" | "Deluxe Edition" | ...
  price: number;           // original/base price
  discount?: number | null; // $ amount off
  quantity: number;
  isDigital: boolean;
};

// same mulberry32 rng so seeded results are repeatable
function rng(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeMockOrderItems(
  count: number,
  products: MockProduct[],
  seed: number = 1
): MockOrderItem[] {
  const rand = rng(seed);
  const platforms = ["PS5", "Nintendo Switch 2", "XBOX", "PC"] as const;
  const versions = ["Standard Edition", "Deluxe Edition", "Collector's Edition"];

  return Array.from<unknown, MockOrderItem>({ length: count }, (_, i) => {
    const p = products[Math.floor(rand() * products.length)];
    return {
      orderItemId: i + 1,
      productId: p.id,
      title: p.title,
      image: p.image,
      platform: platforms[Math.floor(rand() * platforms.length)],
      version: versions[Math.floor(rand() * versions.length)],
      price: p.price,
      discount: p.discount ?? null,
      quantity: 1 + Math.floor(rand() * 3), // 1–3
      isDigital: rand() > 0.55,
    };
  });
}

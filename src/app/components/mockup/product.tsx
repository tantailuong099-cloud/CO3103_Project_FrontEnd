// app/lib/mock/products.ts
// Mock product generator with numeric fields (price, rating) and optional discount (amount off)

export type MockProduct = {
  id: number;
  title: string;
  genre?: string[];
  subtitle?: string;
  image: string;
  tags?: string[];
  price: number;      // base/original price, e.g. 29
  discount?: number | null; // amount to subtract from price; null/0 => no discount
  rating: number;     // e.g. 8.6 (1.0 - 10.0)
};

export type MockOptions = {
  seed?: number; // pass a number to get the same list every time
  // allow overriding any shared field except the ones we generate uniquely
  defaults?: Partial<Omit<MockProduct, "id" | "title" | "price" | "rating">>;
};

// Simple deterministic PRNG (mulberry32) so seeded results are repeatable
function rng(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate N mock products with numeric price & rating, plus optional discount amount.
 *
 * UI rule:
 *   finalPrice = discount ? (price - discount) : price
 *
 * @example
 *   const games = makeMockProducts(200, { seed: 7 });
 */
export function makeMockProducts(count: number, options: MockOptions = {}): MockProduct[] {
  const { seed, defaults = {} } = options;
  const rand = seed != null ? rng(seed) : Math.random;

  const genres = [
    "Action",
    "Adventure",
    "RPG",
    "Strategy",
    "Simulation",
    "Shooter",
    "Puzzle",
  ];
  const tagsPool = [
    "Action",
    "RPG",
    "Indie",
    "Multiplayer",
    "Open World",
    "Story Rich",
    "Co-op",
  ];

  return Array.from<unknown, MockProduct>({ length: count }, (_, i) => {
    const pickedGenres = genres.slice().sort(() => 0.5 - rand()).slice(0, 5);

    const rating = Math.round((rand() * 9 + 1) * 10) / 10; // 1.0 - 10.0
    const price = Math.floor(rand() * 60) + 10;            // 10 - 69

    // ~45% chance to have a discount; cap discount to <= 60% of price and >= 1
    const hasDiscount = rand() < 0.45;
    const maxOff = Math.max(1, Math.floor(price * 0.6));
    const discount = hasDiscount ? Math.max(1, Math.floor(rand() * maxOff)) : null;

    const tagCount = 1 + Math.floor(rand() * 3);
    const tags = Array.from({ length: tagCount }, () => tagsPool[Math.floor(rand() * tagsPool.length)]);

    const base: MockProduct = {
      id: i + 1,
      title: `Game ${i + 1}`,
      genre: pickedGenres,
      subtitle: rand() > 0.6 ? "Action, Mystery" : undefined,
      image: "/images/EldenRing_poster.jpg",
      tags,
      price,
      discount,
      rating,
    };

    return { ...base, ...defaults };
  });
}

/** Convenience alias */
export const mockProducts = makeMockProducts;

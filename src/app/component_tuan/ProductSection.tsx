"use client";

import { useRef } from "react";
import ProductCard from "../component_vy/GameCardSample";

interface Product {
  id: number;
  title: string;
  subtitle?: string;
  price: string;
  rating: string;
  image: string;
  tags?: string[];
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  variant?: "flash-sale" | "default";
}

export default function ProductSection({
  title,
  products,
  variant = "default",
}: ProductSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-8 md:py-12">
      <div className="px-6 lg:px-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {variant === "flash-sale" && (
              <div className="bg-gradient-to-r from-[#FF6B35] to-[#ff3b3b] px-4 py-2 rounded">
                <h2 className="text-white text-lg md:text-xl font-bold uppercase">
                  {title}
                </h2>
              </div>
            )}
            {variant === "default" && (
              <div className="bg-gradient-to-r from-[#FF6B35] to-[#ff7e4d] px-4 py-2 rounded">
                <h2 className="text-white text-lg md:text-xl font-bold uppercase">
                  {title}
                </h2>
              </div>
            )}
          </div>

          <a
            href="#"
            className="text-gray-400 hover:text-[#FF6B35] transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <span>View All</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors backdrop-blur-sm -ml-4 hidden md:flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:outline-none"
            aria-label="Scroll left"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Products Grid */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-4 pb-4">
              {products.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-48 md:w-52">
                  <ProductCard
                    title={product.title}
                    subtitle={product.subtitle}
                    price={product.price}
                    rating={product.rating}
                    image={product.image}
                    tags={product.tags}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors backdrop-blur-sm -mr-4 hidden md:flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:outline-none"
            aria-label="Scroll right"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

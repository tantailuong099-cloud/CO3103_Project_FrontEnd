"use client";
import { useState, useEffect } from "react";
import { useRef } from "react";
import CardLayout from "@/app/components/pages/card/GameCardSample";
import { api } from "@/app/services/api";
import { useSearchParams, useRouter } from "next/navigation";
interface Product {
  id: number;
  title: string;
  subtitle?: string;
  category?: string;
  price: number | string;   
  rating: number | string;  
  avatar: string;
  tags?: string[];
}

interface ProductSectionProps {
  title: string;
  variant?: "flash-sale" | "default";
}

export default function ProductSection({
  title,
  variant = "default",
}: ProductSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 300;
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };
    //const params = useSearchParams();
  
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            const data = await api.get(`/api/product`);
            setProducts(data as any[]);
          } catch (error) {
            console.error("Error loading products:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      }, []); 


  return (
    <section className="py-8 md:py-12">
      <div className="px-6 lg:px-12">
        {/* Title Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`bg-gradient-to-r ${
                variant === "flash-sale"
                  ? "from-[#FF6B35] to-[#ff3b3b]"
                  : "from-[#FF6B35] to-[#ff7e4d]"
              } px-4 py-2 rounded`}
            >
              <h2 className="text-white text-lg md:text-xl font-bold uppercase">
                {title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => router.push("/search")}
            className="text-gray-400 hover:text-[#FF6B35] transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <span>View All</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>

        {/* Horizontal Scroll Section */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors backdrop-blur-sm -ml-4 hidden md:flex"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scrollable Product Row */}
          <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide scroll-smooth">
            <div className="flex gap-4 p-4">
              {products.map((item) => (
                <div key={item._id} className="flex-shrink-0 w-[200px]">   {/* thêm dòng này */}
                  <CardLayout
                    id={item._id.toString()}
                    title={item.name}
                    price={item.price}
                    avatar={item.avatar}
                    category={item.categoryName}
                    rating={item.metacriticScore}
                  />
                </div>
              ))}
            </div>
          </div>


          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors backdrop-blur-sm -mr-4 hidden md:flex"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

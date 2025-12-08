"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import CardLayout from "@/app/components/pages/card/GameCardSample";
import { api } from "@/app/services/api";

import PaginationV3 from "@/app/components/pages/bar/pagination";
import FilterDropdown from "@/app/components/pages/bar/FilterBar";
import SortedBy, { SortValue } from "@/app/components/pages/bar/SortBar";
import { platform } from "os";

export default function SearchPage() {
  const params = useSearchParams();

  const categoryId = params.get("categoryId");
  const categoryName = params.get("categoryName");
  const type = params.get("type");
  const platform = params.get("platform");


  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ✅ sort state
  const [sortBy, setSortBy] = useState<SortValue>("relevant");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data: any[] = [];

        if (type) {
          const res = await api.get(`/api/product/type/${type}`);
          data = res as any[];
        }

        if (categoryId) {
          const res = await api.get(`/api/categories/product/${categoryId}`);
          data = res as any[];
        }
        if (platform) {
          const res = await api.get(`/api/product/platform/${platform}`);
          data = res as any[];
        }

        if (!categoryId && !type && !platform) {
          const res = await api.get(`/api/product`);
          data = res as any[];
        }

        setProducts(data);
        setCurrentPage(1);
      } catch (error) {
        console.error("❌ Error loading products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, type]);

  // ✅ UI SORT LOGIC
  const getSortedProducts = () => {
    if (sortBy === "relevant") return products; // giữ nguyên thứ tự server

    const sorted = [...products];

    sorted.sort((a, b) => {
      const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;

      const priceA = Number(a.price ?? 0);
      const priceB = Number(b.price ?? 0);

      switch (sortBy) {
        case "newest":
          return dateB - dateA; // mới nhất trước
        case "oldest":
          return dateA - dateB; // cũ trước
        case "priceLow":
          return priceA - priceB; // giá tăng dần
        case "priceHigh":
          return priceB - priceA; // giá giảm dần
        default:
          return 0;
      }
    });

    return sorted;
  };

  const sortedProducts = getSortedProducts();

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <main className="p-10 text-white">
      {/* HEADER TITLE */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">
          {type
            ? `Type: ${type}`
            : categoryName
            ? `Category: ${categoryName}`
            : "Search"}
        </h1>
      </div>

      {/* FILTER + SORT BAR */}
      <div className="flex items-center justify-between mb-8 relative z-40">
        <FilterDropdown />
        <SortedBy value={sortBy} onChange={setSortBy} />
      </div>

      {/* CONTENT */}
      {loading ? (
        <p>Loading...</p>
      ) : currentProducts.length === 0 ? (
        <p>No products found</p>
      ) : (
        <>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-6">
            {currentProducts.map((item) => (
              <CardLayout
                key={item._id}
                id={item._id}
                title={item.name}
                price={item.price}
                avatar={item.avatar}
                category={item.categoryName}
                rating={item.metacriticScore}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <PaginationV3
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}

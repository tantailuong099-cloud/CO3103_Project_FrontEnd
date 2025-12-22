"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import CardLayout from "@/app/components/pages/card/GameCardSample";
import { api } from "@/app/services/api";

import PaginationV3 from "@/app/components/pages/bar/pagination";
import SortedBy, { SortValue } from "@/app/components/pages/bar/SortBar";
import ClientFilterSection from "@/app/components/pages/bar/FilterBar";
import { useQueryFilters } from "@/app/hook/useQueryFilters";

export default function SearchPage() {
  const params = useSearchParams();
  const { getFilter } = useQueryFilters();

  const categoryId = params.get("categoryId");
  const categoryName = params.get("categoryName");
  const q = params.get("q");
  const type = params.get("type");
  const platform = params.get("platform");
  const playerMin = params.get("playerMin");
  const [categories, setCategories] = useState<
    { _id: string; name: string; description: string }[]
  >([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

   useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<
          { _id: string; name: string; description: string }[]
        >("/api/categories");
        setCategories(res);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // sort
  const [sortBy, setSortBy] = useState<SortValue>("relevant");

  // ✅ CHỈ CÒN 2 FILTER: TYPE + CATEGORY
  const clientFilters = [
    {
      type: "select",
      queryKey: "type",
      options: [
        { label: "Type", value: "" },
        { label: "Digital", value: "digital" },
        { label: "Physical", value: "physical" },
      ],
    },
    {
      type: "select",
      queryKey: "categoryId",
      options: [
        { label: "Category", value: "" },
        ...categories.map((c) => ({
          label: c.name,
          value: c._id, // 🔥 dùng ID thật
        })),
      ],
    },
    {
        type: "number",
        queryKey: "playerMin",
        placeholder: "Min player",
        min: 1,
      },

  ];

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams();
        if (q) query.set("q", q);
        if (type) query.set("type", type);
        if (categoryId) query.set("categoryId", categoryId);
        if (platform) query.set("platform", platform);
        if (playerMin) query.set("playerMin", playerMin);

        const data = await api.get(`/api/product?${query.toString()}`);

        setProducts(data);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, categoryId, platform, playerMin]);


  // ✅ APPLY CLIENT FILTERS (CHỈ TYPE + CATEGORY)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    const typeFilter = getFilter("typeFilter");
    const categoryFilter = getFilter("categoryFilter");

    if (typeFilter) {
      result = result.filter((p) => p.type === typeFilter);
    }

    if (categoryFilter) {
      result = result.filter(
        (p) => p.categorySlug === categoryFilter
      );
    }

    return result;
  }, [products, getFilter]);

  // ✅ SORT
  const sortedProducts = useMemo(() => {
    if (sortBy === "relevant") return filteredProducts;

    const sorted = [...filteredProducts];

    sorted.sort((a, b) => {
      const dateA = new Date(a.releaseDate || 0).getTime();
      const dateB = new Date(b.releaseDate || 0).getTime();
      const priceA = Number(a.price || 0);
      const priceB = Number(b.price || 0);

      switch (sortBy) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "priceLow":
          return priceA - priceB;
        case "priceHigh":
          return priceB - priceA;
        default:
          return 0;
      }
    });

    return sorted;
  }, [filteredProducts, sortBy]);

  // ✅ PAGINATION
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <main className="p-10 text-white">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl">
          Search
        </h1>
      </div>

      <div className="flex items-center justify-between mb-8">
        <ClientFilterSection filters={clientFilters as any} />
        <SortedBy value={sortBy} onChange={setSortBy} />
      </div>

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

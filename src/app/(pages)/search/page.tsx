"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import CardLayout from "@/app/components/pages/card/GameCardSample";
import { api } from "@/app/services/api";

export default function SearchPage() {
  const params = useSearchParams();

  // ✅ ĐỌC ĐÚNG QUERY PARAM
  const categoryId = params.get("categoryId");
  const categoryName = params.get("categoryName");
  const type = params.get("type");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId && !type) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        let data: any[] = [];

        // ✅ FILTER BY TYPE
        if (type) {
          const res = await api.get(`/api/product/type/${type}`);
          data = res as any[];
        }

        // ✅ FILTER BY CATEGORY (ĐÃ SỬA ĐÚNG API)
        if (categoryId) {
          const res = await api.get(
            `/api/categories/product/${categoryId}`
          );
          data = res as any[];
        }

        console.log("✅ SEARCH RESULT:", data);
        setProducts(data);
      } catch (error) {
        console.error("❌ Error loading products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, type]);

  return (
    <main className="p-10 text-white">
      <h1 className="text-2xl mb-6">
        {type
          ? `Type: ${type}`
          : categoryName
          ? `Category: ${categoryName}`
          : "Search"}
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-6">
          {products.map((item) => (
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
      )}
    </main>
  );
}

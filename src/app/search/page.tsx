"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/app/services/api";
import CardLayout from "@/app/components/pages/card/GameCardSample";

export default function SearchPage() {
  const params = useSearchParams();
  const category = params.get("category"); // example: "Action"

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // ✅ Call your backend: /api/categories/Action
        const data = await api.get(`/api/categories/${category}`);
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  return (
    <main className="p-10 text-white">
      <h1 className="text-2xl mb-6">Category: {category}</h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <CardLayout
              key={item._id}
              id={item._id}
              title={item.name}
              price={item.price}
              image={item.avatar}
              genre={item.genre}
            />
          ))}
        </div>
      )}
    </main>
  );
}

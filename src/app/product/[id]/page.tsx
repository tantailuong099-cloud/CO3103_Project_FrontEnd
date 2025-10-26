"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { api } from "@/app/services/api";

import BuySection from "@/app/components/pages/product/BuySection";
import DetailSection from "@/app/components/pages/product/DetailSection";
import ProductSection from "@/app/components/pages/section/ProductSection";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>(); // Get the product ID from URL
  const [product, setProduct] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        // ✅ 1. Fetch product details
        const data = await api.get(`/api/product/${id}`);
        setProduct(data);

        // ✅ 2. Fetch related products (same category)
        if (data?.category?._id || data?.category) {
          const catId = data.category._id || data.category;
          const res = await api.get(`/api/categories/${catId}`);
          setRelated(res.filter((item: any) => item._id !== data._id).slice(0, 6));
        }
      } catch (err) {
        console.error(err);
        setProduct(null); // triggers 404
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (!loading && !product) return notFound(); // Show 404 if product not found

  return (
    <main className="min-h-screen bg-[#262626] text-white px-10">
      {/* ---- Breadcrumb ---- */}
      <nav className="text-sm text-gray-400 px-6 md:px-12 py-8">
        <a href="/" className="hover:text-white">Home</a>
        <span className="mx-2">/</span>
        <a href="/search" className="hover:text-white">Search</a>
        <span className="mx-2">/</span>
        <span className="text-white">{product?.name || "Loading..."}</span>
      </nav>

      {/* ---- Top Section: Image + Buy Info ---- */}
      {product && (
        <BuySection product={product} related={related} />
      )}

      {/* ---- Product Details Section ---- */}
      <div className="mt-16 px-6 md:px-12">
        <DetailSection product={product} />
      </div>

      {/* ---- Related Section ---- */}
      {related.length > 0 && (
        <ProductSection
          title="MORE ITEMS LIKE THIS"
          products={related}
          variant="flash-sale"
        />
      )}
    </main>
  );
}

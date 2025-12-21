"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { api } from "@/app/services/api";

import BuySection from "@/app/components/pages/product/BuySection";
import DetailSection from "@/app/components/pages/product/DetailSection";
import ProductSection from "@/app/components/pages/section/ProductSection";

type Product = {
  _id: string;
  name: string;
  type: "digital" | "physical"; // GameType
  price: number;
  version: string;

  category: string; // ✅ string theo Cách 2 (slug | name)
  categoryName: string;
  metacriticScore: number;
  metacriticURL?: string;

  ignScore: number;
  ignURL?: string;

  releaseDate: string | Date;
  ageConstraints: number;

  productImage: string[];
  avatar?: string;

  language: string; // platform
  playerNumber?: number;

  manufactor?: string;
  options?: string[];
  playmode?: string;

  stock?: number;
  description?: string;

  videoLink?: string;

  createdAt?: string;
  updatedAt?: string;
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data: Product = await api.get(`/api/product/${id}`);
        setProduct(data);
      } catch (err) {
        console.error("Fetch product error:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // Tạo một hằng số ảnh mặc định nếu không có avatar hoặc productImage
  const mainImage =
    product?.avatar ||
    product?.productImage?.[0] ||
    "/images/placeholder-game.png";

  if (loading)
    return (
      <div className="min-h-screen bg-[#262626] flex items-center justify-center">
        Loading...
      </div>
    );
  if (!product) return notFound();

  return (
    <main className="min-h-screen bg-[#262626] text-white px-10">
      <nav className="text-sm text-gray-400 px-6 md:px-12 py-8">
        <a href="/" className="hover:text-white">
          Home
        </a>
        <span className="mx-2">/</span>
        <a href="/search" className="hover:text-white">
          Search
        </a>
        <span className="mx-2">/</span>
        <span className="text-white">{product.name}</span>
      </nav>

      {/* Truyền mainImage đã xử lý xuống BuySection */}
      <BuySection product={{ ...product, avatar: mainImage }} />

      <div className="mt-16">
        <DetailSection product={product} />
      </div>

      <ProductSection title="FLASH SALE" variant="flash-sale" />
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE = "/no-image.png";

export type HeroProduct = {
  _id: string;
  title: string;
  description: string;
  releaseDate: string;
  price: number | string;
  rating?: number | string;
  tags?: string[];
  thumbnail?: string;
  logo?: string;
  platform?: string | string[];
};

export default function Hero() {
  const [slides, setSlides] = useState<HeroProduct[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const mapToHeroProduct = (p: any): HeroProduct => {
    const images = p.productImage ?? [];

    const logo =
      images[0]?.url ??
      images[0]?.secure_url ??
      images[0] ??
      p.avatar;

    const thumbnail =
      images[1]?.url ??
      images[1]?.secure_url ??
      images[1] ??
      images[1]?.url ??
      images[1]?.secure_url ??
      images[1] ??
      p.avatar;

    return {
      _id: p._id,
      title: p.name,
      description: p.description,
      releaseDate: p.releaseDate,
      price: p.price,
      rating: p.metacriticScore ?? p.ignScore,
      tags: [p.type].filter(Boolean),
      thumbnail,
      logo,
      platform: p.language,
    };
  };

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/product/latest", {
          cache: "no-store",
        });

        const raw = await res.json();
        const mapped = Array.isArray(raw) ? raw.map(mapToHeroProduct) : [];

        setSlides(mapped);
      } catch (err) {
        console.error("Failed to fetch hero products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  const nextSlide = () => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <section className="w-full h-[500px] flex items-center justify-center text-white">
        Loading...
      </section>
    );
  }

  if (!slides.length) return null;

  const currentGame = slides[currentSlide];

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[680px] overflow-hidden">
      {/* Background Image (uses image 3) */}
      <div className="absolute inset-0">
        <Image
          src={currentGame.thumbnail || FALLBACK_IMAGE}
          alt={currentGame.title}
          fill
          className="w-full h-full object-contain bg-black p-1"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="relative h-full px-6 lg:px-12">
        <div className="flex flex-col justify-between h-full py-8">
          <div className="flex flex-col justify-center flex-1 max-w-2xl">
            {/* Logo (uses image 1) */}
            {currentGame.logo && (
              <div className="mb-4">
                <Image
                  src={currentGame.logo}
                  alt={`${currentGame.title} logo`}
                  width={300}
                  height={150}
                  className="w-auto h-32 md:h-40 lg:h-48 object-contain"
                />
              </div>
            )}

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
              {currentGame.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              {currentGame.rating && (
                <span className="px-3 py-1 bg-[#FF6B35] text-white text-xs font-semibold rounded">
                  Rating: {currentGame.rating}
                </span>
              )}

              {currentGame.platform && (
                <span className="px-3 py-1 bg-[#4a4a4a] text-white text-xs font-semibold rounded">
                  {currentGame.platform}
                </span>
              )}

              {currentGame.releaseDate && (
                <span className="px-3 py-1 bg-[#4a4a4a] text-white text-xs font-semibold rounded">
                  {new Date(currentGame.releaseDate).getFullYear()}
                </span>
              )}

              
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              
              {currentGame.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
              {currentGame.price && (
                <span className="px-3 py-1 bg-[#ff3b3b] text-white text-xs font-semibold rounded">
                  ${currentGame.price}
                </span>
              )}
            </div>

            <p className="text-gray-200 text-sm md:text-base leading-relaxed line-clamp-4">
              {currentGame.description}
            </p>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {slides.map((item, index) => (
              <button
                key={item._id}
                onClick={() => setCurrentSlide(index)}
                className={`flex-shrink-0 w-28 h-[70px] md:w-32 md:h-20 lg:w-36 lg:h-24 rounded overflow-hidden border-2 transition-all ${
                  index === currentSlide
                    ? "border-[#FF6B35] ring-2 ring-[#FF6B35]/50"
                    : "border-transparent hover:border-white/50"
                }`}
              >
                <Image
                  src={item.thumbnail || FALLBACK_IMAGE}
                  alt={item.title}
                  width={144}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <button onClick={prevSlide} className="hero-btn left-4">
        ◀
      </button>
      <button onClick={nextSlide} className="hero-btn right-4">
        ▶
      </button>
    </section>
  );
}

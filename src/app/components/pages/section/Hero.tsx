"use client";

import { useState } from "react";
import Image from "next/image";

const heroGames = [
  {
    id: 1,
    title: "The Legend of Zelda: Tears of the Kingdom",
    description:
      "An epic open-world adventure where the hero explores the lands and skies of Hyrule, crafting new weapons, uncovering ancient secrets, and battling a mysterious force threatening the kingdom.",
    metacritic: "8.8",
    ign: "9.6",
    platform: "NINTENDO",
    year: "2023",
    price: "€10+",
    tags: ["Adventure", "Action"],
    logo: "/images/zelda.png",
    thumbnail: "/images/zeld.jpg",
  },
];

const thumbnails = [
  "/images/zelda.jpg",
  "/images/cod.jpg",
  "/images/valorant.jpg",
  "/images/halo reach.webp",
  "/images/duskasfalls.webp",
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentGame = heroGames[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroGames.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroGames.length) % heroGames.length);
  };

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[680px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={currentGame.thumbnail}
          alt={currentGame.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="relative h-full px-6 lg:px-12">
        <div className="flex flex-col justify-between h-full py-8">
          <div className="flex flex-col justify-center flex-1 max-w-2xl">
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
              <span className="px-3 py-1 bg-[#FF6B35] text-white text-xs md:text-sm font-semibold rounded border border-[#ff7e4d]">
                Metacritic: {currentGame.metacritic}
              </span>
              <span className="px-3 py-1 bg-[#FF6B35] text-white text-xs md:text-sm font-semibold rounded border border-[#ff7e4d]">
                IGN: {currentGame.ign}
              </span>
              <span className="px-3 py-1 bg-[#4a4a4a] text-white text-xs md:text-sm font-semibold rounded">
                {currentGame.platform}
              </span>
              <span className="px-3 py-1 bg-[#4a4a4a] text-white text-xs md:text-sm font-semibold rounded">
                {currentGame.year}
              </span>
              <span className="px-3 py-1 bg-[#ff3b3b] text-white text-xs md:text-sm font-semibold rounded">
                {currentGame.price}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {currentGame.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 text-white text-xs md:text-sm font-medium rounded backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              {currentGame.description}
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {thumbnails.map((thumb, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index % heroGames.length)}
                className={`flex-shrink-0 w-28 h-[70px] md:w-32 md:h-20 lg:w-36 lg:h-24 rounded overflow-hidden border-2 transition-all ${
                  index === currentSlide
                    ? "border-[#FF6B35] ring-2 ring-[#FF6B35]/50"
                    : "border-transparent hover:border-white/50"
                }`}
              >
                <Image
                  src={thumb}
                  alt={`Game ${index + 1}`}
                  width={144}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:outline-none"
        aria-label="Previous slide"
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
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:outline-none"
        aria-label="Next slide"
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
    </section>
  );
}

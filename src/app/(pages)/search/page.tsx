"use client";

import { useState } from "react";
import FilterDropdown from "../../components/pages/bar/FilterBar";
import SortedBy from "../../components/pages/bar/SortBar";
import CardLayout from "@/app/components/pages/card/GameCardSample";
import PaginationV3 from "@/app/components/pages/bar/pagination";

export default function SearchPage() {
  // --- demo 30 games ---
  const games = Array.from({ length: 200 }, (_, i) => ({
    title: `Game ${i + 1}`,
    genre: "Action, Adventure",
    rating: Number((Math.random() * 10).toFixed(1)),
    price: Math.floor(Math.random() * 60) + 10,
    image: "/images/EldenRing_poster.jpg",
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // --- Pagination logic ---
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = games.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(games.length / itemsPerPage);

  return (
    <main className="min-h-screen bg-[#262626] text-white p-8">
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <FilterDropdown />
          <SortedBy />
        </div>
      </div>

      {/* Game Grid */}
      <section
        className="grid gap-6 mb-10"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", // ✅ auto wrap
        }}
      >
        {currentItems.map((item, index) => (
          <CardLayout key={index} {...item} />
        ))}
      </section>

      {/* Pagination BELOW the cards */}
      <div className="flex justify-center mt-6">
        <PaginationV3
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}

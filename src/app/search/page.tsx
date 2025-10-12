"use client"; // 👈 required for interactivity

import FilterDropdown from "../component_vy/FilterBar";
import SortedBy from "../component_vy/SortBar"; // 👈 import your sorted bar

export default function FilterTestPage() {
  return (
    <main className="min-h-screen bg-[#262626] flex items-center justify-center text-white">
      {/* container for both filter + sort */}
      <div className="flex w-screen items-center gap-6">
        <FilterDropdown />
        <SortedBy />
      </div>
    </main>
  );
}

"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationV3({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex gap-2 items-center py-8">
      {/* Prev button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`h-[30px] w-[60px] rounded-[8px] flex items-center justify-center
          ${
            currentPage === 1
              ? "bg-[rgba(186,186,186,0.3)] text-gray-500 cursor-not-allowed"
              : "bg-[rgba(186,186,186,0.5)] text-black hover:bg-[#fa4d38] hover:text-white transition"
          }`}
      >
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`h-[30px] w-[30px] rounded-[8px] flex items-center justify-center font-semibold text-[16px]
            ${
              page === currentPage
                ? "bg-[#fa4d38] text-white underline underline-offset-2"
                : "bg-transparent text-white hover:bg-[#1e1e1e]"
            }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`h-[30px] w-[60px] rounded-[8px] flex items-center justify-center
          ${
            currentPage === totalPages
              ? "bg-[rgba(186,186,186,0.3)] text-gray-500 cursor-not-allowed"
              : "bg-[rgba(186,186,186,0.5)] text-black hover:bg-[#fa4d38] hover:text-white transition"
          }`}
      >
        Next
      </button>
    </div>
  );
}

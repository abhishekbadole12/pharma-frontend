'use client';

interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pages, onPageChange }: PaginationProps) {
  if (pages <= 1) return null;

  const pageNumbers = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-2 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-50"
      >
        Previous
      </button>
      {pageNumbers.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-2 rounded-lg text-sm ${
            p === page ? 'bg-teal-600 text-white' : 'border hover:bg-gray-50'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="px-3 py-2 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
}

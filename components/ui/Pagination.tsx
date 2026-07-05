"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

interface PaginationProps {
  meta: PaginationMeta;
}

export function Pagination({ meta }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (meta.last_page <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-4">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            عرض <span className="font-medium">{meta.from || 0}</span> إلى{" "}
            <span className="font-medium">{meta.to || 0}</span> من أصل{" "}
            <span className="font-medium">{meta.total}</span> نتيجة
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {meta.links.map((link, index) => {
              // Decode HTML entities like &laquo; and &raquo;
              let label = link.label;
              if (label.includes("&laquo;")) label = "السابق";
              if (label.includes("&raquo;")) label = "التالي";

              // If there's no URL (e.g. disabled Previous/Next), render a disabled button
              if (!link.url) {
                return (
                  <span
                    key={index}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-300 cursor-not-allowed"
                  >
                    {label}
                  </span>
                );
              }

              // Extract page number from URL since the API returns absolute backend URLs
              const urlObj = new URL(link.url);
              const pageNum = urlObj.searchParams.get("page") || "1";

              return (
                <Link
                  key={index}
                  href={createPageURL(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    link.active
                      ? "z-10 bg-brand border-brand text-white"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                  dangerouslySetInnerHTML={{ __html: label }}
                />
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

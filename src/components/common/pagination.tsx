"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode } from "react";

export function PaginationSection({ pageCount }: { pageCount: number }) {
  const t = useTranslations("Pagination");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page") ?? 1);
  const handlePagination = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 5;

    if (pageCount <= maxVisiblePages) {
      for (let i = 1; i <= pageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePagination(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={() => handlePagination(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <span
              aria-hidden
              className={cn("flex h-9 w-9 items-center justify-center")}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">{t("more")}</span>
            </span>
          </PaginationItem>,
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(pageCount - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePagination(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      if (currentPage < pageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      items.push(
        <PaginationItem key={pageCount}>
          <PaginationLink
            href="#"
            onClick={() => handlePagination(pageCount)}
            isActive={currentPage === pageCount}
          >
            {pageCount}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <Pagination className="justify-center lg:justify-start">
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            onClick={() => handlePagination(currentPage - 1)}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
            aria-label="Go to previous page"
            size="default"
            className={cn(
              "gap-1 pl-2.5",
              currentPage === 1 ? "pointer-events-none opacity-50" : undefined,
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{t("previous")}</span>
          </PaginationLink>
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={() => handlePagination(currentPage + 1)}
            aria-disabled={currentPage == pageCount}
            tabIndex={currentPage === pageCount ? -1 : undefined}
            aria-label="Go to next page"
            size="default"
            className={cn(
              "gap-1 pr-2.5",
              currentPage === pageCount
                ? "pointer-events-none opacity-50"
                : undefined,
            )}
          >
            <span>{t("next")}</span>
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

function buildPages(page: number, totalPages: number) {
  // คืนค่าเป็น (number | "…")[] เช่น [1, "…", 4, 5, 6, "…", 20]
  const pages: Array<number | "…"> = [];

  const add = (p: number) => pages.push(p);
  const ellipsis = () => pages.push("…");

  const clamp = (p: number) => Math.max(1, Math.min(totalPages, p));

  const current = clamp(page);

  // กรณี totalPages น้อย แสดงหมดเลย
  if (totalPages <= 7) {
    for (let p = 1; p <= totalPages; p++) add(p);
    return pages;
  }

  // แสดงหน้าแรกเสมอ
  add(1);

  // ช่วงรอบ current: current-1, current, current+1
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  if (start > 2) ellipsis();

  for (let p = start; p <= end; p++) add(p);

  if (end < totalPages - 1) ellipsis();

  // แสดงหน้าสุดท้ายเสมอ
  add(totalPages);

  return pages;
}

export default function CoursesPaginationClient({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pages = useMemo(() => buildPages(page, totalPages), [page, totalPages]);

  const go = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        หน้า {page} / {totalPages}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={() => go(page - 1)}
          disabled={page <= 1}
        >
          ก่อนหน้า
        </Button>

        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`e-${idx}`} className="px-2 text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              onClick={() => go(p)}
              className="min-w-10"
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="outline"
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
        >
          ถัดไป
        </Button>
      </div>
    </div>
  );
}

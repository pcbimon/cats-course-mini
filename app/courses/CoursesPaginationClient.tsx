"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

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

  const go = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        หน้า {page} / {totalPages}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => go(page - 1)}
          disabled={page <= 1}
        >
          ก่อนหน้า
        </Button>

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

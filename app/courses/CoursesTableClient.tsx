"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FormatQuery = "ALL" | "ONLINE" | "OFFLINE" | "HYBRID";

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  format: "ONLINE" | "OFFLINE" | "HYBRID";
  createdAt: string;
};

function isFormatQuery(v: string): v is FormatQuery {
  return v === "ALL" || v === "ONLINE" || v === "OFFLINE" || v === "HYBRID";
}

export default function CoursesTableClient({
  courses,
  currentFormat,
  q,
}: {
  courses: CourseRow[];
  currentFormat: FormatQuery;
  q: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // keyword state sync จาก query
  const [keyword, setKeyword] = useState(() => q);
  const count = useMemo(() => courses.length, [courses]);

  const onChangeFormat = (v: string) => {
    if (!isFormatQuery(v)) return;

    const params = new URLSearchParams(searchParams.toString());

    if (v === "ALL") params.delete("format");
    else params.set("format", v);

    params.delete("page"); // ✅ เปลี่ยน filter แล้วกลับหน้า 1
    router.replace(`${pathname}?${params.toString()}`);
  };

  // ✅ debounce search → เขียน q ลง URL
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      const next = keyword.trim();
      const currentQ = params.get("q") ?? "";

      // ถ้าไม่เปลี่ยนจริง ไม่ต้อง replace
      if (next === currentQ) return;

      if (!next) params.delete("q");
      else params.set("q", next);

      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(t);
  }, [keyword, pathname, router, searchParams]);


  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">รูปแบบ:</div>

          <Select value={currentFormat} onValueChange={onChangeFormat}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="เลือกรูปแบบ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">ทั้งหมด</SelectItem>
              <SelectItem value="ONLINE">ONLINE</SelectItem>
              <SelectItem value="OFFLINE">OFFLINE</SelectItem>
              <SelectItem value="HYBRID">HYBRID</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm text-muted-foreground">แสดง {count} รายการ</div>
        </div>

        <div className="sm:w-[280px]">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ค้นหาชื่อหรือ slug..."
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อหลักสูตร</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>รูปแบบ</TableHead>
              <TableHead className="w-[220px]">สร้างเมื่อ</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  ไม่พบหลักสูตรตามตัวกรอง
                </TableCell>
              </TableRow>
            ) : (
              courses.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{c.format}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(c.createdAt).toLocaleString("th-TH")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

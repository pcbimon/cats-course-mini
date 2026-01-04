import Link from "next/link";
import { z } from "zod";

import { dbListCoursesPaged } from "@/app/db-functions/courses/list-courses";
import { Button } from "@/components/ui/button";
import CoursesTableClient from "@/app/courses/CoursesTableClient";
import CoursesPaginationClient from "@/app/courses/CoursesPaginationClient";

const FormatQuerySchema = z.enum(["ALL", "ONLINE", "OFFLINE", "HYBRID"]);
type FormatQuery = z.infer<typeof FormatQuerySchema>;

const PageSchema = z.coerce.number().int().min(1).catch(1);

function parseFormat(format: unknown): FormatQuery {
  const parsed = FormatQuerySchema.safeParse(format);
  return parsed.success ? parsed.data : "ALL";
}

const PAGE_SIZE = 5;

export default async function CoursesPage({
  searchParams,
}: {
  searchParams?: Promise<{ format?: string; page?: string }>;
}) {
  const sp = await searchParams;

  const currentFormat = parseFormat(sp?.format);
  const page = PageSchema.parse(sp?.page);

  const { total, items } = await dbListCoursesPaged({
    format: currentFormat === "ALL" ? undefined : currentFormat,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const safeCourses = items.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">หลักสูตรทั้งหมด</h1>

        <Button asChild>
          <Link href="/courses/new">สร้างหลักสูตร</Link>
        </Button>
      </div>

      <CoursesTableClient courses={safeCourses} currentFormat={currentFormat} />

      <CoursesPaginationClient page={page} totalPages={totalPages} />
    </div>
  );
}

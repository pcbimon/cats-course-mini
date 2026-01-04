import Link from "next/link";
import { z } from "zod";

import { dbListCourses } from "@/app/db-functions/courses/list-courses";
import { Button } from "@/components/ui/button";
import CoursesTableClient from "@/app/courses/CoursesTableClient";

const FormatQuerySchema = z.enum(["ALL", "ONLINE", "OFFLINE", "HYBRID"]);
type FormatQuery = z.infer<typeof FormatQuerySchema>;

function parseFormat(format: unknown): FormatQuery {
  const parsed = FormatQuerySchema.safeParse(format);
  return parsed.success ? parsed.data : "ALL";
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams?: { format?: string };
}) {
  const sp = await searchParams;
  const currentFormat = parseFormat(sp?.format);

  const courses = await dbListCourses({
    format: currentFormat === "ALL" ? undefined : currentFormat,
  });

  const safeCourses = courses.map((c) => ({
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
    </div>
  );
}

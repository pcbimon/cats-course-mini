"use server";

import { z } from "zod";
import type { CourseFormat } from "@/lib/generated/prisma/client";
import { dbListCourses } from "@/app/db-functions/courses/list-courses";

const FormatFilterSchema = z.enum(["ALL", "ONLINE", "OFFLINE", "HYBRID"]);
type FormatFilter = z.infer<typeof FormatFilterSchema>;

export async function filterCoursesAction(formatRaw: unknown) {
  const parsed = FormatFilterSchema.safeParse(formatRaw);
  const format: FormatFilter = parsed.success ? parsed.data : "ALL";

  const courses = await dbListCourses({
    format: format === "ALL" ? undefined : (format as CourseFormat),
  });

  // ส่งกลับเป็น plain object (createdAt เป็น string)
  return courses.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));
}

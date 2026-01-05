// app/db-function/courses/getCourseForEdit.ts
import { prisma } from "@/lib/prisma"; // <- ปรับให้ตรงของอิ้ง

export async function getCourseForEdit(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, title: true, slug: true, format: true },
  });

  if (!course) return null;

  // Prisma enum → string (ส่งเข้า client ได้)
  return {
    id: course.id,
    title: course.title ?? "",
    slug: course.slug ?? "",
    format: course.format as "ONLINE" | "OFFLINE" | "HYBRID",
  };
}

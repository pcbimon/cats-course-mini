// app/db-function/courses/updateCourseBasic.ts
import { prisma } from "@/lib/prisma"; // <- ปรับให้ตรงของอิ้ง
import type { CourseBasicInput } from "@/app/modules/courses/schemas/course-basic.schema";

export async function updateCourseBasic(courseId: string, input: CourseBasicInput) {
  await prisma.course.update({
    where: { id: courseId },
    data: {
      title: input.title,
      slug: input.slug,
      format: input.format,
    },
  });
}

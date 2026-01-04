import { prisma } from "@/lib/prisma";
import type { CourseFormat } from "@/lib/generated/prisma/client";

export async function dbCreateCourse(input: {
  title: string;
  slug: string;
  format: CourseFormat;
}) {
  return prisma.course.create({
    data: {
      title: input.title,
      slug: input.slug,
      format: input.format,
    },
  });
}

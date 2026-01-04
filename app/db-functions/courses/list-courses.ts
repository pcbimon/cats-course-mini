import { prisma } from "@/lib/prisma";

export type CourseFormat = "ONLINE" | "OFFLINE" | "HYBRID";

export async function dbListCourses(args?: { format?: CourseFormat }) {
  return prisma.course.findMany({
    where: args?.format ? { format: args.format } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      format: true,
      createdAt: true,
    },
  });
}

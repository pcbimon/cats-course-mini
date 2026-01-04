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

export async function dbListCoursesPaged(args: {
  format?: CourseFormat;
  page: number;       // 1-based
  pageSize: number;   // เช่น 10
}) {
  const where = args.format ? { format: args.format } : undefined;
  const skip = (args.page - 1) * args.pageSize;
  const take = args.pageSize;

  const [total, items] = await Promise.all([
    prisma.course.count({ where }),
    prisma.course.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true,
        title: true,
        slug: true,
        format: true,
        createdAt: true,
      },
    }),
  ]);

  return { total, items };
}
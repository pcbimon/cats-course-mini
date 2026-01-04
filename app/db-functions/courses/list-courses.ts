import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

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
  q?: string;
  page: number;
  pageSize: number;
}) {
  const q = args.q?.trim();
  const where: Prisma.CourseWhereInput = {
    ...(args.format ? { format: args.format } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { slug: { contains: q, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {}),
  };

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
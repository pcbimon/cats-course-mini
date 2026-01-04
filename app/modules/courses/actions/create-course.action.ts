"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma/client";
import type { z } from "zod";

import { CourseBasicInput, CourseBasicInputSchema } from "@/app/modules/courses/schemas/course-basic.schema";
import { dbCreateCourse } from "@/app/db-functions/courses/create-course";

type FieldErrors = Partial<Record<keyof CourseBasicInput | "_form", string[]>>;

function isCourseField(key: string): key is keyof CourseBasicInput {
  return key === "title" || key === "slug" || key === "format";
}

function issuesToFieldErrors(err: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};

  for (const issue of err.issues) {
    const keyFromPath = issue.path[0]; // สำหรับฟอร์มนี้ path ควรเป็น ["title"] | ["slug"] | ["format"]

    const key =
      typeof keyFromPath === "string" && isCourseField(keyFromPath)
        ? keyFromPath
        : "_form";

    (fieldErrors[key] ??= []).push(issue.message);
  }

  return fieldErrors;
}

type ActionResult =
  | { ok: true; data: { id: string } }
  | { ok: false; fieldErrors?: FieldErrors; message?: string };

export async function createCourseAction(raw: unknown): Promise<ActionResult> {
  const parsed = CourseBasicInputSchema.safeParse(raw);

  if (!parsed.success) {
    return { ok: false, fieldErrors: issuesToFieldErrors(parsed.error) };
  }

  try {
    const created = await dbCreateCourse(parsed.data);

    revalidatePath("/courses");
    return { ok: true, data: { id: created.id } };
  } catch (err) {
    // slug ซ้ำ (unique constraint)
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { ok: false, fieldErrors: { slug: ["slug นี้ถูกใช้งานแล้ว"] } };
    }

    console.error("createCourseAction error:", err);
    return { ok: false, message: "บันทึกไม่สำเร็จ กรุณาลองใหม่" };
  }
}

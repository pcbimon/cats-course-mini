// app/modules/courses/actions/update-course-basic.action.ts
"use server";

import { CourseBasicInputSchema, type CourseBasicInput } from "@/app/modules/courses/schemas/course-basic.schema";
import { updateCourseBasic } from "@/app/db-functions/courses/updateCourseBasic";

export async function updateCourseBasicAction(courseId: string, input: CourseBasicInput) {
  const parsed = CourseBasicInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors };
  }

  await updateCourseBasic(courseId, parsed.data);
  return { ok: true as const };
}

// app/modules/courses/actions/get-course-for-edit.action.ts
"use server";

import { getCourseForEdit } from "@/app/db-functions/courses/getCourseForEdit";

export type CourseForEditDTO = {
  id: string;
  title: string;
  slug: string;
  format: "ONLINE" | "OFFLINE" | "HYBRID";
};

export async function getCourseForEditAction(courseId: string): Promise<CourseForEditDTO | null> {
  return getCourseForEdit(courseId);
}

// app/courses/[courseId]/edit/page.tsx
import CourseEditClient from "./CourseEditClient";
import { getCourseForEditAction } from "@/app/modules/courses/actions/get-course-for-edit.action";

type PageProps = { params: { courseId: string } };

export default async function Page({ params }: PageProps) {
  const course = await getCourseForEditAction(params.courseId);

  if (!course) return <div className="p-6">ไม่พบหลักสูตร</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">แก้ไขหลักสูตร</h1>
      <CourseEditClient course={course} />
    </div>
  );
}

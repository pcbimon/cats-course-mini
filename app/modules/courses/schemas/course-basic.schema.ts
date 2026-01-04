import { z } from "zod";

export const CourseFormatSchema = z.enum(["ONLINE", "OFFLINE", "HYBRID"]);

export const CourseBasicInputSchema = z.object({
  title: z.string().min(1, "กรุณากรอกชื่อหลักสูตร"),
  slug: z
    .string()
    .min(1, "กรุณากรอก slug")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug ใช้ตัวพิมพ์เล็ก a-z, 0-9 และ - เท่านั้น"),
  format: CourseFormatSchema,
});

export type CourseBasicInput = z.infer<typeof CourseBasicInputSchema>;

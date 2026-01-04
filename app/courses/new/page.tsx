"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CourseBasicInputSchema,
  type CourseBasicInput,
} from "@/app/modules/courses/schemas/course-basic.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCourseAction } from "@/app/modules/courses/actions/create-course.action";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";

export default function NewCoursePage() {
  const form = useForm<CourseBasicInput>({
    resolver: zodResolver(CourseBasicInputSchema),
    defaultValues: {
      title: "",
      slug: "",
      format: "ONLINE",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: CourseBasicInput) => {
    // ล้าง error เดิม (ถ้ามี)
    form.clearErrors();

    const result = await createCourseAction(values);

    if (!result.ok) {
      applyServerErrors(form, result.fieldErrors, result.message);
      return;
    }

    alert("บันทึกสำเร็จ");
    form.reset({ title: "", slug: "", format: "ONLINE" });
  };


  return (
    <div className="mx-auto max-w-xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">สร้างหลักสูตรใหม่</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อหลักสูตร</FormLabel>
                <FormControl>
                  <Input placeholder="เช่น React สำหรับ HR" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="เช่น react-for-hr" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>รูปแบบการสอน</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกรูปแบบ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ONLINE">ONLINE</SelectItem>
                    <SelectItem value="OFFLINE">OFFLINE</SelectItem>
                    <SelectItem value="HYBRID">HYBRID</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root?.message ? (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </p>
          ) : null}

          <Button type="submit">บันทึก</Button>
        </form>
      </Form>
    </div>
  );
}

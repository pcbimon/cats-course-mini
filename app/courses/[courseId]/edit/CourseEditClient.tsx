"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    CourseBasicInputSchema,
    type CourseBasicInput,
} from "@/app/modules/courses/schemas/course-basic.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { updateCourseBasicAction } from "@/app/modules/courses/actions/update-course-basic.action";

type CourseForEdit = {
    id: string;
    title: string;
    slug: string;
    format: "ONLINE" | "OFFLINE" | "HYBRID";
};

export default function CourseEditClient({ course }: { course: CourseForEdit }) {
    const form = useForm<CourseBasicInput>({
        resolver: zodResolver(CourseBasicInputSchema),
        defaultValues: {
            title: "",
            slug: "",
            format: "ONLINE",
        },
        mode: "onBlur",
    });

    useEffect(() => {
        form.reset({
            title: course.title ?? "",
            slug: course.slug ?? "",
            format: course.format ?? "ONLINE",
        });
    }, [course, form]);

    const [saving, setSaving] = useState(false);

    const onSubmit = form.handleSubmit(async (values) => {
        setSaving(true);
        try {
            const res = await updateCourseBasicAction(course.id, values);

            if (!res.ok) {
                // map server errors -> RHF errors
                const fieldErrors = res.errors ?? {};
                (Object.keys(fieldErrors) as Array<keyof CourseBasicInput>).forEach((key) => {
                    const msg = fieldErrors[key]?.[0];
                    if (msg) form.setError(key, { type: "server", message: msg });
                });
                return;
            }

            // สำคัญ: บันทึกสำเร็จแล้วให้ถือว่าฟอร์ม "สะอาด" (ไม่ dirty)
            form.reset(values);
        } finally {
            setSaving(false);
        }
    });


    const formatValue = form.watch("format");

    return (
        <Card>
            <CardHeader>
                <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="title">ชื่อหลักสูตร</Label>
                        <Input id="title" {...form.register("title")} />
                        {form.formState.errors.title && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.title.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" {...form.register("slug")} />
                        {form.formState.errors.slug && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.slug.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>รูปแบบการสอน</Label>
                        <Select
                            value={formatValue}
                            onValueChange={(v) =>
                                form.setValue("format", v as CourseBasicInput["format"], {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="เลือกรูปแบบ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ONLINE">Online</SelectItem>
                                <SelectItem value="OFFLINE">Offline</SelectItem>
                                <SelectItem value="HYBRID">Hybrid</SelectItem>
                            </SelectContent>
                        </Select>
                        {form.formState.errors.format && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.format.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button type="submit" disabled={saving || !form.formState.isDirty}>
                            {saving ? "กำลังบันทึก..." : "บันทึก"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

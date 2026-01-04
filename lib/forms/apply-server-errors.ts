import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type ServerFieldErrors = Record<string, string[]>;

/**
 * เก็บ path ของ field ทั้งหมดจาก object ปัจจุบันของฟอร์ม
 * เช่น basic.title, instructors.0.email
 */
function collectPaths(value: unknown, prefix = "", out = new Set<string>()) {
  if (value === null || value === undefined) return out;

  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      const next = prefix ? `${prefix}.${i}` : String(i);
      collectPaths(item, next, out);
    });
    return out;
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of Object.keys(obj)) {
      const next = prefix ? `${prefix}.${key}` : key;
      out.add(next);
      collectPaths(obj[key], next, out);
    }
  }

  return out;
}

function isValidPath<TFieldValues extends FieldValues>(
  key: string,
  form: UseFormReturn<TFieldValues>
): key is Path<TFieldValues> {
  const values = form.getValues();
  const paths = collectPaths(values);
  return paths.has(key);
}

export function applyServerErrors<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  fieldErrors?: ServerFieldErrors,
  fallbackMessage?: string
) {
  if (fieldErrors) {
    for (const [key, messages] of Object.entries(fieldErrors)) {
      const message = messages?.[0];
      if (!message) continue;

      if (key === "_form") {
        form.setError("root", { type: "server", message });
        continue;
      }

      if (isValidPath(key, form)) {
        form.setError(key, { type: "server", message });
      } else {
        // ถ้า server ส่ง key ที่ไม่ตรงกับ field จริง ให้โชว์เป็น error ระดับฟอร์ม
        form.setError("root", { type: "server", message });
      }
    }
    return;
  }

  if (fallbackMessage) {
    form.setError("root", { type: "server", message: fallbackMessage });
  }
}

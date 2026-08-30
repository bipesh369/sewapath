import { z } from "zod";

const createServiceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters"),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  category: z
    .string()
    .trim()
    .min(2, "Category is required"),

  fee: z
    .number()
    .min(0, "Fee cannot be negative"),

  processingTime: z
    .string()
    .trim()
    .min(1, "Processing time is required"),

  deliveryMode: z
    .string()
    .trim()
    .min(1, "Delivery mode is required"),

  officialUrl: z
    .string()
    .trim()
    .url("Official URL must be a valid URL")
    .optional(),

  status: z
    .enum(["draft", "published", "archived"])
    .optional(),
});

const updateServiceSchema = createServiceSchema.partial();


export default {
  createServiceSchema,
  updateServiceSchema,
}
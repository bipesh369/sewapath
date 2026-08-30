import { z } from "zod";
const createDocumentRequirementSchema = z.object({
  serviceId: z
    .string()
    .min(1, "Service ID is required"),

  label: z.object({
    en: z
      .string()
      .trim()
      .min(1, "English label is required"),

    ne: z
      .string()
      .trim()
      .min(1, "Nepali label is required"),
  }),

  mandatory: z
    .boolean()
    .optional(),

  notes: z.object({
    en: z.string().trim().optional(),
    ne: z.string().trim().optional(),
  }).optional(),

  order: z
    .number()
    .int()
    .min(1, "Order must be at least 1"),
});

const updateDocumentRequirementSchema =
  createDocumentRequirementSchema.partial();


  export default {
    createDocumentRequirementSchema,
    updateDocumentRequirementSchema,
  }
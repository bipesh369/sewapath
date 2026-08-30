import { z } from "zod";

export const createJourneyStepSchema = z.object({
  order: z
    .number()
    .int()
    .min(1, "Order must be at least 1"),

  title: z.object({
    en: z
      .string()
      .trim()
      .min(1, "English title is required"),

    ne: z
      .string()
      .trim()
      .min(1, "Nepali title is required"),
  }),

  instructions: z.object({
    en: z
      .string()
      .trim()
      .min(1, "English instructions are required"),

    ne: z
      .string()
      .trim()
      .min(1, "Nepali instructions are required"),
  }),

  responsibleOffice: z
    .string()
    .trim()
    .min(1, "Responsible office ID is required")
    .nullable()
    .optional(),

  estimatedTime: z
    .object({
      en: z
        .string()
        .trim()
        .optional(),

      ne: z
        .string()
        .trim()
        .optional(),
    })
    .optional(),
});

export const updateJourneyStepSchema =
  createJourneyStepSchema.partial();


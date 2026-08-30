import { z } from "zod";

const eligibilityOptionSchema = z.object({
  label: z.object({
    en: z
      .string()
      .trim()
      .min(1, "English option label is required"),

    ne: z
      .string()
      .trim()
      .min(1, "Nepali option label is required"),
  }),

  value: z
    .string()
    .trim()
    .min(1, "Option value is required"),

  resultsInEligible: z.boolean(),

  nextQuestionOrder: z
    .number()
    .int()
    .min(1)
    .nullable()
    .optional(),
});

const createEligibilityQuestionSchema = z.object({
  order: z
    .number()
    .int()
    .min(1, "Order must be at least 1"),

  questionText: z.object({
    en: z
      .string()
      .trim()
      .min(1, "English question is required"),

    ne: z
      .string()
      .trim()
      .min(1, "Nepali question is required"),
  }),

  options: z
    .array(eligibilityOptionSchema)
    .min(1, "At least one option is required"),

  isTerminal: z
    .boolean()
    .optional(),
});

const updateEligibilityQuestionSchema =
  createEligibilityQuestionSchema.partial();

const evaluateEligibilitySchema = z.object({
  answers: z
    .array(
      z.object({
        questionOrder: z
          .number()
          .int()
          .min(1),

        value: z
          .string()
          .trim()
          .min(1),
      })
    )
    .min(1, "At least one answer is required"),
});

export default {
  createEligibilityQuestionSchema,
  updateEligibilityQuestionSchema,
  evaluateEligibilitySchema,
};

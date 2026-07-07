import z from "zod";

export const CreateChatbotContextSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    context: z.string().min(1, "Context text is required"),
  }),
});

export const UpdateChatbotContextSchema = z.object({
  body: CreateChatbotContextSchema.shape.body.partial(),
});

export const AskChatbotSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Message is required"),
  }),
});

export type CreateChatbotContextInput = z.infer<typeof CreateChatbotContextSchema>["body"];
export type UpdateChatbotContextInput = z.infer<typeof UpdateChatbotContextSchema>["body"];
export type AskChatbotInput = z.infer<typeof AskChatbotSchema>["body"];

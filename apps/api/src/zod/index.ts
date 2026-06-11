
import * as z from "zod";

export const ChatSchema = z.object({
    message: z.string().max(1000).min(1),
    model: z.string(),
    conversationId: z.string().optional()
});

export const FileSchema = z.object({
    size: z.number(),
    type: z.string(),
    name: z.string()
})

import * as z from "zod";

const MAXIUMUM_INPUT_CHARACTERS = 1000;

export const ChatSchema = z.object({
    message: z.string().max(MAXIUMUM_INPUT_CHARACTERS).min(1),
    model: z.string(),
    conversationId: z.string().optional()
});


export const ImageSchema = z.object({
    prompt: z.string().max(MAXIUMUM_INPUT_CHARACTERS).min(1),
    model: z.string(),
    conversationId: z.string()
});

export const FileSchema = z.object({
    size: z.number(),
    type: z.string(),
    name: z.string()
})
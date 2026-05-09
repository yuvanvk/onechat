import { MAXIMUM_CHARACTERS_LENGTH } from "@/config";
import * as z from "zod";

export const ChatSchema = z.object({
    message: z.string().max(MAXIMUM_CHARACTERS_LENGTH).min(1),
    model: z.string(),
    conversationId: z.string().optional()
});
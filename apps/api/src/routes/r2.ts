import { Bindings, Variables } from "@/types";
import { Hono } from "hono";
import { AwsClient } from "aws4fetch";
import { FileSchema } from "@/zod";

const router = new Hono<{ Bindings: Bindings, Variables: Variables }>();

router.post("/", async (c) => {

  try {
    const body = await c.req.json();
    const { success } = FileSchema.safeParse(body);

    if(!success) {
      return c.json({ message: "Invalid Inputs"}, 400);
    }

    const { key, type, size, name } = body;
    if(type !== "image" && type !== "pdf") {
        return c.json({ message: 'Invalid type' }, 400)
    }

    if(size > 10 * 1024 * 1024) {
      return c.json({ message: "File Size greater than 10MB"}, 400);
    }

    const r2 = new AwsClient({
        accessKeyId: c.env.R2_ACCESS_KEY_ID,
        secretAccessKey: c.env.R2_SECRET_ACCESS_KEY
    });

    const bucketName = type === "image" ? "images" : "pdfs";

    const url = new URL(`https://<ACCOUNT_ID>.r2.cloudflarestorage.com/${bucketName}/${encodeURIComponent(key)}`);
    url.searchParams.set("X-Amz-Expires", "3600");

    const signed = await r2.sign(
        new Request(url, { method: "PUT" }),
        { aws: { signQuery: true }},
    )

    return c.json({ message: "OK", data: { signedUrl: signed.url }});
  } catch (error) {
    console.log("R2 Presigning API ->",error);
    
    return c.json({ message: "Internal Server Error"}, 500);
  }  
});

export default router;
import { uploadToBucket } from "./upload-to-bucket";

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  status: "uploading" | "success" | "error";
  previewUrl: string | null;
}

const MAX_MB = 10;

const ALLOWED_FILES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

export async function processFiles(
  files: File[],
  onAdd: (a: Attachment, file: File) => void,
  onUpdate: (fileName: string, patch: Partial<Attachment>) => void,
  onError: (msg: string) => void,
) {

  const validFiles = files.filter((file) => {
    if (!ALLOWED_FILES.includes(file.type)) {
      onError(`${file.type} is not supported`);
      return false;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      onError(`${file.name} exceeds ${MAX_MB}MB size`);
      return false;
    }
    return true;
  });

  await Promise.all(
    validFiles.map(async (file) => {
      onAdd({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        previewUrl: null,
      }, file);

      try {
        const isUploaded = await uploadToBucket(file);
        if (!isUploaded) throw new Error("Upload failed");
        
        onUpdate(file.name, {
          status: "success",
          previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
        });

      } catch (error) {
        if(error instanceof Error) {
          console.log(error.message);
        }
        onError(`${file.name}: upload failed`);
        onUpdate(file.name, { status: 'error' });
      }
    }),
  );
}

// 1. user uploads them as file comes we get preSignedUrl
// 2. Then upload them to R2 and update status uploading (spinner)
// 3. Get the data back and render it in the chatbox
// 4. when pressed enter the content along with file keys goes to backend.
// 5. and using those keys we upload the data in respective database table
// 6. convert to base64 according AI model and stream the response back.

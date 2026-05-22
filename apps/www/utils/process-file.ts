export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  base64: string;
  previewUrl: string | null;
}

const MAX_MB = 10;

const ALLOWED_FILES = ['image/jpeg','image/png','image/gif','image/webp','application/pdf']

export function processFiles(
  files: File[],
  onAdd: (a: Attachment) => void,
  onError: (msg: string) => void,
) {
  for (const file of files) {
    if(!ALLOWED_FILES.includes(file.type)) {
        onError(`${file.name}: unsupported type`);
        continue;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
        onError(`${file.name}: exceeds ${MAX_MB}MB`);
        continue;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file)

    reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1]
        onAdd({
            id:         crypto.randomUUID(),
            name:       file.name,
            type:       file.type,
            size:       file.size,
            base64,
            previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
          })
    }
  }
}

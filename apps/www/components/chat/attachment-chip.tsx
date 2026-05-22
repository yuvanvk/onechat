import { Attachment } from "@/utils/process-file";
import { Button } from "@workspace/ui/components/button";
import { FileText, X } from "lucide-react";
import Image from "next/image";

export const AttachmentChip = ({
  file,
  onRemove,
}: {
  file: Attachment;
  onRemove: (id: string) => void;
}) => {
  return (
    <>
      {file.type.startsWith("image/") && (
      <div className="w-10 h-10 rounded-2xl relative">
        <>
          <Image
            src={file.previewUrl!}
            alt={file.name}
            fill
            className="rounded-xl object-cover"
          />
          <Button
            size={"icon-xs"}
            onClick={() => onRemove(file.id)}
            className="rounded-full absolute -top-2 -right-3 p-0.5!"
          >
            <X size={10} />
          </Button>
        </>
      </div>
      )}
      {file.type.startsWith("application/pdf") && (
        <div className="flex items-center gap-2 bg-neutral-800 text-neutral-400 p-2 rounded-xl relative">
          <FileText size={16} />
          <span className="text-xs ">{file.name}...</span>

          <Button
            size={"icon-xs"}
            onClick={() => onRemove(file.id)}
            className="rounded-full absolute -top-2 -right-3 p-0.5!"
          >
            <X size={10} />
          </Button>
        </div>
      )}
    </>
  );
};

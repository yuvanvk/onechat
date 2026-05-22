import { Attachment } from "@/utils/process-file";
import { Button } from "@workspace/ui/components/button";
import { X } from "lucide-react";
import Image from "next/image";

export const AttachmentChip = ({
  file,
  onRemove,
}: {
  file: Attachment;
  onRemove: (id: string) => void;
}) => {
  return (
    <div className="w-10 h-10 rounded-2xl relative">
      <Image
        src={file.previewUrl!}
        alt={file.name}
        fill
        className="rounded-xl"
      />
      <Button
        size={"icon-xs"}
        onClick={() => onRemove(file.id)}
        className="rounded-full absolute -top-2 -right-3 p-0.5!"
      >
        <X size={10} />
      </Button>
    </div>
  );
};

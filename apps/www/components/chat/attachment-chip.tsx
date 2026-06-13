import { Attachment } from "@/utils/process-file";
import { uploadToBucket } from "@/utils/upload-to-bucket";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FileText, RotateCcw, X } from "lucide-react";
import Image from "next/image";

export const AttachmentChip = ({
  file,
  onRemove,
  handleReUploadFile
}: {
  file: Attachment;
  onRemove: (fileName: string) => void;
  handleReUploadFile: (fileName: string) => Promise<void>
}) => {
  switch (file.status) {
    case "uploading":
      return (
        <div
          key={file.id}
          className="w-8 h-8 rounded-xl flex items-center justify-center bg-muted"
        >
          <Spinner />
        </div>
      );
    case "error":
      return (
        <div
          onClick={async () => await handleReUploadFile(file.name)}
          key={file.id}
          className="w-8 h-8 rounded-xl flex items-center justify-center bg-muted"
        >
          <RotateCcw size={18} className="text-blue-500" />
        </div>
      );
  }


  return (
    <>
      {file.type.startsWith("image/") ? (
        <div key={file.id} className="w-10 h-10 rounded-2xl relative">
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
      ) : (
        <div
          key={file.id}
          className="flex items-center gap-2 bg-muted text-muted-foreground p-2 rounded-xl relative"
        >
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

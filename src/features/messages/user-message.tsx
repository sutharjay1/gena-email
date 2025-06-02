import { Message, MessageAvatar } from "@/components/ui/message";
import {
  PreviewImage,
  PreviewImageContent,
  PreviewImageTrigger,
} from "@/components/ui/preview-image";
import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";
import type { UserMessage } from "./type";

type Props = {
  message: string;
  images: string[];
};

const UserMessage = ({ message, images }: Props) => {
  const renderedImages = useMemo(() => {
    if (images.length === 0) return null;

    const ImagePreview = ({ src, index }: { src: string; index: number }) => (
      <PreviewImage key={`image-${index}`}>
        <PreviewImageTrigger asChild>
          <div
            className={cn(
              images.length === 1
                ? "max-h-52 min-h-fit w-auto max-w-sm cursor-pointer overflow-hidden rounded-md border bg-center"
                : "h-28 w-28 max-w-sm cursor-pointer overflow-hidden rounded-md border",
            )}
          >
            <img
              src={src || "/placeholder.svg"}
              alt="User uploaded image"
              className={cn(
                images.length === 1
                  ? "h-auto w-full bg-center object-cover"
                  : "h-full w-full object-cover",
              )}
              loading="lazy"
            />
          </div>
        </PreviewImageTrigger>
        <PreviewImageContent fileContent={src} file={src} fileType="image" fullscreen />
      </PreviewImage>
    );

    return (
      <div
        className={cn(
          "flex h-auto flex-row flex-wrap items-center justify-end gap-2",
          images.length > 1 && "mb-2",
        )}
      >
        {images.map((src, index) => (
          <ImagePreview key={index} src={src} index={index} />
        ))}
      </div>
    );
  }, [images]);

  return (
    <Message className="group flex items-start justify-center">
      <MessageAvatar
        src={`https://avatar.vercel.sh/${message}`}
        alt="User"
        fallback="U"
        className="size-7 rounded-lg"
      />
      <div className="flex flex-col items-start justify-start gap-0">
        {renderedImages}
        <div
          className={cn(
            "prose dark:prose-invert prose-p:whitespace-break-spaces prose-code:m-0 prose-code:whitespace-break-spaces prose-pre:m-0 prose-pre:w-full prose-pre:p-0 dark:prose-pre:bg-secondary-50 mb-3 w-fit max-w-[80%] select-text gap-1 overflow-auto overflow-x-auto whitespace-pre-wrap text-wrap break-words text-sm font-medium leading-[22px] text-primary/95",
            images.length > 0 && "rounded-se",
            // "mb-8 group-hover:mb-0",
          )}
        >
          <div>{message}</div>
        </div>
        {/* <div className="hidden group-hover:block">
          <CopyButton componentSource={message} />
        </div> */}
      </div>
    </Message>
  );
};

export default memo(UserMessage);

"use client";

import { Button } from "@/components/ui/button";
import {
  PreviewImage,
  PreviewImageContent,
  PreviewImageTrigger,
} from "@/components/ui/preview-image";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { useAcceptPrompt } from "@/hooks/use-accept-prompt";
import { cn } from "@/lib/utils";
import { useChat } from "@/provider/chat-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip } from "@mynaui/icons-react";
import { ArrowUp, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  prompt: z.string().min(1),
  image: z.array(z.string()).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const formatBytes = (bytes: number) => {
  if (bytes < 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  } else {
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }
};

export const MessageInput = () => {
  const { prompt } = useAcceptPrompt();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const { sendMessage, isRunning, stopStreaming } = useChat();

  const isLoading = isRunning || sendMessage.isPending;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: prompt || "",
      image: [],
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    sendMessage.mutate(data.prompt);
    form.setValue("prompt", "");
  });

  const encodeImageAsBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result?.toString().split(",")[1];
        resolve(result || "");
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const encodedImages = await Promise.all(images.map((file: File) => encodeImageAsBase64(file)));

    setImages([...images, file]);

    form.setValue("image", encodedImages);
  };

  const removeImage = (file: File) => {
    setImages(images.filter((img) => img !== file));
  };

  useEffect(() => {
    if (sendMessage.isSuccess) {
      form.setValue("prompt", "");
    }
  }, [sendMessage.isSuccess]);

  return (
    <>
      <PromptInput
        value={form.watch("prompt")}
        onValueChange={(value) => form.setValue("prompt", value)}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        className="w-full rounded-xl bg-accent/20 p-0"
      >
        {images.length > 0 && (
          <PromptInputActions className="rounded-t-xl border-b p-2.5">
            {images.map((img, index) => (
              <PreviewImage key={`image-${index}`}>
                <PreviewImageTrigger asChild>
                  <div className="relative rounded-xl border border-border bg-sidebar-accent/15 p-1">
                    <div className={cn("cursor-pointer overflow-hidden rounded-xl")}>
                      <div className="flex w-full items-center justify-center gap-2">
                        <img
                          src={URL.createObjectURL(img) || "/placeholder.svg"}
                          alt="User uploaded image"
                          className="size-11 rounded-md border border-border object-cover"
                          loading="lazy"
                        />
                        <div className="flex flex-col items-start justify-start">
                          <p className="max-w-24 truncate text-sm font-normal text-muted-foreground">
                            {img.name}
                          </p>
                          <p className="text-xs font-normal text-muted-foreground">
                            {formatBytes(img.size)}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(img);
                        }}
                        className="absolute -right-1.5 -top-1.5 z-[100] size-5 rounded-full border border-border p-0 text-primary shadow-md"
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  </div>
                </PreviewImageTrigger>
                <PreviewImageContent
                  fileContent={URL.createObjectURL(img)}
                  file={URL.createObjectURL(img)}
                  fileType="image"
                  fullscreen
                />
              </PreviewImage>
            ))}
          </PromptInputActions>
        )}

        <PromptInputTextarea className="p-3" placeholder="Ask me anything..." />
        <PromptInputActions className="justify-end p-2">
          <PromptInputAction tooltip={isLoading ? "Stop generation" : "Send message"}>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 rounded-md"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach files"
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="file-upload"
                ref={fileInputRef}
                aria-label="File upload input"
              />
              <Paperclip className="size-5 text-muted-foreground transition-colors hover:text-primary" />
            </Button>
          </PromptInputAction>

          <PromptInputAction tooltip={isLoading ? "Stop generation" : "Send message"}>
            <Button
              variant="default"
              size="icon"
              className="size-7 rounded-md"
              onClick={() => {
                if (isLoading) {
                  stopStreaming();
                } else {
                  handleSubmit();
                }
              }}
            >
              {isLoading ? (
                <Square className="size-5 fill-current" />
              ) : (
                <ArrowUp className="size-5" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>
    </>
  );
};

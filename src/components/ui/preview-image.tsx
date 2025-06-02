"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const PreviewImage = DialogPrimitive.Root;

const PreviewImageTrigger = DialogPrimitive.Trigger;

const PreviewImagePortal = DialogPrimitive.Portal;

const PreviewImageClose = DialogPrimitive.Close;

const PreviewImageOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
PreviewImageOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface PreviewImageContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  closeClassName?: string;
  previewClassName?: string;
  border?: boolean;
  fileType?: string;
  fileSrc?: string;
  fileContent?: string;
  fileName?: string;
  file?: File | string;
  fullscreen?: boolean;
}

const PreviewImageContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  PreviewImageContentProps
>(({ className, fileContent, fileName, ...props }, ref) => (
  <PreviewImagePortal>
    <PreviewImageOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid h-full w-full translate-x-[-50%] translate-y-[-50%] items-center justify-center gap-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      <div className="flex h-full max-h-[85vh] w-[85vw] items-center justify-center overflow-auto rounded-md">
        <img
          src={fileContent}
          alt={fileName}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>
      <PreviewImageClose className="fixed right-4 top-4 z-[60] rounded-md bg-background/80 p-1.5 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </PreviewImageClose>
    </DialogPrimitive.Content>
  </PreviewImagePortal>
));
PreviewImageContent.displayName = DialogPrimitive.Content.displayName;

const PreviewImageHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
PreviewImageHeader.displayName = "PreviewImageHeader";

const PreviewImageFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
PreviewImageFooter.displayName = "PreviewImageFooter";

const PreviewImageTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
PreviewImageTitle.displayName = DialogPrimitive.Title.displayName;

const PreviewImageDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
PreviewImageDescription.displayName = DialogPrimitive.Description.displayName;

export {
  PreviewImage,
  PreviewImageClose,
  PreviewImageContent,
  PreviewImageDescription,
  PreviewImageFooter,
  PreviewImageHeader,
  PreviewImageOverlay,
  PreviewImagePortal,
  PreviewImageTitle,
  PreviewImageTrigger,
};

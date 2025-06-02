import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { cn } from "@/lib/utils";
import { Bell, CheckCircleSolid, Confetti, DangerTriangleSolid, X } from "@mynaui/icons-react";
import { toast } from "sonner";

type ToastOptions = {
  description?: string;
  duration?: number;
  position?:
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left"
    | "top-center"
    | "bottom-center";
  action?: {
    label: string;
    onClick: () => void;
  };
  button?: React.ReactNode;
};

const DEFAULT_DURATION = 3000;
const DEFAULT_POSITION = "bottom-right";

export const successToast = (message: string, options?: ToastOptions) => {
  const isMobile = window.innerWidth <= 768;

  toast.custom(
    (t) => (
      <div className="w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-foreground shadow-lg sm:w-[var(--width)]">
        <div className={cn("flex items-start gap-2", options?.description && "items-start")}>
          <div
            className={cn("flex grow items-center gap-3", options?.description && "items-start")}
          >
            <CheckCircleSolid className="size-6 text-green-500" />
            <div className="flex grow items-center justify-between gap-12">
              <div>
                <p className="text-sm font-medium text-primary/80">{message}</p>
                {options?.description && (
                  <p className="text-sm text-primary/70">{options.description}</p>
                )}
              </div>
              {options?.action && (
                <div className="whitespace-nowrap text-sm">
                  <button
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={options.action.onClick}
                  >
                    {options.action.label}
                  </button>
                  <span className="mx-1 text-primary/80">·</span>
                  <button
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => toast.dismiss(t)}
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 shrink-0 cursor-auto p-0"
            onClick={() => toast.dismiss(t)}
            aria-label="Close notification"
          >
            <X size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    ),
    {
      duration: options?.duration || DEFAULT_DURATION,
      position: isMobile ? "top-center" : options?.position || DEFAULT_POSITION,
    },
  );
};

export const loadingToast = (
  message: string,
  promise: Promise<unknown>,
  options?: ToastOptions,
  successMessage?: string,
) => {
  const isMobile = window.innerWidth <= 768;
  const toastId = Math.random().toString(36).substring(2, 9);

  toast.custom(
    (t) => (
      <div className="w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-foreground shadow-lg sm:w-[var(--width)]">
        <div className={cn("flex items-center gap-2", options?.description && "items-start")}>
          <div
            className={cn("flex grow items-center gap-3", options?.description && "items-start")}
          >
            <Loading className="size-4 animate-spin text-primary" />
            <div className="flex grow items-center justify-between gap-12">
              <div>
                <p className="text-base font-medium text-primary/80">{message}</p>
                {options?.description && (
                  <p className="text-sm text-primary/70">{options.description}</p>
                )}
              </div>
              {options?.action && (
                <div className="whitespace-nowrap text-sm">
                  <button
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={options.action.onClick}
                  >
                    {options.action.label}
                  </button>
                  <span className="mx-1 text-primary/80">·</span>
                  <button
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => toast.dismiss(t)}
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="-my-1.5 -mr-1 h-7 w-7 shrink-0 cursor-auto p-0"
            onClick={() => toast.dismiss(t)}
            aria-label="Close notification"
          >
            <X size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    ),
    {
      id: toastId,
      duration: Infinity,
      position: isMobile ? "top-center" : options?.position || DEFAULT_POSITION,
    },
  );

  return promise.then(
    (data) => {
      toast.dismiss(toastId);
      successToast(successMessage || "Completed", options);
      return data;
    },
    (error) => {
      toast.dismiss(toastId);
      errorToast(error?.message || "An error occurred", options);
      throw error;
    },
  );
};

export const errorToast = (message: string, options?: ToastOptions) => {
  const isMobile = window.innerWidth <= 768;

  toast.custom(
    (t) => (
      <div
        className={cn(
          "w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-foreground shadow-lg sm:w-[var(--width)]",
          options?.description && "items-start",
        )}
      >
        <div className={cn("flex items-center gap-2", options?.description && "items-start")}>
          <div
            className={cn("flex grow items-center gap-3", options?.description && "items-start")}
          >
            <DangerTriangleSolid className="size-6 text-red-500" />
            <div className="flex grow items-center justify-between gap-12">
              <div>
                <p className="text-base font-medium text-primary/80">{message}</p>
                {options?.description && (
                  <p className="text-sm text-primary/70">{options.description}</p>
                )}
              </div>
              {options?.action && (
                <div className="whitespace-nowrap text-sm">
                  <button
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={options.action.onClick}
                  >
                    {options.action.label}
                  </button>
                  <span className="mx-1 text-primary/80">·</span>
                  <button
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => toast.dismiss(t)}
                  >
                    Dismiss
                  </button>
                </div>
              )}
              {options?.button && options.button}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="-my-1.5 -mr-1 h-7 w-7 shrink-0 cursor-auto p-0"
            onClick={() => toast.dismiss(t)}
            aria-label="Close notification"
          >
            <X size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    ),
    {
      duration: options?.duration || DEFAULT_DURATION,
      position: isMobile ? "top-center" : options?.position || DEFAULT_POSITION,
    },
  );
};

export const infoToast = (message: string, options?: ToastOptions) => {
  const isMobile = window.innerWidth <= 768;

  toast.custom(
    (t) => (
      <div className="w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-foreground shadow-lg sm:w-[var(--width)]">
        <div className="flex items-center gap-2">
          <div className="flex grow items-center gap-3">
            <svg
              className="mt-0.5 text-blue-500"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" />
              <path d="M12 16v-5h-.5m0 5h1M12 8.5V8" />
            </svg>
            <div className="flex grow items-center justify-between gap-12">
              <div>
                <p className="text-base font-medium text-muted-foreground">{message}</p>
                {options?.description && (
                  <p className="text-sm text-primary/70">{options.description}</p>
                )}
              </div>
              {options?.action && (
                <div className="whitespace-nowrap text-sm">
                  <button
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={options.action.onClick}
                  >
                    {options.action.label}
                  </button>
                  <span className="mx-1 text-muted-foreground">·</span>
                  <button
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => toast.dismiss(t)}
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="-my-1.5 -mr-1 h-7 w-7 shrink-0 cursor-auto p-0"
            onClick={() => toast.dismiss(t)}
            aria-label="Close notification"
          >
            <X size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    ),
    {
      duration: options?.duration || DEFAULT_DURATION,
      position: isMobile ? "top-center" : options?.position || DEFAULT_POSITION,
    },
  );
};

export const warningToast = (message: string, options?: ToastOptions) => {
  const isMobile = window.innerWidth <= 768;

  toast.custom(
    (t) => (
      <div className="w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-foreground shadow-lg sm:w-[var(--width)]">
        <div className="flex items-center gap-2">
          <div className="flex grow items-center gap-3">
            <svg
              className="mt-0.5 text-yellow-500"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 8.5V14m0 3.247v-.5m-6.02-5.985C8.608 5.587 9.92 3 12 3s3.393 2.587 6.02 7.762l.327.644c2.182 4.3 3.274 6.45 2.287 8.022C19.648 21 17.208 21 12.327 21h-.654c-4.88 0-7.321 0-8.307-1.572s.105-3.722 2.287-8.022z" />
            </svg>
            <div className="flex grow items-center justify-between gap-12">
              <div>
                <p className="text-base font-medium text-primary/80">{message}</p>
                {options?.description && (
                  <p className="text-sm text-primary/70">{options.description}</p>
                )}
              </div>
              {options?.action && (
                <div className="whitespace-nowrap text-sm">
                  <button
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={options.action.onClick}
                  >
                    {options.action.label}
                  </button>
                  <span className="mx-1 text-primary/80">·</span>
                  <button
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => toast.dismiss(t)}
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="-my-1.5 -mr-1 h-7 w-7 shrink-0 cursor-auto p-0"
            onClick={() => toast.dismiss(t)}
            aria-label="Close notification"
          >
            <X size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    ),
    {
      duration: options?.duration || DEFAULT_DURATION,
      position: isMobile ? "top-center" : options?.position || DEFAULT_POSITION,
    },
  );
};

export const copyToast = (message: string = "Copied to clipboard", options?: ToastOptions) => {
  const isMobile = window.innerWidth <= 768;
  toast(message, {
    description: options?.description,
    duration: options?.duration || DEFAULT_DURATION,
    position: isMobile ? "top-center" : options?.position || DEFAULT_POSITION,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-5 w-5 font-semibold"
        strokeWidth={1.2}
      >
        <path
          fill="#10B981"
          d="M14.548 3.488a.75.75 0 0 1-.036 1.06l-8.572 8a.75.75 0 0 1-1.023 0l-3.429-3.2a.75.75 0 0 1 1.024-1.096l2.917 2.722 8.06-7.522a.75.75 0 0 1 1.06.036Z"
        />
      </svg>
    ),
    style: {
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--primary))",
      border: "2px solid hsl(var(--border) / 0.7)",
    },
    className:
      "rounded-xl border-2 border-border/80 py-2.5  shadow-lg flex items-center gap-2 text-sm font-medium",
    action: options?.action,
  });
};

export const notificationToast = (message: string, options?: ToastOptions) => {
  const isMobile = window.innerWidth <= 768;
  toast(message, {
    description: options?.description,
    duration: options?.duration || DEFAULT_DURATION,
    position: isMobile ? "top-center" : options?.position || DEFAULT_POSITION,
    icon: (
      <Bell
        className={cn("h-5 w-5 font-semibold", options?.description && "mt-3")}
        size={16}
        strokeWidth={1.2}
      />
    ),
    style: {
      backgroundColor: "rgb(88, 28, 135)",
      color: "hsl(var(--primary))",
      border: "2px solid hsl(var(--border) / 0.7)",
    },
    className: cn(
      "rounded-xl shadow-lg flex items-center gap-3 py-2 text-sm font-medium justify-start",
      options?.description && "items-start justify-start",
    ),
    action: options?.action,
  });
};

export const congratsToast = (message: string, options?: ToastOptions) => {
  const isMobile = window.innerWidth <= 768;
  toast(message, {
    description: options?.description,
    duration: options?.duration || DEFAULT_DURATION,
    position: isMobile ? "top-center" : options?.position || DEFAULT_POSITION,
    icon: (
      <Confetti
        className={cn("h-5 w-5 font-semibold", options?.description && "mt-3")}
        size={16}
        strokeWidth={1.2}
      />
    ),
    style: {
      backgroundColor: "#004014",
      color: "#56eda1",
      border: "none",
    },
    className: cn(
      "rounded-xl py-3 px-4  shadow-lg flex items-center gap-2 text-sm font-medium",
      options?.description && "items-start justify-start",
    ),
    action: options?.action,
  });
};

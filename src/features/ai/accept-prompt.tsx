"use client";

import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { createNewChat } from "@/features/actions/post/create-new-chat";
import { useAcceptPrompt } from "@/hooks/use-accept-prompt";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCardSolid,
  EditSolid,
  EnvelopeSolid,
  InboxSolid,
  StarSolid,
} from "@mynaui/icons-react";
import { Chat } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowUp, MailIcon, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  prompt: z.string().min(1),
});

type FormSchema = z.infer<typeof formSchema>;

const prompts = [
  {
    icon: <StarSolid className="size-4" />,
    label: "Welcome",
    prompt:
      "Create a warm and engaging welcome email that introduces our brand and sets expectations for future communications",
  },
  {
    icon: <EnvelopeSolid className="size-4" />,
    label: "Newsletter",
    prompt:
      "Draft a compelling newsletter email that highlights key updates, achievements, and valuable content for our subscribers",
  },
  {
    icon: <InboxSolid className="size-4" />,
    label: "Promotional",
    prompt:
      "Write an attention-grabbing promotional email that effectively communicates our latest offers and encourages action",
  },
  {
    icon: <MailIcon className="size-4" />,
    label: "Transactional",
    prompt:
      "Compose a clear and professional transactional email that confirms an action and provides necessary next steps",
  },
  {
    icon: <CreditCardSolid className="size-4" />,
    label: "Billing",
    prompt:
      "Generate a detailed billing email that clearly explains charges, payment status, and available payment options",
  },
  {
    icon: <EditSolid className="size-4" />,
    label: "Custom",
    prompt:
      "Help me craft a custom email that aligns with our brand voice and effectively communicates our message",
  },
];

export const AcceptPrompt = () => {
  const { setPrompt } = useAcceptPrompt();
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { mutate: acceptPrompt, isPending: isAcceptingPrompt } = useMutation({
    mutationKey: ["accept-prompt"],
    mutationFn: (data: FormSchema) => {
      return createNewChat({ content: data.prompt });
    },
    onSuccess: (data: Chat) => {
      setPrompt(form.getValues("prompt"));
      router.push(`/chat/${data.id}`);
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    acceptPrompt(data);
  });

  return (
    <>
      <PromptInput
        value={form.watch("prompt")}
        onValueChange={(value) => form.setValue("prompt", value)}
        isLoading={isAcceptingPrompt}
        onSubmit={handleSubmit}
        className="max-w-(--breakpoint-md) w-full rounded-2xl bg-accent/40 pb-2.5"
      >
        <PromptInputTextarea placeholder="Ask me anything..." />
        <PromptInputActions className="justify-end pt-2">
          <PromptInputAction tooltip={isAcceptingPrompt ? "Stop generation" : "Send message"}>
            <Button
              variant="default"
              size="icon"
              className="size-7 rounded-lg"
              onClick={handleSubmit}
            >
              {isAcceptingPrompt ? (
                <Square className="size-5 fill-current" />
              ) : (
                <ArrowUp className="size-5" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>

      <div className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
        {prompts.map((item) => (
          <div
            key={item.label}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-2 px-3 transition-colors hover:bg-primary/5"
            onClick={() => {
              form.setValue("prompt", item.prompt);
            }}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>
    </>
  );
};

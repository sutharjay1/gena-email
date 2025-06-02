import { useChat } from "@/provider/chat-provider";
import { Message } from "@/provider/chat-provider/type";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { NextResponse } from "next/server";
import { memo, useCallback, useEffect, useRef } from "react";
import { toggleFeedback } from "../actions/post/toggle-feedback";
import { errorToast, successToast } from "../global/toast";
import AssistantMessage from "./assistant-message";
import { MessageSkeleton } from "./message-skeleton";
import UserMessage from "./user-message";

const MessageRenderer = memo(
  ({
    message,
    toggleFeedbackMutation,
  }: {
    message: Message;
    toggleFeedbackMutation: UseMutationResult<
      | NextResponse<{
          error: string;
        }>
      | {
          error: string;
        }
      | undefined,
      Error,
      {
        messageId: string;
        type: "like" | "dislike";
      },
      unknown
    >;
  }) => {
    const handleToggleFeedback = useCallback(
      (type: "like" | "dislike") => {
        if (message.type === "ASSISTANT") {
          toggleFeedbackMutation.mutate({ messageId: message.id, type });
        }
      },
      [message.id, message.type, toggleFeedbackMutation],
    );

    return message.type === "USER" ? (
      <UserMessage message={message.content || ""} images={message.images || []} />
    ) : (
      <AssistantMessage
        message={message}
        onFeedback={handleToggleFeedback}
        isLiked={message.isLiked || false}
        isDisliked={message.isDisliked || false}
      />
    );
  },
);

MessageRenderer.displayName = "MessageRenderer";

const Messages = memo(() => {
  const queryClient = useQueryClient();
  const { messages, isLoadingMessages, isReadyToStream } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 5,
  });

  const toggleFeedbackMutation = useMutation({
    mutationFn: ({ messageId, type }: { messageId: string; type: "like" | "dislike" }) =>
      toggleFeedback(messageId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages"] });
      successToast("Thank you for your feedback!");
    },
    onError: (error) => {
      console.log(error);
      errorToast(error.message);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (isLoadingMessages) {
    return <MessageSkeleton />;
  }

  return (
    <div ref={parentRef} className="h-[87%] w-full overflow-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 pb-8 pt-8">
        {isReadyToStream && <p className="text-sm text-muted-foreground">generating...</p>}
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <MessageRenderer
                message={messages[virtualRow.index]}
                toggleFeedbackMutation={toggleFeedbackMutation}
              />
            </div>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
});

Messages.displayName = "Messages";

export default Messages;

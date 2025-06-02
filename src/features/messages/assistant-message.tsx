import { Markdown } from "@/components/markdown/markdown";
import { Button } from "@/components/ui/button";
import { Message, MessageAction, MessageActions } from "@/components/ui/message";
import { Message as MessageType } from "@/provider/chat-provider/type";
import { At, Dislike, DislikeSolid, Like, LikeSolid } from "@mynaui/icons-react";
import { memo, useCallback, useMemo } from "react";
import CopyButton from "../global/copy-button";
import FileOperation from "./file-operation";

type Props = {
  message: MessageType;
  onFeedback: (type: "like" | "dislike") => void;
  isLiked: boolean;
  isDisliked: boolean;
};

const AssistantMessage = ({ message, onFeedback, isLiked, isDisliked }: Props) => {
  const handleLike = useCallback(() => onFeedback("like"), [onFeedback]);
  const handleDislike = useCallback(() => onFeedback("dislike"), [onFeedback]);

  const messageActions = useMemo(
    () => (
      <MessageActions className="gap-1 self-start">
        <MessageAction tooltip="Copy">
          <CopyButton componentSource={message.content} />
        </MessageAction>

        <MessageAction tooltip="Helpful">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground transition-all ease-in-out hover:bg-transparent hover:text-foreground disabled:opacity-100"
            onClick={handleLike}
          >
            {isLiked ? <LikeSolid className="size-4" /> : <Like className="size-4" />}
          </Button>
        </MessageAction>

        <MessageAction tooltip="Not helpful">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground transition-all ease-in-out hover:bg-transparent hover:text-foreground disabled:opacity-100"
            onClick={handleDislike}
          >
            {isDisliked ? <DislikeSolid className="size-4" /> : <Dislike className="size-4" />}
          </Button>
        </MessageAction>
      </MessageActions>
    ),
    [handleLike, handleDislike, isLiked, isDisliked, message.content],
  );

  return (
    <Message className="mb-12 flex gap-2">
      <At className="size-7 rounded-lg" />

      <div className="flex flex-col items-start justify-start gap-0">
        <Markdown className="mr-auto max-w-xl">{message.content}</Markdown>

        {message.files.length > 0 && <FileOperation key={message.id} files={message.files} />}

        {messageActions}
      </div>
    </Message>
  );
};

export default memo(AssistantMessage);

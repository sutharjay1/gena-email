export type UserMessage = {
  id: string;
  type: "user";
  message: string;
  images: string[];
};

export type AssistantMessage = {
  id: string;
  type: "assistant";
  message: string;
  liked: boolean | null;
  disliked: boolean | null;
};

export type Message = UserMessage | AssistantMessage;

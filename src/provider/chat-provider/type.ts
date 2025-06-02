import { Files, FileStatus, MessageType } from "@prisma/client";
import { UseMutationResult } from "@tanstack/react-query";

export type ChatProviderProps = {
  children: React.ReactNode;
  paramChatId: string;
};

export type ChatContextType = {
  chatId: string;
  setChatId: (chatId: string) => void;
  isLoadingMessages: boolean;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: UseMutationResult<Message, Error, string, unknown>;
  streamingMessage: string;
  isRunning: boolean;
  userPrompt: string;
  setUserPrompt: (userPrompt: string) => void;
  stopStreaming: () => void;
  setIsRunning: (isRunning: boolean) => void;
  isReadyToStream: boolean;
  setIsReadyToStream: (isReadyToStream: boolean) => void;
};

export type Message = {
  id: string;
  content: string;
  type: MessageType;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
  isLiked: boolean | null;
  isDisliked: boolean | null;
  files: Files[];
};

export type StreamFile = {
  id?: string;
  filepath: string;
  content: string;
  lang: string;
  status: FileStatus;
};

"use client";

import { getChatMessages } from "@/features/actions/get/get-chat-messages";
import { genId } from "@/features/actions/lib/gen-id";
import { startAIStream, StreamResponse } from "@/features/actions/post/ai-stream";
import { saveAssistantMessage } from "@/features/actions/post/save-assistant-message";
import { sendNewChatMessage } from "@/features/actions/post/send-new-chat-message";
import { useAcceptPrompt } from "@/hooks/use-accept-prompt";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { readStreamableValue } from "ai/rsc";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ChatContextType, ChatProviderProps, Message } from "./type";

export const ChatContext = createContext<ChatContextType>({
  chatId: "",
  setChatId: () => {},
  isLoadingMessages: false,
  messages: [],
  setMessages: () => {},
  sendMessage: {} as UseMutationResult<Message, Error, string, unknown>,
  streamingMessage: "",
  isRunning: false,
  userPrompt: "",
  setUserPrompt: () => {},
  stopStreaming: () => {},
  setIsRunning: () => {},
  isReadyToStream: false,
  setIsReadyToStream: () => {},
});

export const ChatProvider = ({ children, paramChatId }: ChatProviderProps) => {
  const queryClient = useQueryClient();

  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingRef = useRef<boolean>(false);
  const currentAssistantMessageId = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const [chatId, setChatId] = useState(paramChatId);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isReadyToStream, setIsReadyToStream] = useState<boolean>(false);

  const { prompt, setPrompt } = useAcceptPrompt();

  const { mutate: fetchMessages, isPending: isLoadingMessages } = useMutation({
    mutationKey: ["chat-messages", chatId],
    mutationFn: () => getChatMessages(chatId),
    onSuccess: (data) => {
      setMessages(data);
    },
  });

  useEffect(() => {
    if (chatId && !prompt) {
      fetchMessages();
    }
  }, [chatId, fetchMessages]);

  const cleanupStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamingRef.current = false;
    currentAssistantMessageId.current = null;
    setStreamingMessage("");
    setIsRunning(false);
    setIsReadyToStream(false);
  }, []);

  const stopStreaming = useCallback(() => {
    cleanupStream();
  }, [cleanupStream]);

  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, [cleanupStream, chatId]);

  // Optimized smooth update with debouncing
  const smoothUpdate = useCallback(
    (messageId: string, data: Partial<StreamResponse>) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  content: data.content || msg.content,
                  files: data.files?.length
                    ? data.files.map((file) => ({
                        id: file.filepath,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        filepath: file.filepath,
                        content: file.content,
                        lang: file.lang,
                        messageId: msg.id,
                        status: "PROCESSING",
                      }))
                    : msg.files || [],
                  updatedAt: new Date(),
                }
              : msg,
          ),
        );
      });
    },
    [setMessages],
  );

  const sendMessage = useMutation({
    mutationKey: ["send-message", chatId],
    mutationFn: async (message: string) => {
      cleanupStream();
      setUserPrompt(message);

      // Create temporary user message
      const tempUserMessageId = genId(`user-${Date.now()}`);
      const tempUserMessage: Message = {
        id: tempUserMessageId,
        content: message,
        type: "USER" as const,
        chatId,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
        isLiked: null,
        isDisliked: null,
        files: [],
      };

      setMessages((prev) => [...prev, tempUserMessage]);

      // Create temporary assistant message
      const assistantMessageId = genId(`assistant-${Date.now()}`);
      currentAssistantMessageId.current = assistantMessageId;

      const tempAssistantMessage: Message = {
        id: assistantMessageId,
        content: "",
        type: "ASSISTANT" as const,
        chatId,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
        isLiked: null,
        isDisliked: null,
        files: [],
      };

      setMessages((prev) => [...prev, tempAssistantMessage]);

      // Initialize streaming state
      setIsRunning(true);
      setIsReadyToStream(true);
      streamingRef.current = true;
      abortControllerRef.current = new AbortController();

      try {
        // Save user message to database
        const savedUserMessage = await sendNewChatMessage({ message, chatId });

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempUserMessageId
              ? {
                  ...savedUserMessage,
                  files: savedUserMessage.files.map((file) => ({
                    ...file,
                    status: "PROCESSING",
                  })),
                }
              : msg,
          ),
        );

        return savedUserMessage;
      } catch (error) {
        console.error("Error saving user message:", error);
        // Cleanup on error
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== tempUserMessageId && msg.id !== assistantMessageId),
        );
        cleanupStream();
        throw error;
      }
    },

    onSuccess: async (userMessage) => {
      try {
        const response = await startAIStream([{ role: "user", content: userMessage.content }]);
        const { newMessage } = response;

        if (!newMessage) {
          throw new Error("No response received from AI");
        }

        let lastStreamData: StreamResponse = { content: "", files: [] };

        // Process stream with optimized updates
        for await (const delta of readStreamableValue(newMessage)) {
          if (!streamingRef.current || abortControllerRef.current?.signal.aborted) {
            break;
          }

          if (delta && currentAssistantMessageId.current) {
            const streamData = delta as StreamResponse;

            // Only update if content actually changed
            if (
              streamData.content !== lastStreamData.content ||
              JSON.stringify(streamData.files) !== JSON.stringify(lastStreamData.files)
            ) {
              // Update streaming message for real-time display
              setStreamingMessage(streamData.content);

              // Smooth update to messages
              smoothUpdate(currentAssistantMessageId.current, streamData);

              lastStreamData = streamData;
            }
          }
        }

        // Final update and save to database
        if (streamingRef.current && currentAssistantMessageId.current && lastStreamData.content) {
          try {
            console.log("Saving files:", lastStreamData.files);

            // Prepare files data for saving (remove unnecessary fields)
            const filesToSave = lastStreamData.files.map((file) => ({
              filepath: file.filepath,
              content: file.content,
              lang: file.lang,
            }));

            console.log("Files to save:", filesToSave);

            const savedAssistantMessage = await saveAssistantMessage({
              content: lastStreamData.content,
              files: filesToSave,
              chatId,
              messageId: currentAssistantMessageId.current,
            });

            // Update the message with saved data
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === currentAssistantMessageId.current
                  ? {
                      ...savedAssistantMessage,
                      files: savedAssistantMessage.files || [],
                      id: currentAssistantMessageId.current, // Keep temp ID for UI consistency
                    }
                  : msg,
              ),
            );

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
          } catch (saveError) {
            console.error("Error saving assistant message:", saveError);

            // Show error in the message
            if (currentAssistantMessageId.current) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === currentAssistantMessageId.current
                    ? {
                        ...msg,
                        content: `${lastStreamData.content}\n\n*⚠️ Error saving message: ${saveError instanceof Error ? saveError.message : "Unknown error"}*`,
                      }
                    : msg,
                ),
              );
            }
          }
        }
      } catch (error) {
        console.error("Error in streaming:", error);

        // Show error message
        if (currentAssistantMessageId.current) {
          const errorMessage = `Sorry, I encountered an error while processing your request: ${
            error instanceof Error ? error.message : "Unknown error"
          }. Please try again.`;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === currentAssistantMessageId.current
                ? { ...msg, content: errorMessage }
                : msg,
            ),
          );
        }
      } finally {
        // Cleanup
        cleanupStream();
      }
    },

    onError: (error) => {
      console.error("Error sending message:", error);
      cleanupStream();
    },
  });

  // Handle prompt from useAcceptPrompt
  useEffect(() => {
    if (prompt && chatId && !isLoadingMessages && !isRunning) {
      sendMessage.mutate(prompt);
      setPrompt("");
    }
  }, [prompt, chatId, isLoadingMessages, isRunning, sendMessage, setPrompt]);

  const contextValue: ChatContextType = {
    chatId,
    setChatId,
    isLoadingMessages,
    messages,
    setMessages,
    sendMessage,
    streamingMessage,
    isRunning,
    userPrompt,
    setUserPrompt,
    stopStreaming,
    setIsRunning,
    isReadyToStream,
    setIsReadyToStream,
  };

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

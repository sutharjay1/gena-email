import { ChatProvider } from "@/provider/chat-provider";
import React, { use } from "react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

const ChatLayout = ({ children, params }: Props) => {
  const { id } = use(params);

  return <ChatProvider paramChatId={id}>{children}</ChatProvider>;
};

export default ChatLayout;

"use client";

import { MessageInput } from "@/features/ai/message-input";
import Messages from "@/features/messages/messages";

const AIPage = () => {
  return (
    <main className="relative flex h-[calc(100vh-40px)] flex-col">
      <Messages />
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-8 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute bottom-32 left-0 right-0 z-10 h-8 bg-gradient-to-t from-background to-transparent" />

      <div className="fixed bottom-0 left-0 right-0 z-[999] flex-shrink-0 bg-background p-4 pt-0">
        <div className="mx-auto w-full max-w-3xl">
          <MessageInput />
        </div>
      </div>
    </main>
  );
};

export default AIPage;

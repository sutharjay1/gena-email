"use server";

import { db } from "@/features/db";

export const sendNewChatMessage = async ({
  message,
  chatId,
}: {
  message: string;
  chatId: string;
}) => {
  return await db.message.create({
    data: {
      content: message,
      type: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
      chat: {
        connect: {
          id: chatId,
        },
      },
      files: {
        create: [],
      },
    },
    include: {
      files: true,
    },
  });
};

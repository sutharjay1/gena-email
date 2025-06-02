"use server";

import { db } from "@/features/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getChatMessages = async (chatId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const messages = await db.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    include: {
      files: true,
    },
  });

  return messages;
};

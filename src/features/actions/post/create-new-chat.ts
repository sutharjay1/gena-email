"use server";

import { db } from "@/features/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { genId } from "../lib/gen-id";

export const createNewChat = async ({ content }: { content: string }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const name = content.slice(0, 20);

  const chat = await db.chat.create({
    data: {
      id: genId(content),
      userId: session.user.id,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
    },
  });

  return chat;
};

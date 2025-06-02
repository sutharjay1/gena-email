"use server";

import { db } from "@/features/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const toggleFeedback = async (messageId: string, type: "like" | "dislike") => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const message = await db.message.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  await db.message.update({
    where: { id: messageId },
    data: {
      isLiked: type === "like" ? !message.isLiked : message.isLiked,
      isDisliked: type === "dislike" ? !message.isDisliked : message.isDisliked,
    },
  });
};

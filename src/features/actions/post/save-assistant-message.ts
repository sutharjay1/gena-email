"use server";
import { db } from "@/features/db";
import { genId } from "../lib/gen-id";

interface FileData {
  filepath: string;
  content: string;
  lang: string;
}

export const saveAssistantMessage = async ({
  content,
  files,
  chatId,
}: {
  content: string;
  files: FileData[];
  chatId: string;
  messageId: string;
}) => {
  try {
    if (!content || !chatId) {
      throw new Error("Content and chatId are required");
    }

    const savedMessage = await db.message.create({
      data: {
        id: genId("message"),
        content,
        type: "ASSISTANT",
        createdAt: new Date(),
        updatedAt: new Date(),
        chatId,
        files: {
          create: files.map((file) => ({
            id: genId("file"),
            filepath: file.filepath,
            content: file.content,
            lang: file.lang,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: "COMPLETED",
          })),
        },
      },
      include: {
        files: true,
      },
    });

    return savedMessage;
  } catch (error) {
    console.error("Error saving assistant message:", error);
    throw new Error(
      `Failed to save assistant message: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

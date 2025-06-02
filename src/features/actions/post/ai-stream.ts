// // "use server";

// // import { createMistral } from "@ai-sdk/mistral";
// // import { streamObject } from "ai";
// // import { createStreamableValue } from "ai/rsc";
// // import { z } from "zod";

// // export interface Message {
// //   role: "user" | "assistant";
// //   content: string;
// // }

// // const mistral = createMistral({
// //   apiKey: process.env.MISTRAL_API_KEY,
// //   baseURL: "https://api.mistral.ai/v1",
// // });

// // const schema = z.object({
// //   text: z.string().describe("Agentic reply in markdown format"),
// //   code: z.array(
// //     z.object({
// //       language: z.string().describe("The language of the code"),
// //       code: z.string().describe("The code"),
// //     }),
// //   ),
// // });

// // export async function startAIStream(history: Message[]) {
// //   "use server";

// //   const stream = createStreamableValue();

// //   (async () => {
// //     const { textStream } = streamObject({
// //       model: mistral("mistral-large-latest"),
// //       system: "You are a dude that doesn't drop character until the DVD commentary.",
// //       messages: history,
// //       schema,
// //     });

// //     for await (const text of textStream) {
// //       stream.update(text);
// //     }

// //     stream.done();
// //   })();

// //   return {
// //     messages: history,
// //     streamObject: stream.value,
// //   };
// // }

// "use server";
// import { createMistral } from "@ai-sdk/mistral";
// import { streamObject } from "ai";
// import { createStreamableValue } from "ai/rsc";
// import { z } from "zod";

// export interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

// export interface File {
//   lang: string;
//   content: string;
//   filepath: string;
// }

// export interface StreamResponse {
//   content: string;
//   files: File[];
// }

// const mistral = createMistral({
//   apiKey: process.env.MISTRAL_API_KEY,
//   baseURL: "https://api.mistral.ai/v1",
// });

// const schema = z.object({
//   content: z.string().describe("Main response content in markdown format"),
//   files: z
//     .array(
//       z.object({
//         lang: z.string().describe("Programming language (tsx, javascript, etc.)"),
//         content: z
//           .string()
//           .describe("The actual code content in tsx for email template in tailwind css"),
//         filepath: z.string().describe("Suggested file path/name"),
//       }),
//     )
//     .describe("Array of code blocks with language, content, and filepath"),
// });

// export async function startAIStream(history: Message[]) {
//   const stream = createStreamableValue<StreamResponse>();

//   (async () => {
//     try {
//       const { partialObjectStream } = await streamObject({
//         model: mistral("mistral-large-latest"),
//         system: `You are an expert developer assistant. Always provide structured responses with:
//         - content: Main explanation in markdown
//         - code: Array of code blocks with lang (tsx/js/ts/etc), content, and filepath

//         Keep responses practical and well-organized.

//         You are an expert developer assistant. Always provide structured responses with:
//         - content: Main explanation in markdown
//         - code: Array of code blocks with lang (tsx/js/ts/etc), content, and filepath

//         in files, the content should be the actual code in tsx for email template in tailwind css

//         Keep responses practical and well-organized.`,
//         messages: history,
//         schema,
//       });

//       let lastUpdate: StreamResponse = { content: "", files: [] };

//       for await (const partialObject of partialObjectStream) {
//         if (partialObject) {
//           const currentUpdate: StreamResponse = {
//             content: partialObject.content || "",
//             files:
//               partialObject.files?.map((cde) => ({
//                 lang: cde?.lang ?? "",
//                 content: cde?.content ?? "",
//                 filepath: cde?.filepath ?? "",
//               })) || [],
//           };

//           if (JSON.stringify(currentUpdate) !== JSON.stringify(lastUpdate)) {
//             stream.update(currentUpdate);
//             lastUpdate = currentUpdate;
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Streaming error:", error);
//       stream.error(error);
//     } finally {
//       stream.done();
//     }
//   })();

//   return {
//     newMessage: stream.value,
//     streamObject: stream.value,
//   };
// }

"use server";
import { createMistral } from "@ai-sdk/mistral";
import { FileStatus } from "@prisma/client";
import { streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface File {
  lang: string;
  content: string;
  filepath: string;
  status: FileStatus;
}

export interface StreamResponse {
  content: string;
  files: File[];
}

const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
  baseURL: "https://api.mistral.ai/v1",
});

const schema = z.object({
  content: z.string().describe("Main response content in markdown format"),
  files: z
    .array(
      z.object({
        lang: z.string().describe("Programming language (tsx, javascript, etc.)"),
        content: z
          .string()
          .describe("The actual code content in tsx for email template in tailwind css"),
        filepath: z.string().describe("Suggested file path/name"),
      }),
    )
    .optional()
    .default([])
    .describe("Array of code blocks with language, content, and filepath"),
});

export async function startAIStream(history: Message[]) {
  const stream = createStreamableValue<StreamResponse>();

  (async () => {
    try {
      const { partialObjectStream } = await streamObject({
        model: mistral("mistral-large-latest"),
        system: `You are an expert developer assistant. Always provide structured responses with:
- content: Main explanation in markdown
- files: Array of code blocks with lang (tsx/js/ts/etc), content, and filepath

For files, the content should be the actual code in tsx for email template in tailwind css.
Keep responses practical and well-organized.

Important: Always provide valid JSON structure. If no files are needed, use an empty array.`,
        messages: history,
        schema,
      });

      let lastUpdate: StreamResponse = { content: "", files: [] };
      let updateCount = 0;

      for await (const partialObject of partialObjectStream) {
        if (partialObject) {
          const currentUpdate: StreamResponse = {
            content: partialObject.content || "",
            files: Array.isArray(partialObject.files)
              ? partialObject.files
                  .filter((file) => file && typeof file === "object") // Filter out null/undefined
                  .map((file) => ({
                    lang: file?.lang || "text",
                    content: file?.content || "",
                    filepath: file?.filepath || "Generating...",
                    status: FileStatus.PROCESSING,
                  }))
              : [],
          };

          // Only update if there's meaningful change and not too frequently
          const contentChanged = currentUpdate.content !== lastUpdate.content;
          const filesChanged =
            JSON.stringify(currentUpdate.files) !== JSON.stringify(lastUpdate.files);

          if ((contentChanged || filesChanged) && updateCount % 3 === 0) {
            // Throttle updates
            stream.update(currentUpdate);
            lastUpdate = currentUpdate;
          }
          updateCount++;
        }
      }

      // Final update to ensure we have the complete response
      if (lastUpdate.content || lastUpdate.files.length > 0) {
        stream.update(lastUpdate);
      }
    } catch (error) {
      console.error("Streaming error:", error);

      // Provide a fallback response instead of just erroring
      const errorResponse: StreamResponse = {
        content:
          "I apologize, but I encountered an error while processing your request. Please try again.",
        files: [],
      };

      stream.update(errorResponse);
      stream.error(error);
    } finally {
      stream.done();
    }
  })();

  return {
    newMessage: stream.value,
    streamObject: stream.value,
  };
}

"use client";

import { useEffect } from "react";
import { useTextStream } from "../ui/response-stream";
import { Markdown } from "./markdown";

export function ResponseStreamWithMarkdown({
  textStream,
}: {
  textStream: string | AsyncIterable<string>;
}) {
  const { displayedText, startStreaming } = useTextStream({
    textStream,
    mode: "fade",
    speed: 80,
    characterChunkSize: 9,
    fadeDuration: 1200,
  });

  useEffect(() => {
    startStreaming();
  }, [startStreaming]);

  return (
    <div className="w-full min-w-full">
      <Markdown>{displayedText}</Markdown>
    </div>
  );
}

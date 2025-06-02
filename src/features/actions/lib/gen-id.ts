import { nanoid } from "nanoid";

export const genId = (content: string) => {
  const id = `${content.toLowerCase().slice(0, 20).replaceAll(" ", "-")}-${nanoid()}`;

  return id;
};

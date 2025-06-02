import { cn } from "@/lib/utils";
import MarkdownComponent from "markdown-to-jsx";

export const Markdown = ({ children, className }: { children: string; className?: string }) => {
  const options = {
    overrides: {
      h1: {
        component: ({ children }: { children: React.ReactNode }) => (
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight text-primary/85 [&:not(:first-child)]:mt-6">
            {children}
          </h1>
        ),
      },
      h2: {
        component: ({ children }: { children: React.ReactNode }) => (
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight text-primary/85 first:mt-0 [&:not(:first-child)]:mt-5">
            {children}
          </h2>
        ),
      },
      h3: {
        component: ({ children }: { children: React.ReactNode }) => (
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight text-primary/85 [&:not(:first-child)]:mt-4">
            {children}
          </h3>
        ),
      },
      h4: {
        component: ({ children }: { children: React.ReactNode }) => (
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight text-primary/85 [&:not(:first-child)]:mt-4">
            {children}
          </h4>
        ),
      },
      h5: {
        component: ({ children }: { children: React.ReactNode }) => (
          <h5 className="scroll-m-20 text-[1rem] font-semibold tracking-tight text-primary/85 [&:not(:first-child)]:mt-4">
            {children}
          </h5>
        ),
      },
      h6: {
        component: ({ children }: { children: React.ReactNode }) => (
          <h6 className="scroll-m-20 text-[0.96rem] font-semibold tracking-tight text-primary/85 [&:not(:first-child)]:mt-4">
            {children}
          </h6>
        ),
      },
      p: {
        component: ({ children }: { children: React.ReactNode }) => (
          <p className="text-[0.96rem] leading-7 text-primary/85 last:mb-4 [&:not(:first-child)]:mt-4">
            {children}
          </p>
        ),
      },
      span: {
        component: ({ children }: { children: React.ReactNode }) => (
          <p className="text-[0.96rem] leading-7 text-primary/85 last:mb-4 [&:not(:first-child)]:mt-4">
            {children}
          </p>
        ),
      },
      ul: {
        component: ({ children }: { children: React.ReactNode }) => (
          <ul className="ml-8 list-disc text-[0.96rem] [&>li]:mt-1 [&>li]:text-primary/85">
            {children}
          </ul>
        ),
      },
      ol: {
        component: ({ children }: { children: React.ReactNode }) => (
          <ol className="ml-8 list-decimal text-[0.96rem] text-primary/85 [&>li]:mt-1 [&>li]:text-primary/85">
            {children}
          </ol>
        ),
      },
      li: {
        component: ({ children }: { children: React.ReactNode }) => (
          <li className="text-[0.96rem]">{children}</li>
        ),
      },
      a: {
        component: ({ children, href }: { children: React.ReactNode; href?: string }) => (
          <a
            href={href}
            className="border-spacing-2 border-b border-primary/95 text-[0.96rem] font-normal text-primary/85 transition-colors hover:border-primary hover:text-primary/85"
          >
            {children}
          </a>
        ),
      },
      blockquote: {
        component: ({ children }: { children: React.ReactNode }) => (
          <blockquote className="border-l-2 pl-6 italic [&:not(:first-child)]:my-5">
            {children}
          </blockquote>
        ),
      },
      table: {
        component: ({ children }: { children: React.ReactNode }) => (
          <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-md border border-primary/20">
            {children}
          </table>
        ),
      },
      th: {
        component: ({ children }: { children: React.ReactNode }) => (
          <th className="border-b-[1px] border-primary/20 px-4 py-2 text-left text-[0.96rem] font-semibold text-primary/85">
            {children}
          </th>
        ),
      },
      td: {
        component: ({ children }: { children: React.ReactNode }) => (
          <td className="border-b border-primary/10 px-4 py-2 text-[0.96rem] text-primary/85">
            {children}
          </td>
        ),
      },
      pre: {
        component: ({ children }: { children: React.ReactNode }) => (
          <pre className="overflow-x-auto rounded-lg border-[1px] border-primary/10 bg-primary/5 p-2 py-1.5 text-sm [&:not(:first-child)]:mb-3 [&:not(:first-child)]:mt-2 [&>code]:bg-transparent [&>code]:font-normal">
            {children}
          </pre>
        ),
      },
      code: {
        component: ({ children }: { children: React.ReactNode }) => (
          <code className="relative rounded bg-sidebar-accent px-[0.3rem] py-[0.2rem] text-sm font-semibold">
            {children}
          </code>
        ),
      },
      img: {
        component: ({ src, alt }: { src?: string; alt?: string }) => (
          <img src={src} alt={alt} className="h-auto max-w-full rounded-lg" />
        ),
      },
      hr: {
        component: () => <hr className="border-t border-primary/20 [&:not(:first-child)]:my-4" />,
      },
      strong: {
        component: ({ children }: { children: React.ReactNode }) => (
          <strong className="text-[0.96rem] text-primary/95">{children}</strong>
        ),
      },

      em: {
        component: ({ children }: { children: React.ReactNode }) => (
          <em className="pr-1 text-[1rem] font-light italic text-primary/85">{children}</em>
        ),
      },
    },
  };

  return (
    <div className={cn("message", className)}>
      <MarkdownComponent options={options}>{children}</MarkdownComponent>
    </div>
  );
};

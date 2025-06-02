"use client";

import Link, { LinkProps } from "next/link";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useAuth } from "@/hooks/use-auth";
import { lead } from "@/lib/template-list";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { components } from "../../lib/component";
import AccountDropdown from "./account-dropdown";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();

  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open);
  }, []);

  return (
    <header className="z-50">
      <div className="px-4 sm:px-6">
        <div
          className={cn("mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3")}
        >
          <Link
            href="/"
            aria-label="Home"
            className="flex items-center gap-2 whitespace-nowrap rounded-full outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
          >
            <span className="text-lg font-semibold text-muted-foreground text-zinc-800 dark:text-zinc-200">
              Gena Email
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {session ? (
              <AccountDropdown />
            ) : (
              <Button
                className="flex h-8 items-center justify-center rounded-full px-2 md:px-4"
                asChild
              >
                <Link href="/login" className="flex items-center justify-center">
                  Login
                </Link>
              </Button>
            )}
            <Drawer open={open} onOpenChange={onOpenChange}>
              <DrawerTitle className="sr-only">Navigation</DrawerTitle>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  className="-ml-2 h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="!size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 9h16.5m-16.5 6.75h16.5"
                    />
                  </svg>
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[60svh] p-0">
                <div className="overflow-auto p-6">
                  <div className="flex flex-col space-y-3">
                    <h3 className="text-base font-medium text-primary">Templates</h3>
                    {lead
                      .filter((lead) => lead.live)
                      .map((lead) => (
                        <MobileLink
                          key={lead.name.replaceAll(" ", "-").trim().toLowerCase()}
                          href={lead.name.replaceAll(" ", "-").trim().toLowerCase()}
                          onOpenChange={setOpen}
                          className="text-base font-medium text-muted-foreground"
                        >
                          {lead.name}
                        </MobileLink>
                      ))}
                  </div>
                  <div className="my-6" />
                  <div className="flex flex-col space-y-3">
                    <h3 className="text-base font-medium text-primary">Components</h3>
                    {components
                      .sort((a, b) => a.label.localeCompare(b.label))
                      .filter((lead) => lead.live)
                      .map((lead) => (
                        <MobileLink
                          key={lead.label.replaceAll(" ", "-").trim().toLowerCase()}
                          href={`/docs/component/${lead.label.replaceAll(" ", "-").trim().toLowerCase()}`}
                          onOpenChange={setOpen}
                          className="text-base font-medium text-muted-foreground"
                        >
                          {lead.label}
                        </MobileLink>
                      ))}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn("text-base", className)}
      {...props}
    >
      {children}
    </Link>
  );
}

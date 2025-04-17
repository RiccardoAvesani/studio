
import React from "react";
import { MainNav } from "@/components/main-nav";

interface SiteHeaderProps extends React.HTMLAttributes<HTMLElement> {}

export function SiteHeader({ className, ...props }: SiteHeaderProps) {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav className="mx-auto" items={[
            {
                href: "/call",
                title: "Call API",
            },
            {
                href: "/config",
                title: "Configuration",
            },
        ]} />
      </div>
    </header>
  );
}

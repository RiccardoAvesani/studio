
import * as React from "react"
import Link from "next/link"

import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import {Language} from "@/types";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: {
    href: string
    title: string
  }[]
}

export function MainNav({ className, items, ...props }: MainNavProps) {
  return (
    <div className={cn("flex h-14 items-center", className)} {...props}>
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.gear className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          Moodle API Explorer
        </span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item, index) =>
              item.href ? (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-foreground sm:text-base",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              ) : null
          )}
        </nav>
      ) : null}
    </div>
  )
}

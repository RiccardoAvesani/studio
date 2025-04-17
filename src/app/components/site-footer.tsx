
import React from "react";

interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {}

export function SiteFooter({ className, ...props }: SiteFooterProps) {
    return (
        <footer className="bg-background py-4 text-center">
            <div className="container">
                <p className="text-sm text-muted-foreground">
                    {new Date().getFullYear()} &copy; Moodle API Explorer. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

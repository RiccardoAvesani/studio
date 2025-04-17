
import React from "react";
import {SiteHeader} from "@/app/components/site-header";
import {SiteFooter} from "@/app/components/site-footer";

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({children}: LayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            <SiteHeader/>
            <main className="flex-1">
                {children}
            </main>
            <SiteFooter/>
        </div>
    );
}

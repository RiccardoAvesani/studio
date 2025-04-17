
import React from "react";
import {Layout} from "@/app/components/layout";

interface ConfigLayoutProps {
    children: React.ReactNode;
}

export default function ConfigLayout({children}: ConfigLayoutProps) {
    return (
        <Layout>
            {children}
        </Layout>
    );
}

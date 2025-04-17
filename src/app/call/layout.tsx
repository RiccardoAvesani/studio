
import React from "react";
import {Layout} from "@/app/components/layout";

interface CallLayoutProps {
    children: React.ReactNode;
}

export default function CallLayout({children}: CallLayoutProps) {
    return (
        <Layout>
            {children}
        </Layout>
    );
}

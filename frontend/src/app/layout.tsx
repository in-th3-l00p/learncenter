import "./globals.css";
import "../locales/i18n";
import {Inter} from "next/font/google";
import {Metadata} from "next";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "LearnCenter",
    description: "LearnCenter Web Application, designed for handling educational institutions online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={"h-full min-h-screen"}>
            <body className={inter.className + " bg-zinc-100"}>
                {children}
            </body>
        </html>
    );
}
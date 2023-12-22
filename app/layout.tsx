import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme/theme-provider";
import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'TrackIt - A Todo Tracker',
    description: 'A collaborative todo tracker written with Next.JS',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Nav/>
            {children}
            <Toaster/>
        </ThemeProvider>
        </body>
        </html>
    )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme/theme-provider";
import Nav from "@/components/Nav";

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
    <body className={`${inter.className} p-10`}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Nav/>
      {children}
    </ThemeProvider>
    </body>
    </html>
  )
}

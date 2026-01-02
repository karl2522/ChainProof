import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import type React from "react"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
    title: "ChainProof | Decentralized File Verification",
    description: "Verify file authenticity on the blockchain with ChainProof.",
    generator: "v0.app",
    icons: {
        icon: [
            {
                url: "/logo.svg",
                media: "(prefers-color-scheme: light)",
            },
            {
                url: "/logo.svg",
                media: "(prefers-color-scheme: dark)",
            },
            {
                url: "/logo.svg",
                type: "image/svg+xml",
            },
        ],
        apple: "/logo.svg",
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${_geist.variable} ${_geistMono.variable} font-sans antialiased bg-background text-foreground`}>
                {children}
                <Analytics />
            </body>
        </html>
    )
}

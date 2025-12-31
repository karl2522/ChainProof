"use client"

import { Navbar } from "@/components/navbar"
import { FileActionCard } from "@/components/file-action-card"
import { HistoryTable } from "@/components/history-table"
import { Badge } from "@/components/ui/badge"

export default function ChainProof() {
  const handleUpload = async (file: File) => {
    // Simulated blockchain interaction
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return {
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      tx: "0x7d3e2f1a9c8b5d4e3f2a1c0b9a8f7e6d5c4b3a210fedcba9876543210abcdef",
    }
  }

  const handleVerify = async (file: File) => {
    // Simulated verification
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const isMatch = Math.random() > 0.3
    return {
      match: isMatch,
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    }
  }

  return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Subtle Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />

        <Navbar />

        <main className="flex-1 flex flex-col items-center px-6 py-4 lg:py-8 max-w-7xl mx-auto w-full z-10">
          {/* Hero Section */}
          <div className="text-center space-y-3 mb-6 lg:mb-10">
            <Badge
                variant="outline"
                className="font-mono border-primary/30 text-primary py-0.5 px-3 text-[10px] tracking-widest uppercase"
            >
              Developed by Jared Omen
            </Badge>
            <h1 className="text-clamp-h1 font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/60 leading-tight">
              ChainProof
            </h1>
            <p className="text-clamp-p text-muted-foreground max-w-2xl mx-auto leading-normal">
              Immutable file integrity powered by distributed ledgers.
              <span className="text-foreground"> Anchor</span>, <span className="text-foreground">Verify</span>, and{" "}
              <span className="text-foreground">Trust</span> your documents with cryptographic certainty.
            </p>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-10 lg:mb-16">
            <FileActionCard type="upload" onAction={handleUpload} />
            <FileActionCard type="verify" onAction={handleVerify} />
          </div>

          {/* History Section */}
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-mono font-bold">Recent Anchors</h2>
              <div className="h-px bg-border/40 flex-1 mx-6 hidden sm:block" />
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Public Ledger View</p>
            </div>
            <HistoryTable />
          </div>
        </main>

        <footer className="p-8 text-center text-muted-foreground text-xs font-mono border-t border-border/20">
          © 2025 ChainProof Protocol • Built for the decentralized web
        </footer>
      </div>
  )
}

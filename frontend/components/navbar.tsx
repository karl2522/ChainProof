"use client"

import { DisconnectDialog } from "@/components/disconnect-dialog"
import { Button } from "@/components/ui/button"
import { formatAddress } from "@/lib/blockchain"
import { useWallet } from "@/lib/wallet-context"
import { Wallet } from "lucide-react"

export function Navbar() {
    const { walletAddress, isConnecting, connect, disconnect, isConnected } = useWallet()

    return (
        <nav className="flex items-center justify-between p-4 px-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="ChainProof Logo" className="w-8 h-8 hover:scale-110 transition-transform duration-200" />
                <span className="text-xl font-bold tracking-tight font-mono">ChainProof</span>
            </div>

            {isConnected && walletAddress ? (
                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-mono">{formatAddress(walletAddress)}</span>
                    </div>
                    <DisconnectDialog onConfirm={disconnect} />
                </div>
            ) : (
                <Button
                    onClick={connect}
                    disabled={isConnecting}
                    variant="outline"
                    className="gap-2 font-mono border-primary/20 hover:bg-primary/10 bg-transparent cursor-pointer hover:border-primary/40 transition-all"
                >
                    <Wallet className="w-4 h-4" />
                    <span className="hidden sm:inline">
                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                    </span>
                </Button>
            )}
        </nav>
    )
}


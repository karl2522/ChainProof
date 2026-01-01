"use client"

import { Button } from "@/components/ui/button"
import { connectWallet, formatAddress, getConnectedWallet } from "@/lib/blockchain"
import { LogOut, Wallet } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function Navbar() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    const [isConnecting, setIsConnecting] = useState(false)

    // Check if wallet is already connected on mount
    useEffect(() => {
        checkWalletConnection()

        // Listen for account changes
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', handleAccountsChanged)
            window.ethereum.on('chainChanged', () => window.location.reload())
        }

        return () => {
            if (typeof window.ethereum !== 'undefined') {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
            }
        }
    }, [])

    const checkWalletConnection = async () => {
        const address = await getConnectedWallet()
        setWalletAddress(address)
    }

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
            setWalletAddress(null)
        } else {
            setWalletAddress(accounts[0])
        }
    }

    const handleConnect = async () => {
        setIsConnecting(true)
        try {
            const address = await connectWallet()
            setWalletAddress(address)
            toast.success('Wallet connected successfully!')
        } catch (error: any) {
            console.error('Connection error:', error)
            toast.error(error.message || 'Failed to connect wallet')
        } finally {
            setIsConnecting(false)
        }
    }

    const handleDisconnect = () => {
        setWalletAddress(null)
        toast.info('Wallet disconnected')
    }

    return (
        <nav className="flex items-center justify-between p-4 px-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg rotate-12 flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xl leading-none">C</span>
                </div>
                <span className="text-xl font-bold tracking-tight font-mono">ChainProof</span>
            </div>

            {walletAddress ? (
                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-mono">{formatAddress(walletAddress)}</span>
                    </div>
                    <Button
                        onClick={handleDisconnect}
                        variant="outline"
                        size="sm"
                        className="gap-2 font-mono border-destructive/20 hover:bg-destructive/10 bg-transparent cursor-pointer hover:border-destructive/40 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Disconnect</span>
                    </Button>
                </div>
            ) : (
                <Button
                    onClick={handleConnect}
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


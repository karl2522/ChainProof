"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { connectWallet, getConnectedWallet } from "./blockchain"

interface WalletContextType {
    walletAddress: string | null
    isConnecting: boolean
    connect: () => Promise<void>
    disconnect: () => void
    isConnected: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    const [isConnecting, setIsConnecting] = useState(false)

    useEffect(() => {
        checkConnection()

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

    const checkConnection = async () => {
        // Respect explicit disconnect
        if (localStorage.getItem('walletConnected') !== 'true') return

        const address = await getConnectedWallet()
        if (address) {
            setWalletAddress(address)
        } else {
            localStorage.removeItem('walletConnected')
        }
    }

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
            disconnect()
        } else {
            setWalletAddress(accounts[0])
            localStorage.setItem('walletConnected', 'true')
        }
    }

    const connect = async () => {
        setIsConnecting(true)
        try {
            const address = await connectWallet()
            setWalletAddress(address)
            localStorage.setItem('walletConnected', 'true')
            toast.success('Wallet connected successfully!')
        } catch (error: any) {
            console.error('Connection error:', error)
            toast.error(error.message || 'Failed to connect wallet')
        } finally {
            setIsConnecting(false)
        }
    }

    const disconnect = () => {
        setWalletAddress(null)
        localStorage.removeItem('walletConnected')
        toast.info('Wallet disconnected')
    }

    return (
        <WalletContext.Provider
            value={{
                walletAddress,
                isConnecting,
                connect,
                disconnect,
                isConnected: !!walletAddress
            }}
        >
            {children}
        </WalletContext.Provider>
    )
}

export function useWallet() {
    const context = useContext(WalletContext)
    if (context === undefined) {
        throw new Error("useWallet must be used within a WalletProvider")
    }
    return context
}

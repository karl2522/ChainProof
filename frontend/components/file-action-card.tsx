"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { logUpload, verifyHash } from "@/lib/api"
import { submitHashToBlockchain } from "@/lib/blockchain"
import { computeFileHash } from "@/lib/crypto"
import { cn } from "@/lib/utils"
import { CheckCircle2, ExternalLink, FileText, Loader2, ShieldCheck, Upload, XCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { useWallet } from "@/lib/wallet-context"

interface FileActionCardProps {
    type: "upload" | "verify"
}

export function FileActionCard({ type }: FileActionCardProps) {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const { isConnected, connect } = useWallet()
    const isUpload = type === "upload"
    // Disable interaction if uploading and not connected
    const isDisabled = isUpload && !isConnected

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setResult(null)
        }
    }

    const handleSubmit = async () => {
        if (!file) return

        // Wallet check is now partly handled by disabled state, but good to keep double check
        if (isUpload && !isConnected) {
            toast.error("Wallet Not Connected", {
                description: "Please connect your MetaMask wallet using the button in the top right corner."
            })
            // Optionally try to connect?
            connect()
            return
        }

        setLoading(true)
        try {
            if (type === "upload") {
                // Upload flow: hash → blockchain → backend
                const hash = await computeFileHash(file)

                // Check if already exists to prevent unnecessary gas fees
                try {
                    const existingRecord = await verifyHash(hash)
                    if (existingRecord) {
                        toast.warning("File Already Registered", {
                            description: "This file has already been anchored on the blockchain.",
                            action: {
                                label: "View TX",
                                onClick: () => window.open(`https://sepolia.etherscan.io/tx/${existingRecord.transactionHash}`, '_blank')
                            }
                        })

                        setResult({
                            hash,
                            tx: existingRecord.transactionHash,
                            isExisting: true,
                        })
                        setLoading(false)
                        return
                    }
                } catch (err) {
                    // Ignore check errors, proceed to upload
                    console.warn("Pre-check verification failed, proceeding with upload:", err)
                }

                toast.info("Submitting to blockchain...", {
                    description: "Please confirm the transaction in your wallet."
                })

                const txHash = await submitHashToBlockchain(hash)
                toast.success("Transaction confirmed!", {
                    description: "Your file hash has been securely anchored."
                })

                // Log to backend
                await logUpload(file.name, hash, txHash)

                // Dispatch event to refresh history table
                window.dispatchEvent(new Event('refresh-history'))

                setResult({
                    hash,
                    tx: txHash,
                    isExisting: false,
                })
            } else {
                // Verify flow: hash → check backend
                const hash = await computeFileHash(file)
                const record = await verifyHash(hash)

                if (record) {
                    setResult({
                        match: true,
                        hash,
                        tx: record.transactionHash,
                        fileName: record.fileName,
                    })
                    toast.success("File verified successfully!")
                } else {
                    setResult({
                        match: false,
                        hash,
                    })
                    toast.error("File not found in blockchain records")
                }
            }
        } catch (error: any) {
            console.error("Action error:", error)

            if (error.message?.includes("already exists")) {
                toast.error("Duplicate Entry", {
                    description: "This file or transaction hash has already been registered."
                })
            } else if (error.message?.includes("rejected by user") || error.code === "ACTION_REJECTED") {
                toast.error("Transaction Rejected", {
                    description: "You rejected the transaction in your wallet."
                })
            } else {
                toast.error("Operation Failed", {
                    description: error.message || "An unexpected error occurred."
                })
            }
            setResult(null)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30">
            <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    {isUpload ? <Upload className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                </div>
                <CardTitle className="text-2xl font-mono">{isUpload ? "Upload & Store" : "Verify Integrity"}</CardTitle>
                <CardDescription className="text-muted-foreground">
                    {isUpload
                        ? "Securely anchor your file hash to the blockchain."
                        : "Check if a file matches its blockchain record."}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative group">
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id={`file-input-${type}`}
                        disabled={isDisabled}
                    />
                    <label
                        htmlFor={`file-input-${type}`}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all",
                            isDisabled
                                ? "cursor-not-allowed opacity-50 border-muted"
                                : "cursor-pointer border-border/60 hover:border-primary/40 hover:bg-muted/50",
                            file && !isDisabled ? "border-primary/50 bg-primary/5" : ""
                        )}
                        onClick={(e) => {
                            if (isDisabled) {
                                e.preventDefault()
                                toast.error("Connect wallet to upload files")
                                connect() // Prompt connection on click
                            }
                        }}
                    >
                        {file ? (
                            <div className="flex items-center gap-2 text-primary">
                                <FileText className="w-5 h-5" />
                                <span className="font-medium max-w-[200px] truncate">{file.name}</span>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    {isDisabled ? "Connect wallet to upload" : "Click to select file"}
                                </span>
                            </>
                        )}
                    </label>
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={(!file && !isDisabled) || loading || (isUpload && !isConnected)}
                    className="w-full font-mono py-6 text-lg cursor-pointer"
                    variant={isUpload ? "default" : "secondary"}
                >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isUpload ? (isConnected ? "Upload to Blockchain" : "Connect Wallet to Upload") : "Verify File"}
                </Button>
                {isUpload && !isConnected && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                        * Requires wallet connection for blockchain transaction
                    </p>
                )}

                {result && (
                    <div
                        className={cn(
                            "p-4 rounded-lg border animate-in fade-in slide-in-from-top-2 duration-300",
                            isUpload
                                ? "bg-primary/5 border-primary/20"
                                : result.match
                                    ? "bg-primary/5 border-primary/20"
                                    : "bg-destructive/5 border-destructive/20",
                        )}
                    >
                        <div className="flex items-start gap-3">
                            {isUpload ? (
                                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                            ) : result.match ? (
                                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                            ) : (
                                <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                            )}
                            <div className="flex-1 space-y-2 overflow-hidden">
                                <p className="font-bold text-sm">
                                    {isUpload
                                        ? result.isExisting
                                            ? "File Previously Anchored"
                                            : "Successfully Anchored"
                                        : result.match
                                            ? "Verified Authenticity"
                                            : "Integrity Mismatch"}
                                </p>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">SHA-256 Hash</p>
                                    <p className="text-xs font-mono break-all text-foreground/80">{result.hash}</p>
                                </div>
                                {isUpload && (
                                    <div className="space-y-1 pt-1">
                                        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Transaction</p>
                                        <a
                                            href={`https://sepolia.etherscan.io/tx/${result.tx}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs font-mono text-primary hover:underline"
                                        >
                                            {result.tx.slice(0, 24)}... <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

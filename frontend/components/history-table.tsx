"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchHistory, UploadRecord } from "@/lib/api"
import { AlertCircle, Clock, FileText, Hash, Loader2, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"

export function HistoryTable() {
    const [history, setHistory] = useState<UploadRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadHistory = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchHistory()
            setHistory(data)
        } catch (error: any) {
            console.error("Failed to load history:", error)
            setError("Could not connect to the history server. Please ensure the backend is running.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadHistory()

        // specific event listener for refreshing history
        const handleRefresh = () => loadHistory()
        window.addEventListener('refresh-history', handleRefresh)

        return () => window.removeEventListener('refresh-history', handleRefresh)
    }, [])

    if (loading && history.length === 0) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 border border-dashed border-destructive/30 rounded-xl bg-destructive/5">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <div className="space-y-1">
                    <p className="font-medium text-destructive">Connection Failed</p>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        {error}
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadHistory} className="mt-2">
                    <RefreshCw className="w-3 h-3 mr-2" />
                    Retry Connection
                </Button>
            </div>
        )
    }

    if (history.length === 0) {
        return (
            <div className="text-center p-8 text-muted-foreground text-sm border border-dashed border-border/60 rounded-xl">
                No files anchored yet.
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="font-mono text-xs uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <FileText className="w-3 h-3" /> File Name
                            </div>
                        </TableHead>
                        <TableHead className="font-mono text-xs uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <Hash className="w-3 h-3" /> Hash
                            </div>
                        </TableHead>
                        <TableHead className="font-mono text-xs uppercase tracking-wider text-right">
                            <div className="flex items-center justify-end gap-2">
                                <Clock className="w-3 h-3" /> Timestamp
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {history.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30 border-border/40 transition-colors">
                            <TableCell className="font-medium text-sm">{item.fileName}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground max-w-[120px]" title={item.fileHash}>
                                <div className="flex items-center hover:text-foreground transition-colors cursor-help">
                                    <span className="truncate">{item.fileHash}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground">
                                {new Date(item.createdAt).toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

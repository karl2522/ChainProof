import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchHistory, UploadRecord } from "@/lib/api"
import { Clock, FileText, Hash, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export function HistoryTable() {
    const [history, setHistory] = useState<UploadRecord[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await fetchHistory()
                setHistory(data)
            } catch (error) {
                console.error("Failed to load history:", error)
            } finally {
                setLoading(false)
            }
        }

        loadHistory()

        // specific event listener for refreshing history
        const handleRefresh = () => loadHistory()
        window.addEventListener('refresh-history', handleRefresh)

        return () => window.removeEventListener('refresh-history', handleRefresh)
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (history.length === 0) {
        return (
            <div className="text-center p-8 text-muted-foreground text-sm">
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
                        <TableRow key={item.id} className="hover:bg-muted/30 border-border/40">
                            <TableCell className="font-medium text-sm">{item.fileName}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[120px]" title={item.fileHash}>
                                {item.fileHash.slice(0, 10)}...{item.fileHash.slice(-8)}
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

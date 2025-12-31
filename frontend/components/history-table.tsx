import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Clock, Hash } from "lucide-react"

const HISTORY_DATA = [
    { name: "contract_v1.pdf", hash: "8f7e...2a4b", date: "2024-05-12 14:22" },
    { name: "whitepaper.docx", hash: "4c1d...9e3f", date: "2024-05-11 09:45" },
    { name: "identity_proof.jpg", hash: "a2b3...f6e0", date: "2024-05-10 18:12" },
]

export function HistoryTable() {
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
                    {HISTORY_DATA.map((item, i) => (
                        <TableRow key={i} className="hover:bg-muted/30 border-border/40">
                            <TableCell className="font-medium text-sm">{item.name}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">{item.hash}</TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground">{item.date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

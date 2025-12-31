import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function Navbar() {
    return (
        <nav className="flex items-center justify-between p-4 px-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg rotate-12 flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xl leading-none">C</span>
                </div>
                <span className="text-xl font-bold tracking-tight font-mono">ChainProof</span>
            </div>
            <Button variant="outline" className="gap-2 font-mono border-primary/20 hover:bg-primary/10 bg-transparent cursor-pointer hover:border-primary/40 transition-all">
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">Connect Wallet</span>
            </Button>
        </nav>
    )
}

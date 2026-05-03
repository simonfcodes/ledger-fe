import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getInitials, getInitialsColor, formatBalance} from "@/lib/accountUtils"
import type { AccountView } from "@/types/account"

interface AccountRowProps {
    account: AccountView    
}


const AccountRow: React.FC<AccountRowProps> = ({ account }) => {
    const isCreditCard = account.type === "CREDIT_CARD"
    const isNegative = account.currentBalance < 0
    return (
        <div className={`flex items-center px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors ${!account.active ? "opacity-40" : ""}`}>
            {/* Institution initials square */}
            <div className={`w-10 h-10 rounded-md flex items-center justify-center text-white text-sm font-medium shrink-0 mr-3 ${getInitialsColor(account.name)}`}>
                {getInitials(account.name)}
            </div>
            {/* Name + subtitle */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{account.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {account.type.replace("_", " ").charAt(0) +
                        account.type.replace("_", " ").slice(1).toLowerCase()}{" "} · {account.currencyCode}
                </p>
            </div>

            {/* Balance */}
            <p className={`text-sm font-medium mr-4 ${isCreditCard || isNegative ? "text-destructive" : ""}`}>
                {formatBalance(account.currentBalance, account.currencyCode)}
            </p>

            {/* Actions menu (placeholder — we'll wire up DropdownMenu later) */}
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </div>
    )
}

export default AccountRow
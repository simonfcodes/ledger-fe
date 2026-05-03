import FormAlert from "@/components/FormAlert"
import { Spinner } from "@/components/ui/spinner"
import { useAccounts } from "@/hooks/useAccounts"
import { getErrorMessage } from "@/lib/errorUtils"
import { Button } from "@/components/ui/button"
import { useMemo } from "react"
import { formatBalance } from "@/lib/accountUtils"
import { Plus } from "lucide-react"
import type { AccountView } from "@/types/account"
import AccountRow from "@/components/accounts/AccountRow"

const sortAccounts = (accounts: AccountView[]): AccountView[] => {
    return [...accounts].sort((a, b) => {
        if (a.active && !b.active) return -1
        if (!a.active && b.active) return 1
        return a.displayOrder - b.displayOrder
    })
}

const Accounts: React.FC = () => {
    const { data: accounts, isLoading, error } = useAccounts()
    
    const { totalBalance, activeCount } = useMemo(() => {
        if (!accounts) return { totalBalance: 0, activeCount: 0 }
        const active = accounts.filter(a => a.active)
        return {
            totalBalance: active.reduce((sum, account) => sum + account.currentBalance, 0),
            activeCount: active.length
        }
    }, [accounts])

    const sortedList = useMemo(() => {
        if (!accounts) return []
        return sortAccounts(accounts)
    }, [accounts])
        
    if (isLoading) {
        return ( 
            <main className="flex items-center justify-center h-screen">
            <Spinner className="size-20" />
            </main> 
        )
    }
    
    if (error) {
        return ( 
            <main className="flex items-center justify-center h-screen">
                <FormAlert title="Error loading accounts" description={`An error occurred while fetching your accounts: ${getErrorMessage(error)}`} type="error" />
            </main> 
        )
    }
    
    return (
        <main className="p-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold">Accounts</h1>
                <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Add account
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-lg bg-muted p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total balance</p>
                    <p className="text-2xl font-semibold">
                        {formatBalance(totalBalance, "GBP")}
                    </p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                    <p className="text-xs text-muted-foreground mb-1">Active accounts</p>
                    <p className="text-2xl font-semibold">{activeCount}</p>
                </div>
            </div>
            <div className="rounded-lg border bg-card">
                {sortedList && sortedList.length > 0 ? (
                    sortedList.map(account => (
                        <AccountRow key={account.id} account={account} />
                    ))
                ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        No accounts found. Add your first account to get started.
                    </div>
                )}
            </div>
        </main>
    )
}

export default Accounts
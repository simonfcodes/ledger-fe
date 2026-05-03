import { listAccounts } from "@/services/accountService"
import { useQuery } from "@tanstack/react-query"

export const useAccounts = () => {
    return useQuery({
        queryKey: ["accounts"],
        queryFn: listAccounts
    })
}
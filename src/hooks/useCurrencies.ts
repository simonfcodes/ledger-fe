import { getCurrencies } from "@/services/currencyService";
import { useQuery } from "@tanstack/react-query";

export const useCurrencies = () => {
    return useQuery({
        queryKey: ["currencies"],
        queryFn: getCurrencies
    })
}
import { getErrorMessage } from "@/lib/errorUtils"
import api from "@/services/api"
import type { Currency } from "@/types/currency"
import type { AxiosResponse } from "axios"

export const getCurrencies = async (): Promise<Currency[]> => {
    try {
        const response: AxiosResponse<Currency[]> = await api.get("/currencies")
        return response.data
    } catch (error) {
        console.error("Failed to fetch currencies:", getErrorMessage(error))
        throw new Error(getErrorMessage(error), { cause: error })
    }
}
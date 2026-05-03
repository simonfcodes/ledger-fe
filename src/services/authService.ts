import type { RegisterResponse } from "@/types/auth"
import api from "@/services/api"
import type { AxiosResponse } from "axios"
import { getErrorMessage } from "@/lib/errorUtils"

export const registerUser = async (email: string, password: string): Promise<RegisterResponse> => {
    try {
        const response: AxiosResponse<RegisterResponse> = await api.post("/users/register", { email, password })
        return response.data
    } catch (error) {
        console.error("Registration failed:", getErrorMessage(error))
        throw new Error(getErrorMessage(error), { cause: error })
    }
}
import type { RegisterResponse } from "@/types/auth"
import api from "@/services/api"
import type { AxiosResponse } from "axios"

export const registerUser = async (email: string, password: string): Promise<RegisterResponse> => {
    try {
        const response: AxiosResponse<RegisterResponse> = await api.post("/auth/register", { email, password })
        return response.data
    } catch (error) {
        console.error("Registration failed:", error)
        throw error
    }
}
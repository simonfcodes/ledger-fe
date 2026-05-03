import type { ProfileRequest, UserProfileView } from "@/types/profile"
import api from "@/services/api"
import axios from "axios"
import type { AxiosResponse } from "axios"
import { getErrorMessage } from "@/lib/errorUtils"


export const createProfile = async (profileData: ProfileRequest): Promise<UserProfileView> => {
    try {
        const response: AxiosResponse<UserProfileView> = await api.post("/profile", profileData)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error details:", {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                } : null,
                request: error.request ? {
                    method: error.request.method,
                    url: error.request.url,
                    headers: error.request.headers,
                    data: error.request.data
                } : null
            })
        }

        console.error("Profile creation failed:", getErrorMessage(error))
        throw new Error(getErrorMessage(error), { cause: error})
    }
}
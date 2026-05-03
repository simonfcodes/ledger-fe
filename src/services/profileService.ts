import type { ProfileRequest, UserProfileView } from "@/types/profile"
import api from "@/services/api"
import type { AxiosResponse } from "axios"
import { getErrorMessage } from "@/lib/errorUtils"


export const createProfile = async (profileData: ProfileRequest): Promise<UserProfileView> => {
    try {
        const response: AxiosResponse<UserProfileView> = await api.post("/profile", profileData)
        return response.data
    } catch (error) {
        console.error("Profile creation failed:", getErrorMessage(error))
        throw new Error(getErrorMessage(error), { cause: error})
    }
}
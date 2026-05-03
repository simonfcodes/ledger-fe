import type { LoginResponse } from "@/types/auth"
import axios, { AxiosError, type AxiosResponse } from "axios"

let token: string | null = null

const EXCLUDED_ENDPOINTS: string[] = ['/auth']

let refreshPromise: Promise<void> | null = null

export const setAuthToken = (newToken: string | null) => {
    token = newToken
}


const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

export const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})

instance.interceptors.request.use(config => {
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

instance.interceptors.response.use(response => response, error => {

    if (error.response && error.response.status === 401 && !isExcludedEndpoint(error.config.url)) {
        return unauthorizedAccess(error)
    }
    return Promise.reject(error)
})

const isExcludedEndpoint = (url: string): boolean => {
    return EXCLUDED_ENDPOINTS.some(endpoint => url.includes(endpoint))
}

const unauthorizedAccess = async (error: AxiosError) => {
    try {
        if (!refreshPromise) {
            refreshPromise = doRefresh().finally(() => {
                refreshPromise = null
            })
            await refreshPromise
        } else {
            await refreshPromise            
        }
        error.config!.headers.Authorization = `Bearer ${token}`
        return instance(error.config!)
    } catch (error) {
        console.error('Token refresh failed:', error)            
        window.location.href = '/login'
        return Promise.reject(error)
    }
}

const doRefresh = async (): Promise<void> => {
    try {
        const response: AxiosResponse<LoginResponse> = await refreshApi.post("/auth/refresh")
        const newToken = response.data.access_token
        setAuthToken(newToken)
        if (onTokenRefreshed) {
            onTokenRefreshed(newToken)
        }
    } catch (error) {
        console.error('Token refresh failed:', error)
        throw error
    }
    
}

let onTokenRefreshed: ((token: string) => void) | null = null

export const setOnTokenRefreshed = (callback: ((token: string) => void) | null) => {
    onTokenRefreshed = callback
}   

export default instance;
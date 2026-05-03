import { createContext, useState, useEffect } from "react";
import api, { refreshApi, setOnTokenRefreshed } from "@/services/api"
import { setAuthToken } from "@/services/api";
import type { AxiosResponse } from "axios";
import type { LoginResponse, LoginResult } from "@/types/auth";
import axios from "axios";


interface AuthContextType {
    accessToken: string | null
    mfaToken: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<LoginResult>
    verifyMfa: (code: string, trustDevice: boolean) => Promise<LoginResult>
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    mfaToken: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => ({ status: "success" }),
    verifyMfa: async () => ({ status: "success" }),
    logout: () => {}
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [mfaToken, setMfaToken] = useState<string | null>(null)
    const isAuthenticated = !!accessToken
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
            setOnTokenRefreshed((newToken: string) => {
                setAccessToken(newToken)
        })
        return () => setOnTokenRefreshed(null) // cleanup
    }, [])

    useEffect(() => {
        const tryRefresh = async () => {
            try {
                const response: AxiosResponse<LoginResponse> = await refreshApi.post("/auth/refresh")
                setAccessToken(response.data.access_token)
            } catch (error) {
                console.error("Token refresh failed:", error)
            } finally {
                setIsLoading(false)
            }
        }
        tryRefresh()
    }, [])

    const login = async (email: string, password: string): Promise<LoginResult> => {
        try {
            const response: AxiosResponse<LoginResponse> = await api.post("/auth/login", { email, password })            
            setAccessToken(response.data.access_token)
            return { status: "success" }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 403 && error.response.data?.error === "mfa_required") {
                const mfaSetupRequired = error.response.data?.mfa_setup_required || false
                setMfaToken(error.response.data?.mfa_token || null)
                return { status: "mfa_required", mfa_setup_required: mfaSetupRequired }
            }
            console.error("Login failed:", error)
            throw error
        }
    }

    const verifyMfa = async (code: string, trustDevice: boolean): Promise<LoginResult> => {
        if (!mfaToken) {
            throw new Error("MFA token is missing")
        }
        try {
            const response: AxiosResponse<LoginResponse> = await api.post(
                "/auth/mfa/verify",
                { mfa_token: mfaToken, otp: code, trust_device: trustDevice }
            )
            setAccessToken(response.data.access_token)
            setMfaToken(null)
            return { status: "success" }
        } catch (error) {
            console.error("MFA verification failed:", error)
            throw error
        }
    }

    const logout = async (): Promise<void> => {
        await api.post("/auth/logout")
        setAccessToken(null)
        setMfaToken(null)
    }

    useEffect(() => {
        setAuthToken(accessToken)
    }, [accessToken])

    console.log("AuthProvider render:", { accessToken, mfaToken, isAuthenticated, isLoading })
    return (
        <AuthContext.Provider value={{ accessToken, mfaToken, isAuthenticated, isLoading, login, verifyMfa, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider };
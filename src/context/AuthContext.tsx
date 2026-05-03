import { createContext, useState, useEffect } from "react";
import api from "@/services/api"
import { setAuthToken } from "@/services/api";
import type { AxiosResponse } from "axios";
import type { LoginResponse, LoginResult } from "@/types/auth";
import axios from "axios";


interface AuthContextType {
    accessToken: string | null
    mfaToken: string | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<LoginResult>
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    mfaToken: null,
    isAuthenticated: false,
    login: async () => ({ status: "success" }),
    logout: () => {}
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [mfaToken, setMfaToken] = useState<string | null>(null)
    const isAuthenticated = !!accessToken

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

    const logout = (): void => {
        setAccessToken(null)
        setMfaToken(null)
    }

    useEffect(() => {
        setAuthToken(accessToken)
    }, [accessToken])

    return (
        <AuthContext.Provider value={{ accessToken, mfaToken, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider };
import type { AxiosResponse } from "axios"
import api from "./api"
import type { AccountView, CreateAccountRequest, UpdateAccountRequest } from "@/types/account"
import { getErrorMessage } from "@/lib/errorUtils"
import type { UUID } from "@/types/common"

export const listAccounts = async (): Promise<AccountView[]> => {
    try {
        const response: AxiosResponse<AccountView[]> = await api.get("/accounts")
        return response.data
    } catch (error) {
        console.error("Error fetching accounts:", error)
        throw new Error("Failed to fetch accounts" + getErrorMessage(error), { cause: error })
    }
}

export const getAccount = async (accountId: UUID): Promise<AccountView> => {
    try {
        const response: AxiosResponse<AccountView> = await api.get(`/accounts/${accountId}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching account with ID ${accountId}:`, error)
        throw new Error("Failed to fetch account" + getErrorMessage(error), { cause: error })
    }
}

export const createAccount = async (data: CreateAccountRequest): Promise<AccountView> => {
    try {
        const response: AxiosResponse<AccountView> = await api.post("/accounts", data)
        return response.data
    } catch (error) {
        console.error("Error creating account:", error)
        throw new Error("Failed to create account" + getErrorMessage(error), { cause: error })
    }
}

export const updateAccount = async (accountId: UUID, data: UpdateAccountRequest): Promise<AccountView> => {
    try {
        const response: AxiosResponse<AccountView> = await api.put(`/accounts/${accountId}`, data)
        return response.data
    } catch (error) {
        console.error(`Error updating account with ID ${accountId}:`, error)
        throw new Error("Failed to update account" + getErrorMessage(error), { cause: error })
    }
}

export const deleteAccount = async (accountId: UUID): Promise<void> => {
    try {
        await api.delete(`/accounts/${accountId}`)
    } catch (error) {
        console.error(`Error deleting account with ID ${accountId}:`, error)
        throw new Error("Failed to delete account" + getErrorMessage(error), { cause: error })
    }
}
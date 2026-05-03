import type { DateFormat, NumberFormat, UUID } from "./common"

export interface ProfileRequest {
    displayName: string
    baseCurrencyCode: string
    timezone: string
    dateFormat: DateFormat
    numberFormat: NumberFormat
}

export interface UserProfileView {
    id: UUID
    displayName: string
    baseCurrencyCode: string
    timezone: string
    dateFormat: DateFormat
    numberFormat: NumberFormat
    createdAt: string
    updatedAt: string
}
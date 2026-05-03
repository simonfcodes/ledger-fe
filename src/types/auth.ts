interface LoginResponse {
    access_token: string
    token_type: string
    expires_in: number
}

interface MfaChallengeResponse {
    error: string
    mfa_token: string
    mfa_setup_required: boolean
}

interface MfaConfirmResponse {
    backup_codes: string[]
    access_token: string
    token_type: string
    expires_in: number
}

type LoginResult = 
    | { status: "success" }
    | { status: "mfa_required", mfa_setup_required: boolean}

export type { LoginResponse, MfaChallengeResponse, MfaConfirmResponse, LoginResult }
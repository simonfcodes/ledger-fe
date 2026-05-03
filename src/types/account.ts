import type { UUID } from "./common"

interface CurrentAccountDetails {
    overdraftLimit: number
}

interface LoanDetails {
    loanAmount: number
    interestRate: number
    termMonths: number
    monthlyPayment: number
}

interface CreditCardDetails {
    creditLimit: number
    apr: number
    lastStatementBalance: number
    lastStatementDate: string
    nextPaymentDueDate: string
    nextPaymentAmount: number
}

interface SavingsDetails {
    interestRate: number
}

interface BaseAccount {
    id: UUID
    userId: UUID
    institutionId: UUID
    name: string    
    currencyCode: string
    countryCode: string
    currentBalance: number
    displayOrder: number
    connectionType: 'PLAID' | 'MANUAL' | 'CSV_IMPORT'
    active: boolean
    createdAt: string
    updatedAt: string
}

interface CurrentAccount extends BaseAccount {
    type: 'CURRENT'
    details: CurrentAccountDetails
}

interface LoanAccount extends BaseAccount {
    type: 'LOAN'
    details: LoanDetails
}

interface CreditCardAccount extends BaseAccount {
    type: 'CREDIT_CARD'
    details: CreditCardDetails
}

interface SavingsAccount extends BaseAccount {
    type: 'SAVINGS'
    details: SavingsDetails
}

export type AccountView = CurrentAccount | LoanAccount | CreditCardAccount | SavingsAccount

interface BaseCreateAccountRequest {
    institutionId: UUID
    name: string
    currencyCode: string
    countryCode: string
    openingBalance: number
}

interface CreateCurrentAccountRequest extends BaseCreateAccountRequest {
    type: 'CURRENT'
    overdraftLimit: number
}

interface CreateLoanAccountRequest extends BaseCreateAccountRequest {
    type: 'LOAN'
    loanAmount: number
    interestRate: number
    termMonths: number
    monthlyPayment: number
}

interface CreateCreditCardAccountRequest extends BaseCreateAccountRequest {
    type: 'CREDIT_CARD'
    creditLimit: number
    apr: number
    lastStatementBalance: number
    lastStatementDate: string
    nextPaymentDueDate: string
    nextPaymentAmount: number
}

interface CreateSavingsAccountRequest extends BaseCreateAccountRequest {
    type: 'SAVINGS'
    interestRate: number
}

export type CreateAccountRequest = CreateCurrentAccountRequest | CreateLoanAccountRequest | CreateCreditCardAccountRequest | CreateSavingsAccountRequest

interface BaseUpdateAccountRequest {
    name: string
    active: boolean
    displayOrder: number
}

interface UpdateCurrentAccountRequest extends BaseUpdateAccountRequest {
    overdraftLimit: number
}

interface UpdateLoanAccountRequest extends BaseUpdateAccountRequest {
    loanAmount: number
    interestRate: number
    termMonths: number
    monthlyPayment: number
}

interface UpdateCreditCardAccountRequest extends BaseUpdateAccountRequest {
    creditLimit: number
    apr: number
    lastStatementBalance: number
    lastStatementDate: string
    nextPaymentDueDate: string
    nextPaymentAmount: number
}

interface UpdateSavingsAccountRequest extends BaseUpdateAccountRequest {
    interestRate: number
}

export type UpdateAccountRequest = UpdateCurrentAccountRequest | UpdateLoanAccountRequest | UpdateCreditCardAccountRequest | UpdateSavingsAccountRequest
import { Card } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useCurrencies } from "@/hooks/useCurrencies"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, } from "@/components/ui/combobox"
import { useMemo, useState } from "react"
import { GlobeIcon, CurrencyIcon } from "lucide-react"
import { InputGroupAddon } from "@/components/ui/input-group"
import type { Currency } from "@/types/currency"
import { getTimezones, type TimezoneOption } from "@/lib/timezones"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { ProfileRequest, UserProfileView } from "@/types/profile"
import { createProfile } from "@/services/profileService"
import type { DateFormat, NumberFormat } from "@/types/common"
import FormAlert from "@/components/FormAlert"
import { getErrorMessage } from "@/lib/errorUtils"
import { Spinner } from "@/components/ui/spinner"

const ProfileSetup: React.FC = () => {
    // hooks
    const [displayName, setDisplayName] = useState<string>("");
    const [baseCurrency, setBaseCurrency] = useState<Currency | null>(null)
    const [timezone, setTimezone] = useState<TimezoneOption | null>(null)
    const [dateFormat, setDateFormat] = useState<DateFormat>("DD/MM/YYYY")
    const [numberFormat, setNumberFormat] = useState<NumberFormat>("1,000.00")

    const [displayNameFieldTouched, setDisplayNameFieldTouched] = useState<boolean>(false)
    const [baseCurrencyFieldTouched, setBaseCurrencyFieldTouched] = useState<boolean>(false)
    const [timezoneFieldTouched, setTimezoneFieldTouched] = useState<boolean>(false)
    const [profileCreationError, setProfileCreationError] = useState<string | null>(null)

    const timezones = useMemo(() => getTimezones(), [])
    const { data: currencies, isLoading: isCurrenciesLoading, error: currenciesError } = useCurrencies()
    
    //TODO: implement proper error handling and loading states
    if (isCurrenciesLoading) {
        return (
            <main className="flex items-center justify-center h-screen">
                <Spinner className="size-20" />
            </main>
        )
    }
    
    // TODO: group timezones by region and display in grouped combobox
    
    // validations
    const isDisplayNameValid = displayNameFieldTouched ? displayName.length >= 2 && displayName.length <= 100 && /^[a-zA-Z0-9 '.-]+$/.test(displayName) : true
    const isBaseCurrencyValid = baseCurrencyFieldTouched ? baseCurrency !== null : true
    const isTimezoneValid = timezoneFieldTouched ? timezone !== null : true
    const isFormValid = displayName.length >= 2 && displayName.length <= 100 && /^[a-zA-Z0-9 '.-]+$/.test(displayName) && baseCurrency !== null && timezone !== null
    const isButtonActive = displayName.length >= 2 && displayName.length <= 100 && /^[a-zA-Z0-9 '.-]+$/.test(displayName) && baseCurrency !== null && timezone !== null
    
    

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isFormValid) {
            // We should never get here because the button only becomes active on validation, but this is a safety check. 
            throw new Error("Form is invalid. Please check your inputs")
        }
        console.log(baseCurrency)
        console.log(timezone)
        const profileRequest: ProfileRequest = {
            displayName,
            baseCurrencyCode: baseCurrency!.code,
            timezone: timezone!.value,
            dateFormat,
            numberFormat
        }
        console.log(profileRequest)
        try {
            const response: UserProfileView = await createProfile(profileRequest)
            console.log("Profile created successfully:", response)
        } catch (error) {
            console.error("Profile creation failed:", error)
            setProfileCreationError(error instanceof Error ? error.message : "Unknown error occurred during profile creation.")
        }
    }

    return (
        <main className="flex items-center justify-center h-screen">
            <Card className="w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-center">Profile Setup</h1>
                <p className="text-gray-500 text-center mt-2">Complete your profile to get started</p>
                <form onSubmit={handleSubmit}>
                    <Field data-invalid={!isDisplayNameValid}>
                        <FieldLabel htmlFor="input-display-name">Display Name</FieldLabel>
                        <Input 
                            aria-invalid={!isDisplayNameValid}
                            id="input-display-name" 
                            type="text" 
                            className="w-full px-3 py-2 border rounded-md" 
                            value={displayName} 
                            onFocus={() => setDisplayNameFieldTouched(true)}
                            onChange={(e) => setDisplayName(e.target.value)} />
                    </Field>
                    <Field className="block mt-4" data-invalid={!isBaseCurrencyValid}>
                        <FieldLabel className="pb-2" htmlFor="input-base-currency">Home Currency</FieldLabel>
                        <Combobox
                            id="input-base-currency"                            
                            value={baseCurrency}
                            itemToStringLabel={(value: Currency | null) => value?.name ?? ""}                            
                            items={currencies}
                            onOpenChange={() => setBaseCurrencyFieldTouched(true)}                         
                            onValueChange={(value: Currency | null) => {
                                setBaseCurrency(value)                                
                            }}>
                            <ComboboxInput placeholder="Select your home currency">
                                <InputGroupAddon>
                                    <CurrencyIcon/>
                                </InputGroupAddon>
                            </ComboboxInput>
                            <ComboboxContent>
                                <ComboboxEmpty>No currencies found</ComboboxEmpty>
                                <ComboboxList>
                                    {(currency: Currency) => (
                                            <ComboboxItem key={currency.code} value={currency}>
                                                {currency.code} - {currency.name}
                                            </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </Field>
                    {currenciesError && <FormAlert title="Error Loading Currencies" description={getErrorMessage(currenciesError)} type="error" />}
                    <Field className="block mt-4" data-invalid={!isTimezoneValid}>
                        <FieldLabel className="pb-2" htmlFor="input-timezone">Timezone</FieldLabel>
                        <Combobox
                            items={timezones}                            
                            value={timezone}
                            itemToStringLabel={(value: TimezoneOption | null) => value?.label ?? ""}
                            onOpenChange={() => setTimezoneFieldTouched(true)}
                            onValueChange={(value: TimezoneOption | null) => setTimezone(value)}>
                            <ComboboxInput placeholder="Select a timezone">
                                <InputGroupAddon>
                                    <GlobeIcon/>
                                </InputGroupAddon>
                            </ComboboxInput>
                            <ComboboxContent>
                                <ComboboxEmpty>No timezones found</ComboboxEmpty>
                                <ComboboxList>
                                    {(tz: TimezoneOption) => (
                                        <ComboboxItem key={tz.value} value={tz}>
                                            {tz.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </Field>
                    <Field className="block mt-4">
                        <FieldLabel className="pb-2" htmlFor="input-date-format">Date Format</FieldLabel>
                        <Select 
                        value={dateFormat}
                        
                        onValueChange={(value: string) => setDateFormat(value as DateFormat)}>
                            <SelectTrigger className="w-full">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                </SelectGroup>                                
                            </SelectContent>                            
                        </Select>
                    </Field>
                    <Field className="block mt-4">
                        <FieldLabel className="pb-2" htmlFor="input-number-format">Number Format</FieldLabel>
                        <Select 
                            value={numberFormat}                            
                            onValueChange={(value: string) => setNumberFormat(value as NumberFormat)}>
                            <SelectTrigger className="w-full">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="1,000.00">1,000.00</SelectItem>
                                    <SelectItem value="1.000,00">1.000,00</SelectItem>
                                    <SelectItem value="1000.00">1 000,00</SelectItem>
                                </SelectGroup>                                    
                            </SelectContent>                            
                        </Select>
                    </Field>
                    {profileCreationError && <FormAlert title="Profile Creation Error" description={profileCreationError} type="error" />}
                    <Button disabled={!isButtonActive} type="submit" className="w-full mt-4">Get Started</Button>
                </form>
            </Card>
        </main>
    )
}

export default ProfileSetup
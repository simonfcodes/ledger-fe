import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Field, FieldLabel } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Navigate } from "react-router-dom"

import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert"


const MfaChallenge: React.FC = () => {
    
    const [mfaCode, setMfaCode] = useState<string>("")
    const [trustDevice, setTrustDevice] = useState<boolean>(false)
    const [mfaError, setMfaError] = useState<string | null>(null)

    const { isAuthenticated, mfaToken, verifyMfa } = useAuth()
    const navigate = useNavigate()

    console.log("MfaChallenge render:", { mfaToken })

    if (!mfaToken && !isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    

    const handleMfaSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        // handle mfa submission logic here
        setMfaError(null)
        if (!mfaCode) {
            setMfaError("Please enter the one-time passcode.")
            return
        }
        try {
            await verifyMfa(mfaCode, trustDevice)
            navigate("/")
        } catch (error) {
            console.error("MFA verification failed:", error)
            setMfaError("MFA verification failed. Please try again.")
        }
    }

    return (
        <main className="flex items-center justify-center h-screen">
            <Card className="w-full max-w-sm p-8">
                <h1 className="text-2xl font-bold text-center">Ledger</h1>
                <h2 className="text-lg text-gray-500 text-center">Verify your identity</h2>
                <form onSubmit={handleMfaSubmit} className="mt-6 flex flex-col items-center">
                    <Field>
                        <div className="flex justify-center">
                            <FieldLabel htmlFor="input-mfa">One-Time Passcode</FieldLabel>
                        </div>
                        <div className="flex justify-center">
                        <InputOTP 
                            id="input-mfa"
                            maxLength ={6} 
                            value={mfaCode} 
                            pattern={REGEXP_ONLY_DIGITS}
                            
                            onChange={(value) => setMfaCode(value)}>
                            <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        </div>
                        
                    </Field>
                    <Field orientation="horizontal" className="py-6">
                        <Checkbox 
                            id="checkbox-trust-device"
                            checked={trustDevice}
                            onCheckedChange={(checked) => setTrustDevice(!!checked)} />
                        <FieldLabel 
                            htmlFor="checkbox-trust-device">Trust this device for 30 days</FieldLabel>
                    </Field>
                    {mfaError && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{mfaError}</AlertDescription>
                        </Alert>
                    )}
                    <Button type="submit" className="w-full mt-4">Submit MFA Code</Button>
                    <h3 className="text-center mt-4">Can't access MFA? <Link to="/mfa-backup" className="text-blue-500">Use a backup code instead.</Link></h3>
                </form>
            </Card>
        </main>
    )
}

export default MfaChallenge
import { Card } from "@/components/ui/card"

import {
  Field,  
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useState } from "react"

import { AlertCircleIcon, Link } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert"
import { registerUser } from "@/services/authServices"
import { useNavigate } from "react-router-dom"

const Register: React.FC = () => {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [registrationError, setRegistrationError] = useState<string | null>(null)

    const navigate = useNavigate()

    const handleRegister = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setRegistrationError(null)
        if (!email || !password || !confirmPassword) {
            setRegistrationError("Please fill in all fields.")
            return
        }
        try {
            const result = await registerUser(email, password)
            console.log("Registration successful:", result)
            navigate("/login")
        } catch (error) {
            console.error("Registration failed:", error)
            setRegistrationError("Registration failed: " + (error instanceof Error ? error.message : "Unknown error"))
        }
    }
    
    return (
        <main className="flex items-center justify-center h-screen">
            <Card className ="w-full max-w-sm p-8">
                <h1 className="text-2xl font-bold text-center">Ledger</h1>
                <h2 className="text-lg text-gray-500 text-center">Create your account</h2>
                <form onSubmit={handleRegister} className="mt-6">
                    <FieldGroup className="w-full max-w-xs"></FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="input-email">Email</FieldLabel>
                        <Input 
                            id="input-email" 
                            type="email" 
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </Field>
                    <FieldGroup className="w-full max-w-xs"></FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="input-password">Password</FieldLabel>
                        <Input 
                            id="input-password" 
                            type="password" 
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </Field>
                    <FieldGroup className="w-full max-w-xs"></FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="input-confirm-password">Confirm Password</FieldLabel>
                        <Input 
                            id="input-confirm-password" 
                            type="password" 
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} />
                    </Field>
                    {registrationError && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertCircleIcon className="w-4 h-4" />
                                <AlertTitle>Registration Failed</AlertTitle>
                                <AlertDescription>{registrationError}</AlertDescription>
                            </Alert>
                        )}
                    <Button type="submit" className="w-full mt-4">Sign In</Button>
                    <h3 className="text-center mt-4">Already have an account? <Link to="/login" className="text-blue-500">Sign in</Link></h3>
                </form>
            </Card>
        </main>
    )
}

export default Register
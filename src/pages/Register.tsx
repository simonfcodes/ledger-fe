import { Card } from "@/components/ui/card"

import {
  Field,  
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useState } from "react"

import { CircleCheck, CircleX } from "lucide-react"
import { registerUser } from "@/services/authServices"
import { useNavigate, Link } from "react-router-dom"
import FormAlert from "@/components/FormAlert"

const Register: React.FC = () => {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [registrationError, setRegistrationError] = useState<string | null>(null)

    const navigate = useNavigate()

    const passwordLongEnough = password.length >= 8
    const passwordHasLetter = /[a-zA-Z]/.test(password)
    const passwordHasNumber = /[0-9]/.test(password)
    const passwordsMatch = password === confirmPassword && confirmPassword !== ""
    const allValid = passwordLongEnough && passwordHasLetter && passwordHasNumber && passwordsMatch

    const validationRules = [
        { met: passwordLongEnough, active: password.length > 0, label: "Must be at least 8 characters" },
        { met: passwordHasLetter, active: password.length > 0, label: "Must contain at least one letter" },
        { met: passwordHasNumber, active: password.length > 0, label: "Must contain at least one number" },
        { met: passwordsMatch, active: confirmPassword.length > 0, label: "Passwords must match" }
    ]

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
                    <FieldGroup className="w-full max-w-xs">
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
                    </FieldGroup>
                    <ul className="mt-4 space-y-2">
                        {validationRules.map((rule, index) => (
                            <li key={index} className={`flex items-center gap-2 text-sm ${rule.met ? "text-green-500" : rule.active ? "text-red-500" : "text-gray-500"}`}>
                                {rule.met ? <CircleCheck size={16} /> : <CircleX size={16} />}
                                {rule.label}
                            </li>
                        ))}
                    </ul>                    
                    {registrationError && <FormAlert title="Registration Failed" description={registrationError} type="error" />}
                    <Button 
                        disabled={!allValid}
                        type="submit" 
                        className="w-full mt-4">Create Account</Button>
                    <h3 className="text-center mt-4">Already have an account? <Link to="/login" className="text-blue-500">Sign in</Link></h3>
                </form>
            </Card>
        </main>
    )
}

export default Register
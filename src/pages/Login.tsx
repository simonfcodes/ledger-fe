import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"

import { AlertCircleIcon } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert"

const Login: React.FC = () => {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    
    const [loginError, setLoginError] = useState<string | null>(null)

    const { login } = useAuth()

    const navigate = useNavigate()

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoginError(null)
        if (!email || !password) {
            setLoginError("Please enter both email and password.")
            return
        }        
        try {
            const result = await login(email, password)
            if (result.status === "success") {
                navigate("/")
            } else if (result.status === "mfa_required") {
                navigate("/mfa")
            }
        } catch (error) {
            console.error("Login failed:", error)
            setLoginError("Login failed: " + (error instanceof Error ? error.message : "Unknown error"))
        }
    }

    return (
            <main className="flex items-center justify-center h-screen">
                <Card className="w-full max-w-sm p-8">
                    <h1 className="text-2xl font-bold text-center">Ledger</h1>
                    <h2 className="text-lg text-gray-500 text-center">Sign in to your account</h2>
                    <form onSubmit={handleLogin} className="mt-6">
                        <Field>
                            <FieldLabel htmlFor="input-email">Email</FieldLabel>
                            <Input 
                                id="input-email" 
                                type="email" 
                                className="w-full px-3 py-2 border rounded-md" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="input-password">Password</FieldLabel>
                            <Input 
                                id="input-password" 
                                type="password" 
                                className="w-full px-3 py-2 border rounded-md" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} />
                        </Field>
                        {loginError && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertCircleIcon className="w-4 h-4" />
                                <AlertTitle>Login Failed</AlertTitle>
                                <AlertDescription>{loginError}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full mt-4">Sign In</Button>
                        <h3 className="text-center mt-4">Don't have an account? <Link to="/register" className="text-blue-500">Register</Link></h3>
                    </form>
                    
                </Card>
            </main>       
    )
}

export default Login
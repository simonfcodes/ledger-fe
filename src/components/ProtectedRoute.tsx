import { useAuth } from "@/hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom"
import { Spinner } from "./ui/spinner"

const ProtectedRoute: React.FC = () => {
    const {isAuthenticated, isLoading} = useAuth()
    
    if (isLoading) {
        return (
            <main className="flex items-center justify-center h-screen">
                <Spinner className="size-20" />
            </main>
        )
    }
    if (!isAuthenticated) {
        return (
            <Navigate to="/login" replace />
        )
    }
    return (
        <>
            <Outlet />
        </>
    )
}

export default ProtectedRoute
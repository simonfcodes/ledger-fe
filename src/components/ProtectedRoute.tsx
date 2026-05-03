import { useAuth } from "@/hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute: React.FC = () => {
    const {isAuthenticated} = useAuth()
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
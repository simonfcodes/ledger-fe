import { useAuth } from "@/hooks/useAuth"
import { Button } from "@base-ui/react"
import { Outlet } from "react-router-dom"
import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const AppLayout: React.FC = () => {

    const { logout } = useAuth()
    const navigate = useNavigate()


    const doLogout = async () => {
        try {
            await logout()
            navigate("/login")
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded px-3 py-2 ${isActive ? "bg-gray-300" : "hover:bg-gray-300"}`
    return (
        <div className="flex h-screen">
            <nav id="sidebar" className="w-[200px] bg-gray-200 p-4 flex flex-col">
                <div id="primary-links">                    
                    <ul className="space-y-2">
                        <li>
                            <NavLink className={navLinkClass} to="/">Dashboard</NavLink>
                        </li>
                        <li>
                            <NavLink className={navLinkClass} to="/accounts">Accounts</NavLink>
                        </li>
                        <li>
                            <NavLink className={navLinkClass} to="/transactions">Transactions</NavLink>
                        </li>
                        <li>
                            <NavLink className={navLinkClass} to="/categories">Categories</NavLink>
                        </li>
                    </ul>
                </div>
                <div id="secondary-links" className="mt-auto">
                    <ul>
                        <li>
                            <NavLink className={navLinkClass} to="/profile-setup">Profile Setup</NavLink>
                        </li>
                        <li>
                            <NavLink className={navLinkClass} to="/settings">Settings</NavLink>
                        </li>
                        <li>
                            <NavLink className={navLinkClass} to="/help">Help</NavLink>
                        </li>
                        <li>
                            <Button className="cursor-pointer block rounded px-3 py-2 hover:bg-gray-300 w-full text-left" onClick={doLogout}>
                                Logout
                            </Button>
                        </li>
                    </ul>
                </div>
            </nav>
            <main id="main-content" className="flex-1 p-4">
                <Outlet />
            </main>    
        </div>        
    )
}

export default AppLayout
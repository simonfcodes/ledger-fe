import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import AppLayout from './components/AppLayout'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'
import Settings from './pages/Settings'
import MfaChallenge from './pages/MfaChallenge'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'

const queryClient = new QueryClient()

function App() {
    
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route element={<AppLayout />}>
                            <Route path="/" element={<Dashboard />} />             
                            <Route path="/accounts" element={<Accounts />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/settings" element={<Settings />} />                            
                        </Route>
                        <Route path="/login" element={<Login />} />
                        <Route path="/mfa" element={<MfaChallenge />} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </AuthProvider>
    )
}

export default App

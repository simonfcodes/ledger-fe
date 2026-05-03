import axios from "axios"

let token: string | null = null

export const setAuthToken = (newToken: string | null) => {
    token = newToken
}

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

instance.interceptors.request.use(config => {
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default instance;
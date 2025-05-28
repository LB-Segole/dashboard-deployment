import { useState } from 'react'

export function useAuth() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const login = async (email: string, password: string) => {
        setLoading(true)
        try {
            // Add your authentication logic here
            setUser({ email })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, error, login }
}

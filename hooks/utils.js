import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase.js'

function useSession() {
    const [session, setSession] = useState(null)

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
        }

        fetchSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    return [session, setSession]
}

export { useSession }
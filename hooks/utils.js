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

function useLikesCount(postId) {
    const [likes, setLikes] = useState(0)

    useEffect(() => {
        const fetchLikes = async () => {
            const { data, error } = await supabase
                .from('likes')
                .select()
                .eq('postid', postId)

            if (error) {
                console.error('Error fetching likes:', error.message)
                return
            }

            if (data) {
                setLikes(data.length)
            }
        }

        fetchLikes()
    }, [postId])

    return likes
}

export { useSession, useLikesCount }

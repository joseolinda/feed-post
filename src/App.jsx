import { supabase } from '../services/supabase.js'
import { useState, useEffect } from 'react'

import Login from './Login'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return <Login />
  } 

  return (
    <form>
      <input type="file" name="image" />
      <button type="submit">Upload image</button>
    </form>
  );
}

export default App
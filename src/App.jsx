import { supabase, uploadImage, getImage  } from '../services/supabase.js'
import { useState, useEffect } from 'react'

import Login from './Login'

function App() {
  const [file, setfile] = useState([]);
  const [images, setImages] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newImage = await uploadImage(file);
      setImages((prev) => [...prev, newImage]);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFileSelected = (e) => {
    setfile(e.target.files[0]);
  };

  if (!session) {
    return <Login />
  } 

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="image" onChange={handleFileSelected} />
      <button type="submit">Upload image</button>
      <div>
        {images.map((image) => (
          <img
            key={image.Key}
            src={image.url}
            alt={image.Key}
            style={{ width: 200 }}
          />
        ))}
      </div>
    </form>
  );
}

export default App
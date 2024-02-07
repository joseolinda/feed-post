import { useState, useEffect } from 'react'
import { supabase, uploadImage, getImage } from '../services/supabase.js'

function NewPost( { onClose }) {
    const [file, setfile] = useState([])
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const newImage = await uploadImage(file)
            setImages((prev) => [...prev, getImage(newImage.path)])
        } catch (error) {
            alert(error.message)
        }
    }

    const handleFileSelected = (e) => {
        setfile(e.target.files[0])
    }

    const handleClose = () => {
        return onClose(false)
    }

    return (
        <div>
            <h1>New Post</h1>
            <button onClick={ handleClose }>Cancelar</button>
            <form onSubmit={handleSubmit}>
                <input type="file" name="image" onChange={handleFileSelected} />
            </form>
        </div>
    )
}

export default NewPost
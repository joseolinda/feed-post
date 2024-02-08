import { useState } from 'react'
import { uploadImage, getImage } from '../services/supabase.js'
import { FaFileImage, FaSave, FaTimesCircle } from 'react-icons/fa'

function NewPost({ onClose }) {
    const [file, setFile] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) {
            alert('Nenhum arquivo selecionado.')
            return
        }
        try {
            const newImage = await uploadImage(file)
            setAllPosts((prev) => [...prev, getImage(newImage.path)])
        } catch (error) {
            console.error('Erro ao enviar imagem:', error.message)
            alert('Falha ao enviar imagem.')
        }
    }

    const handleFileSelected = (e) => {
        setFile(e.target.files[0])
    }

    const handleClose = () => {
        return onClose(false)
    }

    return (
        <div className="overlay">


            <div className='newpost'>

                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" placeholder="Título" />
                    <textarea name="content" placeholder="Conteúdo" />
                    <input className='hide' type="file" id='image-file' name="image-file" onChange={handleFileSelected} />
                    <label className='image-upload' htmlFor="image-file">
                        <FaFileImage />
                        <span>Escolha uma imagem</span>
                    </label>
                    <div className={'image-preview ' + (!file && 'hide')}>
                        <FaTimesCircle onClick={() => setFile(null)} />
                        <label htmlFor="image-file" >
                            <span>
                                <strong>Escolher outra imagem</strong>
                                <FaFileImage />
                            </span>
                            {file && <img src={URL.createObjectURL(file)} alt="Imagem selecionada" />}
                        </label>
                    </div>
                    <div className='action-buttons'>
                        <button type='reset' onClick={handleClose}>
                            <FaTimesCircle /> Cancelar
                        </button>
                        <button type="submit">
                            <FaSave /> Salvar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default NewPost
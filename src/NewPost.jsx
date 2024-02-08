import { useState } from 'react'
import { supabase, uploadImage, getImage } from '../services/supabase.js'
import { FaFileImage, FaSave, FaTimesCircle } from 'react-icons/fa'

import PropTypes from 'prop-types';

function NewPost({ onClose }) {
    const [file, setFile] = useState(null)
    const [post, setPost] = useState({
        title: '',
        content: '',
        image: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) {
            alert('Nenhum arquivo selecionado.')
            return
        }
        try {
            const newImage = await uploadImage(file)
            const imageUrl = getImage(newImage.fullPath).url
            setPost({ ...post, image: imageUrl })
            const { data: { user } } = await supabase.auth.getUser()
            const userId = user.id;
            const { error } = await supabase
                                    .from('posts')
                                    .insert({
                                        title: post.title,
                                        content: post.content,
                                        imageurl: imageUrl,
                                        userid: userId
                                    })

            if (error) {
                console.error('Erro ao inserir novo post:', error.message)
                alert('Falha ao inserir novo post.')
                return
            }
            onClose(false)

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
                    <input
                        type="text" 
                        name="title" 
                        placeholder="Título"
                        value={post.title}
                        onChange={(e) => setPost({ ...post, title: e.target.value })}    
                    />
                    <textarea 
                        name="content" 
                        placeholder="Conteúdo"
                        value={post.content}
                        onChange={(e) => setPost({ ...post, content: e.target.value })}
                    />
                    <input 
                        className='hide' 
                        type="file" 
                        id='image-file' 
                        name="image-file" 
                        onChange={handleFileSelected} 
                    />
                    <label className={'image-upload ' + (file && 'hide')} htmlFor="image-file">
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

NewPost.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default NewPost
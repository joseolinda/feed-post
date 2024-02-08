import { useEffect, useState } from 'react'
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa'
import PropTypes from 'prop-types'
import { supabase } from '../services/supabase'

function Post({ postid, title, imageurl, content, onDelete }) {
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)

    useEffect(() => {
        const fetchLikesAndCheckUserLike = async () => {
            await fetchLikes()
            await checkUserLike()
        }

        // Subscrever para mudanças na tabela de likes
        const likesSubscription = supabase.channel('custom-all-channel')
            .on(
                'broadcast',
                { event: '*', schema: 'public', table: 'likes' },
                (payload) => {
                    console.log('Change received!', payload)
                    fetchLikes()
                }
            )
            .subscribe()

        fetchLikesAndCheckUserLike()

        // Cancelar a assinatura quando o componente é desmontado
        return () => supabase.removeChannel(likesSubscription)
    }, [likeCount])

    // Busca a contagem de likes do post
    const fetchLikes = async () => {
        const { data, error } = await supabase
            .from('likes')
            .select('*', { count: 'exact' })
            .eq('postid', postid)

        if (!error) {
            setLikeCount(data.length)
        }
    }

    // Verifica se o usuário atual deu like no post
    const checkUserLike = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data } = await supabase
                .from('likes')
                .select()
                .eq('postid', postid)
                .eq('userid', user.id)

            setIsLiked(data && data.length > 0)
        }
    }

    // Adiciona um like
    const addLike = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { error } = await supabase
                .from('likes')
                .insert([{ postid: postid, userid: user.id }])
            if (!error) {
                setLikeCount(likeCount + 1)
                setIsLiked(true)
            }
        }
    }

    // Remove um like
    const removeLike = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { error } = await supabase
                .from('likes')
                .delete()
                .match({ postid: postid, userid: user.id })
            if (!error) {
                setLikeCount(Math.max(0, likeCount - 1)) // Evita números negativos
                setIsLiked(false)
            }
        }
    }

    // Manipula o clique no ícone de like
    const handleLike = () => {
        if (isLiked) {
            removeLike()
        } else {
            addLike()
        }
    }

    // Deleta o post
    const deletePost = async () => {
        const { data: error } = await supabase
            .from('posts')
            .delete()
            .eq('postid', postid)
        
        onDelete(postid)

        if (error) {
            console.error('Erro ao deletar post:', error.message)
            alert('Falha ao deletar post.')
            return
        }
    }

    return (
        <div className="post">
            <h1 className="header">{title}</h1>
            <FaTrash className="delete" onClick={ deletePost } />
            <img src={imageurl} alt={title} />
            <p className="content">{content}</p>
            <div className="curtidas">
                <span>{likeCount} curtidas</span>
                {isLiked ? (
                    <FaHeart fill="#f09" onClick={handleLike} />
                ) : (
                    <FaRegHeart onClick={handleLike} />
                )}
            </div>
        </div>
    )
}

Post.propTypes = {
    postid: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    imageurl: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
}

export default Post
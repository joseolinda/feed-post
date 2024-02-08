import { useEffect, useState } from 'react'
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa'
import { useLikesCount } from '../hooks/utils';
import { supabase } from '../services/supabase';

import PropTypes from 'prop-types';

function Post({ postid, userid, title, imageurl, content }) {
    const [isLiked, setIsLiked] = useState(false)
    let likeCount = useLikesCount(postid)

    const fetchLikes = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        const id = user.id;
        const { data, error } = await supabase
            .from('likes')
            .select()
            .eq('postid', postid)
            .eq('userid', id)

        if (error) {
            console.error('Error fetching likes:', error.message)
            return
        }

        if (data) {
            setIsLiked(data.length > 0)
        }
    }

    useEffect(() => {
        fetchLikes()
    }, [isLiked])

    async function addLike() {
        const { data: { user } } = await supabase.auth.getUser()
        const id = user.id;
        const { error } = await supabase
            .from('likes')
            .insert({
                postid: postid,
                userid: id
            })

        if (error) {
            console.error('Erro ao inserir novo like:', error.message)
            return
        }

    }

    async function removeLike() {
        const { data: { user } } = await supabase.auth.getUser()
        const id = user.id;
        const { error } = await supabase
            .from('likes')
            .delete()
            .eq('postid', postid)
            .eq('userid', id)

        if (error) {
            console.error('Erro ao remover like:', error.message)
            return
        }
    }

    function apagar() {
        return alert('Apagando post')
    }

    function handleLike() {
        if (isLiked) {
            removeLike()
        } else {
            addLike()
        }

        setIsLiked(!isLiked)
    }

    return (
        <div className="post">
            <h1 className="header">{title}</h1>
            <FaTrash className='delete' onClick={apagar} />
            <img src={imageurl} alt={title} />
            <p className="content">{content}</p>
            <div className='curtidas'>
                <span>{likeCount} curtidas</span>
                { isLiked ? (
                    <FaHeart fill='#f09' onClick={handleLike} />
                ): (
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
};

export default Post
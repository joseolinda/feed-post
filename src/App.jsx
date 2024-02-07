import React, { useEffect, useState } from 'react';
import { supabase, uploadImage, getImage } from '../services/supabase.js';
import { useSession } from '../hooks/utils.js';

import Login from './Login';
import Feed from './Feed';
import NewPost from './NewPost';

function App() {
  const [session] = useSession();
  const [allPosts, setAllPosts] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('postid', 'userid', 'title', 'content', 'imageurl');

      if (error) {
        console.error('Error fetching posts:', error.message);
        return;
      }

      if (data) {
        setAllPosts(data);
      }
    };

    fetchPosts();
  }, []);

  if (!session) {
    return <Login />;
  }

  return (
    <main>
      <header>
        <h1>FeedPosts</h1>
        <h2>Sua nova rede social</h2>
        <button onClick={handleLogout}>Sair</button>
      </header>
      {!showNewPost && <button className='btn addpost' onClick={() => setShowNewPost(true)}>New Post</button>}

      {allPosts.length > 0 ? <Feed posts={allPosts} /> : "Ninguém postou nada"}

      {showNewPost && <NewPost onClose={ setShowNewPost } />}
    </main>
  );
}

export default App;
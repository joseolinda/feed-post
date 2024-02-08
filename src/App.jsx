import  { useEffect, useState } from 'react';
import { supabase } from '../services/supabase.js';
import { useSession } from '../hooks/utils.js';

import Login from './Login';
import Feed from './Feed';
import NewPost from './NewPost';
import { FaDoorOpen, FaPlus } from 'react-icons/fa'

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
      const { data, error } = await supabase.from('posts').select()

      if (error) {
        console.error('Error fetching posts:', error.message);
        return;
      }

      if (data) {
        console.log('Posts:', data);
        setAllPosts(data);
      }
    };

    fetchPosts();
  }, []);

  if (!session) {
    return (
      <main className='app'>
        <header>
          <h1>FeedPosts</h1>
          <h2>Sua nova rede social.</h2>
        </header>
        <div className='post-area login'>
          <Login />
        </div>
    </main>);
  }

  return (
    <main className='app'>
      <header>
        <h1>FeedPosts</h1>
        <h2>Sua nova rede social.</h2>
        <button onClick={handleLogout}>
          <FaDoorOpen />
          Fazer logoff
        </button>
      </header>
      <div className='post-area'>

        {!showNewPost && <button className='btn addpost' onClick={() => setShowNewPost(true)}><FaPlus /> Novo Post</button>}

        {allPosts.length > 0 ? <Feed posts={allPosts} /> : <strong id='no-posts'>Ninguém postou nada ainda.</strong>}

        {showNewPost && <NewPost onClose={ setShowNewPost } />}

      </div>
    </main>
  );
}

export default App;
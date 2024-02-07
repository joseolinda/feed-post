import React, { useState } from 'react';
import { supabase, uploadImage, getImage } from '../services/supabase.js';
import { useSession } from '../hooks/utils.js';

import Login from './Login';
import Feed from './Feed';
import NewPost from './NewPost';

function App() {
  const [session] = useSession();
  const [allPosts, setAllPosts] = useState([
    {
      id: 1,
      titulo:"Resultado do SISU 2024",
      imagem:"https://picsum.photos/200/200?random=1",
      conteudo:"MEC e INEP liberam resultado do SISU 2024."
    },
    {
      id: 2,
      titulo:"Nota de Corte de SI",
      imagem:"https://picsum.photos/200/200?random=2",
      conteudo:"Com nota de corte de 812, SI possui a maior nota da região"
    }, 
    {
      id:10,
      titulo: "Atradados do Enem",
      imagem:"https://picsum.photos/200/200?random=7",
      conteudo:"Após os alunos atrasarem, MEC atrasa a nota."
    }
  ]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [file, setFile] = useState(null); // Ajuste para incluir o estado do arquivo

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Nenhum arquivo selecionado.');
      return;
    }
    try {
      const newImage = await uploadImage(file);
      setAllPosts((prev) => [...prev, getImage(newImage.path)]);
    } catch (error) {
      console.error('Erro ao enviar imagem:', error.message);
      alert('Falha ao enviar imagem.');
    }
  };

  const handleFileSelected = (e) => {
    setFile(e.target.files[0]);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

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

      {showNewPost && <NewPost onClose={ setShowNewPost } onSubmit={handleSubmit} onFileSelected={handleFileSelected} />}
    </main>
  );
}

export default App;
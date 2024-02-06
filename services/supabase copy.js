import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tthfkmzhijkauchymzsn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0aGZrbXpoaWprYXVjaHltenNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNzI1NTA2MywiZXhwIjoyMDIyODMxMDYzfQ.rdVqF6p1bLPKWMNbOsATU9tkwaDdBcVeq6khFr0glk4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function uploadImage(file) {
    const { data, error } = await supabase.storage
      .from('feed-images')
      .upload(`${uuidv4()}-${file.name}`, file)
  
    if (error) throw new Error('Error uploading image:', error.message);
  
    return data;
}

async function getImage(path) {
    const { data, error } = await supabase.storage
      .from('feed-images')
      .list(path);

    if (error) throw new Error('Error getting images:', error.message);

    return data;
}

export {
    supabase,
    uploadImage,
    getImage
}
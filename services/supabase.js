import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'SUA URL'
const supabaseKey = 'SUA CHAVE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function uploadImage(file) {
    const { data, error } = await supabase.storage
      .from('imagens')
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
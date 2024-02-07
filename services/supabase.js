import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function uploadImage(file) {
    const { data, error } = await supabase.storage
      .from('imagens')
      .upload(`${uuidv4()}-${file.name}`, file)

    if (error) throw new Error('Error uploading image:', error.message);

    return data;
}

function getImage(path) {
    return {
        id: path.split('-')[0],
        name: path.split('-')[1],
        url: `${supabaseUrl}/storage/v1/object/public/imagens/${path}`
    }
}

export {
    supabase,
    uploadImage,
    getImage
}
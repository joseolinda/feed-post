import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function uploadImage(file) {
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user.id;
    const fileExt = file.name.split('.').pop();
    const { data, error } = await supabase.storage
      .from('imagens')
      .upload(`${userId}/${uuidv4()}.${fileExt}`, file)

    if (error) throw new Error('Error uploading image:', error.message);

    return data;
}

function getImage(fullpath) {
    const imageName = fullpath.split('/')[1]
    return {
        id: imageName.split('.')[0],
        name: imageName,
        url: `${supabaseUrl}/storage/v1/object/public/${fullpath}`
    }
}

export {
    supabase,
    uploadImage,
    getImage
}
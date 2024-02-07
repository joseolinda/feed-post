import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'SUA URL'
const supabaseKey = 'SUA CHAVE'

const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase }
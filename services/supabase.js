import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tthfkmzhijkauchymzsn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0aGZrbXpoaWprYXVjaHltenNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNzI1NTA2MywiZXhwIjoyMDIyODMxMDYzfQ.rdVqF6p1bLPKWMNbOsATU9tkwaDdBcVeq6khFr0glk4'

const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase }
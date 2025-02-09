import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.REACT_SUPABASE_URL;
const supabaseKey = process.env.REACT_SUPABASE_KEY;
console.log(supabaseKey, supabaseUrl);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Variáveis de ambiente SUPABASE_URL e SUPABASE_KEY são obrigatórias.");
};

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
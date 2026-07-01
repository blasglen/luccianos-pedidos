import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Faltan las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. " +
    "Configuralas en Vercel (Settings > Environment Variables) o en un archivo .env local."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

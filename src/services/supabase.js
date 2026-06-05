import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Substitua com as credenciais do seu painel do Supabase 
// (Configurações do Projeto -> API -> Project API keys)

const EXPO_PUBLIC_SUPABASE_URL = "https://hzoqpwgrxsxodpwgrjdn.supabase.co";
const EXPO_PUBLIC_SUPABASE_KEY = "sb_publishable_yAsD17XWnlLlZ89okX4yrQ_NTVCvZvk";

export const supabase = createClient(EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_KEY);
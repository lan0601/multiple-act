
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://onvuszdkniyjjqzcvawi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9udnVzemRrbml5ampxemN2YXdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODEzNTEyOCwiZXhwIjoyMDUzNzExMTI4fQ.5r2PfVQ7leNE9J_b672KaPpkmJ2IhfytBGW3RUwyjik'

export const supabase = createClient(supabaseUrl, supabaseKey);

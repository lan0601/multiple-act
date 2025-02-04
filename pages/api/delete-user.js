import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key (server-side only)
);

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method Not Allowed" });

  const { user_id } = req.body; // Get user ID from request

  if (!user_id) return res.status(400).json({ error: "User ID is required" });

  try {
    // Securely delete user using admin API (server-side)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id);

    if (error) throw error;

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

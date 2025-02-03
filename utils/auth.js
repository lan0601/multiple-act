import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

// Custom hook for authentication-related actions
export const useAuth = () => {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();  // Sign the user out
    router.push("/login");  // Redirect to login page after logout
  };

  return { logout };
};
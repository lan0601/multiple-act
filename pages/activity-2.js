import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../utils/auth";
import DashboardLayout from "../layouts/DashboardLayouts"; // Adjust path based on your structure

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        router.push("/login");
      }
    };

    fetchSession();
  }, [router]);

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setLoading(true);
      try {
        const response = await fetch("/api/delete-user", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });
        console.log(response);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to delete account");
  
        logout();
        router.push("/login");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("An error occurred while trying to delete your account.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <DashboardLayout logout={logout} handleDeleteAccount={handleDeleteAccount} loading={loading}>
      <div className="p-6">
        <h2 className="text-2xl font-bold">Welcome, {user.email}</h2>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

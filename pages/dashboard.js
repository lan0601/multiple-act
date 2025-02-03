import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../utils/auth";
import DashboardLayout from "../layouts/DashboardLayouts"; // Adjust path based on your structure

const Dashboard = () => {
  const [user, setUser] = useState(null);
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

  if (!user) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold">Welcome, {user.email}</h2>

        <div className="mt-4 flex flex-col gap-2">
          {/* <button className="bg-blue-500 text-white p-2 rounded" onClick={() => router.push("/secret-page-2")}>
            Secret Page 2
          </button>
          <button className="bg-blue-500 text-white p-2 rounded" onClick={() => router.push("/secret-page-3")}>
            Secret Page 3
          </button>
          <button className="bg-red-500 text-white p-2 rounded" onClick={logout}>
            Logout
          </button> */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

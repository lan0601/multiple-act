import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../utils/auth";
import DashboardLayout from "../layouts/DashboardLayouts"; // Adjust path based on your structure
import styles from "../styles/Dashboard.module.css"; // Adjust path if necessary



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
      <div className="container">
        <div className="rows">
          <div className="col-m6">1</div>
          <div className="col-m6">2</div>
          <h2>Todo List</h2>
          <button children={styles.addtaskbutton}>Add Task</button>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Assigned User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr></tr>
              <tr></tr>
              <tr></tr>
              <tr></tr>
              <tr></tr>
              {/* {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.position}</td>
                  <td>${emp.salary}</td>
                  <td>
                    <button className="bg-blue-500 text-white p-1 mr-2" onClick={() => updateEmployee(emp.id, { position: "Updated Position" })}>
                      Edit
                    </button>
                    <button className="bg-red-500 text-white p-1" onClick={() => deleteEmployee(emp.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

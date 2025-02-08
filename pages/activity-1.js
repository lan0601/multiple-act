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

  const [taskName, setTaskName] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [emailOptions, setEmailOptions] = useState([]);
  const [tasks, setTasks] = useState([]);

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

  useEffect(() => {
    const fetchEmails = async () => {
      const { data, error } = await supabase.from("user_view").select("*");
      if (error) {
        console.error("Error fetching emails:", error);
      } else {
        setEmailOptions(data);
      }
    };
    fetchEmails();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from("todo").select("*");
      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        setTasks(data);
      }
    };
    fetchTasks();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName || !assignedUser) {
      alert("Please fill in all fields");
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from("todo") // Change to your actual table name
        .insert([{ task: taskName, assigned_id: assignedUser}]);
  
      if (error) throw error;
  
      alert("Task added successfully!");
      setTaskName("");
      setAssignedUser("");
  
      // Close modal using Bootstrap’s modal function
      const modal = document.getElementById("addTaskModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    } catch (error) {
      console.error("Error adding task:", error.message);
      alert("Failed to add task.");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <DashboardLayout logout={logout} handleDeleteAccount={handleDeleteAccount} loading={loading}>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h2>Todo List</h2>
          </div>
          <div className="d-flex col-md-6 justify-content-end">
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTaskModal">
              Add Task
            </button>
          </div>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Assigned User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.task}</td>
                  <td>{task.assigned_id}</td>
                  <td>
                    <button className="bg-blue-500 text-white p-1 mr-2" onClick={() => updateEmployee(task.id, { position: "Updated Position" })}>
                      Edit
                    </button>
                    <button className="bg-red-500 text-white p-1" onClick={() => deleteEmployee(task.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </div>


      <div className="modal fade" id="addTaskModal" tabIndex="-1" aria-labelledby="addTaskModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addTaskModalLabel">Add Task</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Task Name</label>
                  <input type="text" className="form-control" value={taskName} onChange={(e) => setTaskName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Assigned User</label>
                  <select
                    className="form-select"
                    value={assignedUser}
                    onChange={(e) => setAssignedUser(e.target.value)}
                    required
                  >
                    <option value="">Select a user</option>
                    {emailOptions.map((email) => (
                      <option key={email.id} value={email.id}>{email.email}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-success">Add Task</button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
};

export default Dashboard;

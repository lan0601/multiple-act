import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../utils/auth";
import DashboardLayout from "../layouts/DashboardLayouts";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const [taskName, setTaskName] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [emailOptions, setEmailOptions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null); // Track selected task

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
      if (error) console.error("Error fetching emails:", error);
      else setEmailOptions(data);
    };
    fetchEmails();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from("todo").select("*").order("id", { ascending: true });
    if (error) console.error("Error fetching tasks:", error);
    else setTasks(data);
  };

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
      if (selectedTask) {
        // Update existing task
        const { error } = await supabase
          .from("todo")
          .update({ task: taskName, assigned_id: assignedUser })
          .eq("id", selectedTask.id);
        if (error) throw error;
        alert("Task updated successfully!");
      } else {
        // Add new task
        const { error } = await supabase
          .from("todo")
          .insert([{ task: taskName, assigned_id: assignedUser }]);
        if (error) throw error;
        alert("Task added successfully!");
      }

      setTaskName("");
      setAssignedUser("");
      setSelectedTask(null);
      fetchTasks();

      // Close modal
      const modal = document.getElementById("addTaskModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    } catch (error) {
      console.error("Error submitting task:", error.message);
      alert("Failed to submit task.");
    }
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setTaskName(task.task);
    setAssignedUser(task.assigned_id);

    // Open modal
    const modal = new bootstrap.Modal(document.getElementById("addTaskModal"));
    modal.show();
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      const { error } = await supabase.from("todo").delete().eq("id", taskId);
      if (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task.");
      } else {
        alert("Task deleted successfully!");
        fetchTasks();
      }
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
        <table className="table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assigned User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.task}</td>
                <td>{task.assigned_id}</td>
                <td>
                  <button className="btn btn-warning me-2" onClick={() => handleEditClick(task)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <div className="modal fade" id="addTaskModal" tabIndex="-1" aria-labelledby="addTaskModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addTaskModalLabel">{selectedTask ? "Edit Task" : "Add Task"}</h5>
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
                  <select className="form-select" value={assignedUser} onChange={(e) => setAssignedUser(e.target.value)} required>
                    <option value="">Select a user</option>
                    {emailOptions.map((email) => (
                      <option key={email.id} value={email.id}>{email.email}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-success">{selectedTask ? "Update Task" : "Add Task"}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

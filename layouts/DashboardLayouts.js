import styles from "../styles/Dashboard.module.css"; // Adjust path if necessary

export default function DashboardLayout({ children, logout, handleDeleteAccount, loading  }) {
  return (
    <div className={styles["dashboard-container"]}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2>Dashboard</h2>
        <nav>
          <a href="activity-1">Activity 1</a>
          <a href="activity-2">Activity 2</a>
          <a href="activity-3">Activity 3</a>
          <a href="activity-4">Activity 4</a>
          <a href="activity-5">Activity 5</a>
        </nav>
        <div className={styles.bottomLinks}>
        <button className="bg-red-500 text-white p-2 rounded" onClick={logout}>
            Logout
          </button>
          <button
            className="bg-gray-700 text-white p-2 rounded"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles["main-content"]}>
        <div>{children}</div>
      </main>
    </div>
  );
}

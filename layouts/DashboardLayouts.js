import { useRouter } from "next/router";
import styles from "../styles/Dashboard.module.css"; // Adjust path if necessary

export default function DashboardLayout({ children, logout, handleDeleteAccount, loading }) {
  const router = useRouter(); // Get current route

  return (
    <div className={styles["dashboard-container"]}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <nav>
          <a href="/dashboard" className={router.pathname === "/dashboard" ? styles.active : ""}>Dashboard</a>
          <a href="/activity-1" className={router.pathname === "/activity-1" ? styles.active : ""}>Activity 1</a>
          <a href="/activity-2" className={router.pathname === "/activity-2" ? styles.active : ""}>Activity 2</a>
          <a href="/activity-3" className={router.pathname === "/activity-3" ? styles.active : ""}>Activity 3</a>
          <a href="/activity-4" className={router.pathname === "/activity-4" ? styles.active : ""}>Activity 4</a>
          <a href="/activity-5" className={router.pathname === "/activity-5" ? styles.active : ""}>Activity 5</a>
        </nav>

        {/* Logout and Delete Account at Bottom */}
        <div className={styles.bottomLinks}>
          <button onClick={logout}>
            Logout
          </button>
          <button onClick={handleDeleteAccount}
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

import styles from "@/styles/Dashboard.module.css";


export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-900 text-white p-6 flex flex-col h-full justify-between">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <nav className="flex flex-col gap-3 flex-grow justify-center">
          <a href="#" className="p-3 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 hover:text-white transition">Home</a>
          <a href="#" className="p-3 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 hover:text-white transition">Profile</a>
          <a href="#" className="p-3 bg-gray-600 text-gray-100 rounded hover:bg-gray-500 hover:text-white transition">Settings</a>
        </nav>
      </aside>


      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
          {children}
        </div>
      </main>
    </div>
  );
}

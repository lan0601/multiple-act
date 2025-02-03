export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-800 text-white p-4 flex flex-col gap-4 h-full">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <a href="#" className="p-2 hover:bg-gray-700 rounded">Home</a>
          <a href="#" className="p-2 hover:bg-gray-700 rounded">Profile</a>
          <a href="#" className="p-2 hover:bg-gray-700 rounded">Settings</a>
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

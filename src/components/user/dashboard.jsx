import UserLayout from "./UserLayout";

export default function UserDashboard() {
  return (
    <UserLayout>
      <div className="px-5 md:px-10 pt-8 text-white">
        <div className="md:hidden text-3xl font-bold mb-1">Hello!</div>
        <div className="md:hidden text-base mb-8">Welcome to Izhaar Platform</div>
        
        {/* Dashboard content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add your dashboard widgets here */}
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Welcome to Izhaar</h3>
              <p className="text-gray-400">Express your feelings and connect with others.</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

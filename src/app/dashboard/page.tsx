// app/dashboard/page.tsx
import React from 'react';

export default function DashboardOverviewPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Dashboard Overview</h1> {/* Added text-gray-900 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Dashboard Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Total Users</h2> {/* Added text-gray-800 */}
          <p className="text-4xl font-bold text-blue-600">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Sales Today</h2> {/* Added text-gray-800 */}
          <p className="text-4xl font-bold text-green-600">$5,678</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">New Orders</h2> {/* Added text-gray-800 */}
          <p className="text-4xl font-bold text-yellow-600">89</p>
        </div>
        {/* More cards/widgets */}
      </div>
    </div>
  );
}
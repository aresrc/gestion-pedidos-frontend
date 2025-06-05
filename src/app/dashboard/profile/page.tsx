// app/dashboard/profile/page.tsx
import React from 'react';

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">User Profile</h1> {/* Added text-gray-900 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>This is your profile page content.</p>
        {/* Add profile details, forms, etc. */}
      </div>
    </div>
  );
}
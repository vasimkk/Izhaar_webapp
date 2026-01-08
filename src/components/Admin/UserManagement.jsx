import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const res = await api.get("/auth/users");
        setUsers(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        setError("Failed to fetch user info");
      } finally {
        setLoading(false);
      }
    }
    fetchUserInfo();
  }, []);

  const handleDeleteUser = async (userId, mobile) => {
    if (!window.confirm(`Are you sure you want to delete user ${mobile} (ID: ${userId})?`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await api.delete("auth/admin/delete-user", {
        data: { userId }
      });
      alert(res.data.message || "User deleted successfully");
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAllUsers = async () => {
    if (!window.confirm("⚠️ WARNING: Are you sure you want to delete ALL users? This action cannot be undone!")) {
      return;
    }

    if (!window.confirm("Final confirmation: Delete ALL users?")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await api.delete("auth/admin/delete-all-users", {
        data: { confirmation: 'DELETE_ALL_USERS' }
      });
      alert(res.data.message || "All users deleted successfully");
      setUsers([]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete all users");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-pink-600">User Management</h2>
        {users.length > 0 && (
          <button
            onClick={handleDeleteAllUsers}
            disabled={deleting}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting..." : "Delete All Users"}
          </button>
        )}
      </div>
      {loading ? (
        <div className="text-gray-500">Loading users...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500">No users found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Mobile</th>
                <th className="px-4 py-2 border-b">Role</th>
                <th className="px-4 py-2 border-b">Verified</th>
                <th className="px-4 py-2 border-b">Active</th>
                <th className="px-4 py-2 border-b">Created At</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="text-center hover:bg-pink-50">
                  <td className="px-4 py-2 border-b">{user.id}</td>
                  <td className="px-4 py-2 border-b">{user.mobile}</td>
                  <td className="px-4 py-2 border-b">{user.role}</td>
                  <td className="px-4 py-2 border-b">{user.is_verified ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 border-b">{user.is_active ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 border-b">{user.created_at ? new Date(user.created_at).toLocaleString() : "-"}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleDeleteUser(user.id, user.mobile)}
                      disabled={deleting}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
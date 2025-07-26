import React, { useState } from "react";

const mockUsers = [
  {
    id: "u1",
    name: "Ravi Kumar",
    email: "ravi@vendor.com",
    phone: "+91 9876543210",
    role: "Vendor",
    status: "Active",
  },
  {
    id: "u2",
    name: "Meena Patel",
    email: "meena@supplier.com",
    phone: "+91 9898989898",
    role: "Supplier",
    status: "Blocked",
  },
  {
    id: "u3",
    name: "Admin User",
    email: "admin@rasoisathi.com",
    phone: "+91 9000000000",
    role: "Admin",
    status: "Active",
  },
];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleStatusChange = (id, newStatus) => {
    alert(`User ${id} marked as ${newStatus}`);
  };

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-orange-700 mb-6">
        👥 User Management
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-44"
        >
          <option value="">All Roles</option>
          <option value="Vendor">Vendor</option>
          <option value="Supplier">Supplier</option>
          <option value="Admin">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-44"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No users match the filters.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {user.status === "Active" ? (
                      <button
                        onClick={() => handleStatusChange(user.id, "Blocked")}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(user.id, "Active")}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;

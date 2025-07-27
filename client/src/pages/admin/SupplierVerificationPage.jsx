import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, CheckCircle, XCircle } from "lucide-react";

const SupplierVerification = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/suppliers`
      );
      setSuppliers(res.data.suppliers);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/supplier/${id}`,
        {
          status,
        }
      );
      fetchSuppliers();
    } catch (err) {
      console.error("Error updating supplier status:", err);
    }
  };

  const filtered = suppliers.filter((s) => {
    const matchName = s.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      !statusFilter || s.status === statusFilter.toLowerCase();
    return matchName && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-orange-700 mb-4">
        Supplier Verification
      </h2>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-48"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full table-auto">
          <thead className="bg-orange-100 text-left text-sm font-semibold text-orange-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filtered.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2">{s.phone}</td>
                <td className="px-4 py-2 capitalize font-medium">{s.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => setSelectedSupplier(s)}
                    className="text-orange-600 hover:underline text-sm"
                  >
                    <Eye size={16} className="inline mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleStatusChange(s._id, "approved")}
                    className="text-green-600 hover:text-green-700 text-sm"
                  >
                    <CheckCircle size={16} className="inline mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(s._id, "rejected")}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    <XCircle size={16} className="inline mr-1" />
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4 relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
              onClick={() => setSelectedSupplier(null)}
            >
              ✖
            </button>
            <h3 className="text-lg font-bold text-orange-700">
              Supplier Details
            </h3>
            <p>
              <strong>Name:</strong> {selectedSupplier.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedSupplier.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedSupplier.phone}
            </p>
            <p>
              <strong>Status:</strong> {selectedSupplier.status}
            </p>
            <p>
              <strong>Bio:</strong> {selectedSupplier.bio}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierVerification;

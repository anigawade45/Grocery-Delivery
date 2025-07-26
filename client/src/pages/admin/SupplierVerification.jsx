import React, { useState } from "react";
import { Download, Eye } from "lucide-react";

const sampleSuppliers = [
  {
    id: 1,
    name: "Ramesh Gupta",
    email: "ramesh@vendor.com",
    phone: "9876543210",
    status: "Pending",
    documents: ["GST Certificate", "PAN Card"],
  },
  {
    id: 2,
    name: "Sita Traders",
    email: "sita@vendor.com",
    phone: "9123456780",
    status: "Approved",
    documents: ["Aadhar Card", "FSSAI License"],
  },
  {
    id: 3,
    name: "Kumar Foods",
    email: "kumar@vendor.com",
    phone: "9988776655",
    status: "Rejected",
    documents: ["Trade License"],
  },
];

const SupplierVerification = () => {
  const [suppliers, setSuppliers] = useState(sampleSuppliers);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleStatusChange = (id, newStatus) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const filteredSuppliers = suppliers.filter((s) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus === "" || s.status === filterStatus)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-orange-700 mb-4">
        Supplier Verification
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/4"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow-sm">
          <thead className="bg-orange-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Documents</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((s) => (
              <tr key={s.id} className="border-t hover:bg-orange-50">
                <td className="px-4 py-2 font-medium">{s.name}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2">{s.phone}</td>
                <td className="px-4 py-2 space-x-2">
                  {s.documents.map((doc, i) => (
                    <button
                      key={i}
                      className="inline-flex items-center text-sm text-blue-600 hover:underline"
                    >
                      <Download className="w-4 h-4 mr-1" /> {doc}
                    </button>
                  ))}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      s.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : s.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleStatusChange(s.id, "Approved")}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(s.id, "Rejected")}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    className="px-2 py-1 text-orange-600 hover:text-orange-800"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierVerification;

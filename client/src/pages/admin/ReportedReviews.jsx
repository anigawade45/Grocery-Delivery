import React, { useState } from "react";

const mockReviews = [
  {
    id: "r1",
    user: "Anjali Sharma",
    vendor: "Mumbai Snacks",
    content: "Found a foreign object in the food.",
    rating: 1,
    date: "2025-07-15",
    status: "Pending",
  },
  {
    id: "r2",
    user: "Rahul Verma",
    vendor: "Chaat King",
    content: "Rude behavior by staff.",
    rating: 2,
    date: "2025-07-20",
    status: "Resolved",
  },
  {
    id: "r3",
    user: "Priya Mehta",
    vendor: "Desi Dosa",
    content: "Food was stale and overpriced.",
    rating: 1,
    date: "2025-07-22",
    status: "Pending",
  },
];

const ReportedReviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleAction = (id, newStatus) => {
    alert(`Review ${id} marked as ${newStatus}`);
  };

  const filteredReviews = mockReviews.filter((r) => {
    const matchesSearch =
      r.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-orange-700 mb-6">
        📝 Reported Reviews
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by user or vendor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-44"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Content</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm">
            {filteredReviews.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No matching reviews found.
                </td>
              </tr>
            ) : (
              filteredReviews.map((review) => (
                <tr key={review.id} className="border-t">
                  <td className="px-4 py-3">{review.user}</td>
                  <td className="px-4 py-3">{review.vendor}</td>
                  <td className="px-4 py-3 line-clamp-2">{review.content}</td>
                  <td className="px-4 py-3">{review.rating}⭐</td>
                  <td className="px-4 py-3">{review.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        review.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {review.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleAction(review.id, "Resolved")}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Mark Resolved
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
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

export default ReportedReviews;

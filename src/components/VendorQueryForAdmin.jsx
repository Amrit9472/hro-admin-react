
import React, { useEffect, useState } from 'react';
import {
  getAllQueryForAdminPage,
  updateVendorQueryStatus,
  getAllStatuses,
} from '../components/services/RaiseQueryService';

const VendorQueryForAdmin = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    Promise.all([getAllQueryForAdminPage(), getAllStatuses()])
      .then(([queryResponse, statusResponse]) => {
        setQueries(queryResponse.data);
        setStatusOptions(statusResponse.data);
        setLoading(false);
        console.log("queryResponse.data" ,queryResponse.data)
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setSelectedStatuses((prev) => ({
      ...prev,
      [id]: newStatus,
    }));
  };

  const handleRemarkChange = (id, newRemark) => {
    setRemarks((prev) => ({
      ...prev,
      [id]: newRemark,
    }));
  };

  const handleSubmit = (id) => {
    const newStatus = selectedStatuses[id];
    const remark = remarks[id] || "";

    if (!newStatus) {
      alert('Please select a status before submitting.');
      return;
    }

    const payload = {
      vendorQueryStatus: newStatus,
      remark: remark,
    };

    updateVendorQueryStatus(id, payload)
      .then(() => {
        const updatedQueries = queries.map((query) =>
          query.id === id
            ? { ...query, vendorQueryStatus: newStatus }
            : query
        );
        setQueries(updatedQueries);
        setSelectedStatuses((prev) => ({ ...prev, [id]: "" }));
        setRemarks((prev) => ({ ...prev, [id]: "" }));
      })
      .catch((error) => {
        console.error('Update failed:', error);
        alert('Failed to update status');
      });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Query</th>
            <th>Current Status</th>
           
            <th>In Progress</th>
            <th>Closed</th>
             <th>New Status</th>
             <th>Remark</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((query) => {
            const isClosed = query.vendorQueryStatus === 'CLOSED';
            return (
            <tr key={query.id}>
              <td>{query.id}</td>
              <td>{query.vendorEmail}</td>
              <td>{query.queryText}</td>
              <td>{query.vendorQueryStatus}</td>
              <td>{query.inProgressRemark}</td>
              <td>{query.closedRemarks}</td>
              <td>
                <select
                  value={selectedStatuses[query.id] || ""}
                  onChange={(e) => handleStatusChange(query.id, e.target.value)}
                disabled={isClosed}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Enter remark"
                  value={remarks[query.id] || ""}
                  onChange={(e) => handleRemarkChange(query.id, e.target.value)}
                  disabled={isClosed}
                />
              </td>
              <td>
                <button
                  onClick={() => handleSubmit(query.id)}
                  // disabled={!selectedStatuses[query.id]}
                   disabled={isClosed || !selectedStatuses[query.id]} 
                >
                  Submit
                </button>
              </td>
            </tr>
          );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VendorQueryForAdmin;

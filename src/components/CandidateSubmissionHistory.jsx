// CandidateSubmissionHistory.jsx
import React, { useState } from "react";
import { getCandidatesByDateRange, getManagerStatusByEmail } from "./services/RaiseQueryService.js";
import { useAuth } from './AuthProvider';

function CandidateSubmissionHistory() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const { vendorUser } = auth;

  const fetchCandidatesByDateRange = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be later than end date.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getCandidatesByDateRange(startDate, endDate, vendorUser.email);

      const candidatesWithStatus = await Promise.all(
        response.map(async (candidate) => {
          const managerStatus = await getManagerStatusByEmail(candidate.candiEmail);
          return { ...candidate, managerStatus };
        })
      );

      setCandidates(candidatesWithStatus);

    } catch (err) {
      console.error("Failed to fetch candidates", err);
      setError("Failed to fetch candidates");
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Select Start Date:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Select End Date:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <button onClick={fetchCandidatesByDateRange} disabled={loading || !startDate || !endDate}>
        {loading ? "Loading..." : "Filter"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && candidates.length === 0 && <p>No candidates found.</p>}

      {candidates.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: "1rem", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Scheme</th>
              <th>Submitted Date</th>
              <th>Manager Status</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>{candidate.candiName}</td>
                <td>{candidate.candiEmail}</td>
                <td>{candidate.candiMobile}</td>
                <td>{candidate.scheme}</td>
                <td>{new Date(candidate.submittedDate).toLocaleString()}</td>
                <td>{candidate.managerStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CandidateSubmissionHistory;

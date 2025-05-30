import React, { useState, useEffect } from "react";
import { useAuth } from './AuthProvider';
import { submitQuery, getCandidatesByVendorEmail } from "./services/RaiseQueryService.js";

function RaiseQuery() {
  const [isTextareaVisible, setTextareaVisible] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [queries, setQueries] = useState([]);
  const auth = useAuth();
  const { vendorUser } = auth;

  const toggleTextareaVisibility = () => {
    setTextareaVisible((prevState) => !prevState);
    setSuccessMessage(null);
  };

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (!textareaValue) {
      setError("Please enter a query before submitting.");
      return;
    }

    try {
      const response = await submitQuery(vendorUser.email, textareaValue);
      setSuccessMessage("Query submitted successfully!");
      setTextareaValue("");
      setTextareaVisible(false);
      setError(null);
      fetchQueries(); // Refresh the query list after submission
    } catch (err) {
      setError("Failed to submit the query. Please try again.");
    }
  };

  const fetchQueries = async () => {
    if (!vendorUser || !vendorUser.email) return;

    try {
      const response = await getCandidatesByVendorEmail(vendorUser.email);
      setQueries(response);
      setError(null);
    } catch (err) {
      setError("Failed to fetch queries. Please try again.");
      setQueries([]);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [vendorUser]);

  return (
    <div>
      {/* Toggle Query Textarea */}
      <button onClick={toggleTextareaVisibility} style={{ marginBottom: "1rem" }}>
        {isTextareaVisible ? "Hide Textarea" : "Add Query"}
      </button>

      {/* Refresh Button
      <button onClick={fetchQueries} style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
        Refresh Queries
      </button> */}

      {/* Query Submission Textarea */}
      {isTextareaVisible && (
        <div style={{ marginBottom: "1rem" }}>
          <textarea
            value={textareaValue}
            onChange={handleTextareaChange}
            rows="4"
            cols="50"
            placeholder="Enter your query here..."
          />
          <br />
          <button onClick={handleSubmit}>Submit Query</button>
        </div>
      )}

      {/* Feedback Messages */}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Query Table */}
      {queries.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: "1rem", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Query</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query, index) => (
              <tr key={query.id}>
                <td>{index + 1}</td>
                <td>{query.queryText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p></p>
    </div>
  );
}

export default RaiseQuery;

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Detailedvendor from "./Detailedvendor";
import { postCandidatesDetails } from "./services/CandidatesService.js"; 
import "./css/WelcomePage.css";
import { useAuth } from './AuthProvider';
import RaiseQuery from "./RaiseQuery";
import CandidateSubmissionHistory from "./CandidateSubmissionHistory.jsx";  // Import the component

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateMobile = (number) => /^[1-9][0-9]{9}$/.test(number);

function WelcomePage() {
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showDetailedVendor, setShowDetailedVendor] = useState(false);
  const [showRaiseQuery, setShowRaiseQuery] = useState(false);
  const [showCandidateSubmissionHistory, setShowCandidateSubmissionHistory] = useState(false);  // New state for submission history
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [rows, setRows] = useState([{ name: "", mobile: "", email: "", scheme: "" }]);
  const [detailedKey, setDetailedKey] = useState(0);
  const [raiseQueryKey, setRaiseQueryKey] = useState(0);
  const auth = useAuth();

  // Extract vendorUser from auth
  const { vendorUser } = auth;

  const schemes = ["Scheme 1", "Scheme 2", "Scheme 3"];

  // Handlers to toggle views
  const handleSingleClick = () => {
    setShowBulkUpload(false);
    setShowDetailedVendor(false);
    setShowCandidateSubmissionHistory(false);  // Hide submission history
    setSelectedFile(null);
    setShowRaiseQuery(false);
    setPreviewData([]);
  };

  const handleBulkClick = () => {
    setShowBulkUpload(true);
    setShowDetailedVendor(false);
    setShowCandidateSubmissionHistory(false);  // Hide submission history
    setSelectedFile(null);
    setShowRaiseQuery(false);
    setPreviewData([]);
  };

  const handleDetailedVendorClick = () => {
    setShowDetailedVendor(true);
    setShowBulkUpload(false);
    setShowCandidateSubmissionHistory(false);  // Hide submission history
    setShowRaiseQuery(false);
    setSelectedFile(null);
    setPreviewData([]);
  };

  const handleRaiseQueryClick = () => {
    setShowRaiseQuery(true);
    setShowBulkUpload(false);
    setShowDetailedVendor(false);
    setShowCandidateSubmissionHistory(false);  // Hide submission history
    setSelectedFile(null);
    setPreviewData([]);
    setRaiseQueryKey((prev) => prev + 1); // reset RaiseQuery component if needed
  };

  const handleBackToUpload = () => {
    setShowDetailedVendor(false);
    setShowBulkUpload(false);
    setShowRaiseQuery(false);
    setShowCandidateSubmissionHistory(false);  // Hide submission history
    setSelectedFile(null);
    setPreviewData([]);
  };

  // New Handler for "Candidate Submission History" Button
  const handleCandidateSubmissionHistoryClick = () => {
    setShowCandidateSubmissionHistory(true);  // Show the Candidate Submission History section
    setShowBulkUpload(false);
    setShowDetailedVendor(false);
    setShowRaiseQuery(false);
  };

  // Logout handler
  const handleLogout = () => {
    window.location.href = "/vendorLogin"; // Adjust based on your routing
  };

  // File selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPreviewData([]);
  };

  // Preview Excel content
  const handlePreview = () => {
    if (!selectedFile) {
      alert("Please choose a file to preview.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      setPreviewData(json);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  // Download template Excel file
  const handleDownloadFormat = () => {
    const worksheetData = [["candiName", "candiMobile", "candiEmail", "scheme"], ["", "", "", ""]];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Candidate_Bulk_Upload_Template.xlsx");
  };

  // Form rows management for single upload
  const handleAddRow = () => {
    setRows([...rows, { name: "", mobile: "", email: "", scheme: "" }]);
  };

  const handleRemoveRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index][name] = value;
    setRows(updatedRows);
  };

  // Single form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.name || !row.email || !row.mobile || !row.scheme) {
        alert("Please fill out all fields.");
        return;
      }
      if (!validateEmail(row.email)) {
        alert("Invalid email format.");
        return;
      }
      if (!validateMobile(row.mobile)) {
        alert("Mobile number must be a 10-digit number.");
        return;
      }
      if (!schemes.includes(row.scheme)) {
        alert("Invalid scheme. Please select a valid scheme (Scheme 1, Scheme 2, or Scheme 3).");
        return;
      }
    }

    const payload = rows.map((row) => ({
      candiName: row.name,
      candiMobile: row.mobile,
      candiEmail: row.email,
      scheme: row.scheme,
      vendorEmail: vendorUser.email,
    }));

    try {
      const response = await postCandidatesDetails(payload);
      console.log("Single form submission successful:", response);
      alert("Vendor data submitted successfully!");
      setRows([{ name: "", mobile: "", email: "", scheme: "" }]);
    } catch (error) {
      console.error("Error submitting vendor data:", error);
      alert("There was an error submitting the data. Please try again.");
    }
  };

  // Handle bulk upload button click
  const handleUpload = () => {
    if (selectedFile) {
      handleBulkUpload();
    } else {
      alert("Please choose a file first.");
    }
  };

  // Actual bulk upload function reading file and posting data
  const handleBulkUpload = async () => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      // Check for null or empty values in each row
      const normalizedData = jsonData.map((row, index) => {
        const candiName = row.candiName || row.Name || row.name || "";
        const candiMobile = row.candiMobile || row.Mobile || row.mobile || "";
        const candiEmail = row.candiEmail || row.Email || row.email || "";
        const scheme = row.scheme || "";

        // If any of the critical fields are missing or invalid, skip the row
        if (!candiName || !candiMobile || !candiEmail || !scheme) {
          alert(`Row ${index + 1} has missing required fields. Please correct it. Remaining rows will be uploaded.`);
          return null;
        }

        return {
          candiName,
          candiMobile,
          candiEmail,
          scheme,
          vendorEmail: vendorUser.email,
        };
      }).filter(row => row !== null); // Remove invalid rows

      // Validation for email, mobile, and scheme
      for (let i = 0; i < normalizedData.length; i++) {
        const row = normalizedData[i];
        if (!validateEmail(row.candiEmail) || !validateMobile(row.candiMobile)) {
          alert(`Row ${i + 1} has invalid data. Please correct it.`);
          return;
        }
        if (!schemes.includes(row.scheme)) {
          alert(`Row ${i + 1} has an invalid scheme. Please select a valid scheme (Scheme 1, Scheme 2, or Scheme 3).`);
          return;
        }
      }

      // If all data is valid, proceed with upload
      try {
        const response = await postCandidatesDetails(normalizedData);
        console.log("Bulk upload successful:", response);
        alert("Bulk upload successful.");
        setSelectedFile(null);
        setPreviewData([]);
      document.querySelector('input[type="file"]').value = "";
      } catch (error) {
        console.error("Error uploading data:", error);
        alert("Error uploading data. Please try again.");
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div className="welcome-page-container" style={{ position: "relative" }}>
      {/* Logout button at top-right */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button className="btn btn-outline-success" type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="sidebar">
        {vendorUser && (
          <div style={{ padding: "10px", marginBottom: "15px", marginLeft: "20px" }}>
            <strong>Welcome, {vendorUser.name}</strong> | {vendorUser.email}
          </div>
        )}
        <button onClick={handleSingleClick}>Single Candidate Alignment</button>
        <button onClick={handleBulkClick}>Bulk Candidate Alignment</button>
        <button onClick={handleDetailedVendorClick}>Detailed Vendor</button>
        <button onClick={handleCandidateSubmissionHistoryClick}>Candidate Submission History</button>
        <button onClick={handleRaiseQueryClick}>Raise Query</button>
      </div>

      <div className="main-content2">
        <div className="form-container">
          {showDetailedVendor ? (
            <>
              <h2>Detailed Vendor Information</h2>
              <Detailedvendor />
              <button type="button" onClick={handleBackToUpload}>
                Back to Upload Options
              </button>
            </>
          ) : showBulkUpload ? (
            <>
              <h2>Bulk Candidate Alignment</h2>
              <button type="button" onClick={handleDownloadFormat}>
                Download Format
              </button>
              <p></p>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={handleUpload}>
                  Upload
                </button>
                <button type="button" onClick={handlePreview}>
                  Preview
                </button>
              </div>
              {selectedFile && <p>Selected File: {selectedFile.name}</p>}

              {previewData.length > 0 && (
                <>
                  <h3>Preview Data:</h3>
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(previewData[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, idx) => (
                            <td key={idx}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          ) : showRaiseQuery ? (
            <>
              <h2>Raise Query</h2>
              <RaiseQuery key={raiseQueryKey} />
              <button type="button" onClick={handleBackToUpload}>
                Back to Upload Options
              </button>
            </>
          ) : showCandidateSubmissionHistory ? (  // Add conditional rendering for submission history
            <>
              <h2>Candidate Submission History</h2>
              <CandidateSubmissionHistory /> {/* Render the Candidate Submission History component */}
              <button type="button" onClick={handleBackToUpload}>
                Back to Upload Options
              </button>
            </>
          ) : (
            <>
              <h2>Single Candidate Alignment</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-rows">
                  {rows.map((row, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={row.name}
                        onChange={(e) => handleChange(e, index)}
                      />
                      <input
                        type="text"
                        name="mobile"
                        placeholder="Mobile"
                        value={row.mobile}
                        onChange={(e) => handleChange(e, index)}
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={row.email}
                        onChange={(e) => handleChange(e, index)}
                      />
                      <select
                        name="scheme"
                        value={row.scheme}
                        onChange={(e) => handleChange(e, index)}
                      >
                        <option value="">Select Scheme</option>
                        {schemes.map((scheme, idx) => (
                          <option key={idx} value={scheme}>
                            {scheme}
                          </option>
                        ))}
                      </select>
                      {rows.length > 1 && (
                        <button type="button" onClick={() => handleRemoveRow(index)}>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <pre>
                    <button type="button" onClick={handleAddRow}>
                      + Add Row
                    </button>
                  </pre>
                  <button type="submit" className="submit-btn">
                    Submit
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
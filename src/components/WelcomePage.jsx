import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Detailedvendor from "./Detailedvendor";
import { postCandidatesDetails } from "./services/CandidatesService.js"; 
import "./css/WelcomePage.css";
import { useAuth } from './AuthProvider';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateMobile = (number) => /^[1-9][0-9]{9}$/.test(number);

function WelcomePage() {
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showDetailedVendor, setShowDetailedVendor] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [rows, setRows] = useState([{ name: "", mobile: "", email: "" }]);
  const [detailedKey, setDetailedKey] = useState(0);
  const [raiseQueryKey, setRaiseQueryKey] = useState(0);
  const auth = useAuth();

  // Handlers to toggle views
  const handleSingleClick = () => {
    setShowBulkUpload(false);
    setShowDetailedVendor(false);
    setSelectedFile(null);
    setPreviewData([]);
  };

  const handleBulkClick = () => {
    setShowBulkUpload(true);
    setShowDetailedVendor(false);
    setSelectedFile(null);
    setPreviewData([]);
  };

  const handleDetailedVendorClick = () => {
    setShowDetailedVendor(true);
    setShowBulkUpload(false);
    setSelectedFile(null);
    setPreviewData([]);
  };

  const handleBackToUpload = () => {
    setShowDetailedVendor(false);
    setShowBulkUpload(false);
    setSelectedFile(null);
    setPreviewData([]);
  };

   // Logout handler (navigate to LoginService.jsx - adjust as needed)
  const handleLogout = () => {
    // Replace below line with your actual routing/navigation logic:
    window.location.href = "/vendorLogin"; // or however you route to LoginService
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
    const worksheetData = [["candiName", "candiMobile", "candiEmail"], ["", "", ""]];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Candidate_Bulk_Upload_Template.xlsx");
  };

  // Form rows management for single upload
  const handleAddRow = () => {
    setRows([...rows, { name: "", mobile: "", email: "" }]);
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
      if (!row.name || !row.email || !row.mobile) {
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
    }

    const payload = rows.map((row) => ({
      candiName: row.name,
      candiMobile: row.mobile,
      candiEmail: row.email,
    }));

    try {
      // You can add a new service method for single upload or use bulkUploadCandidates for simplicity
      const response = await postCandidatesDetails(payload);
      console.log("Single form submission successful:", response);
      alert("Vendor data submitted successfully!");
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

      const normalizedData = jsonData.map((row) => ({
        candiName: row.candiName || row.Name || row.name || "",
        candiMobile: row.candiMobile || row.Mobile || row.mobile || "",
        candiEmail: row.candiEmail || row.Email || row.email || "",
      }));

      for (let i = 0; i < normalizedData.length; i++) {
        const row = normalizedData[i];
        if (!validateEmail(row.candiEmail) || !validateMobile(row.candiMobile)) {
          alert(`Row ${i + 1} has invalid data. Please correct it.`);
          return;
        }
      }

      try {
        const response = await postCandidatesDetails(normalizedData);
        console.log("Bulk upload successful:", response);
        alert("Bulk upload successful.");
      } catch (error) {
        console.error("Error uploading data:", error);
        alert("Error uploading data. Please try again.");
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    // <div className="welcome-page-container">
        <div className="welcome-page-container" style={{ position: "relative" }}>
      {/* Logout button at top-right with inline styles */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "20px",
          zIndex: 1000,
        }}
      >
                <button className="btn btn-outline-success" type="button" onClick={() => auth.logoutVendor()}>
                Logout
            </button>

        {/* <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button> */}
      </div>


      <div className="sidebar">
        <button onClick={handleSingleClick}>Single Upload</button>
        <button onClick={handleBulkClick}>Bulk Upload</button>
        <button onClick={handleDetailedVendorClick}>Detailed Vendor</button>
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
              <h2>Bulk Upload</h2>
              <button type="button" onClick={handleDownloadFormat}>
                Download Format
              </button>
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
          ) : (
            <>
              <h2>Single Upload</h2>
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

import React, { useState, useEffect } from "react";
import { getVendorNameByEmail } from "../components/services/EmployeeService";
const AdditionalDetailsComponent = ({
  formData,
  errors,
  handleSourceChange,
  handleChange,
  handleSubSourceChange,

  isDeclarationChecked,
  setIsDeclarationChecked,
  // handleFileChange
}) => {
  const [vendorName, setVendorName] = useState("");

  useEffect(() => {
    const fetchVendorName = async () => {
      if (formData.source === "Vendor" && formData.email) {
        try {
          const response = await getVendorNameByEmail(formData.email);
          const vendor = response.data || "no vendor";
          setVendorName(vendor); // optional, if you still want to keep vendorName state
          handleChange("subSource", vendor); // auto-fill subSource
        } catch (error) {
          setVendorName("");
          handleChange("subSource", "no vendor"); // fallback default value
          console.error("Vendor not found", error.message);
          alert(`Error: ${error.message}`);
        }
      }
    };
    fetchVendorName();
  }, [formData.source, formData.email]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card p-2">
            <h2 className="text-center" style={{ color: 'darkgoldenrod' }}>Additional Details</h2>
            <form style={{ maxWidth: '600px' }}>
              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Permanent Address</strong></label>
                  {errors.permanentAddress && (
                    <span className="text-danger small">
                      {errors.permanentAddress}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Enter Permanent Address"
                  className={`form-control ${errors.permanentAddress ? "is-invalid" : ""
                    }`}
                  value={formData.permanentAddress}
                  onChange={(e) =>
                    handleChange("permanentAddress", e.target.value)
                  }
                />
              </div>
              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Current Address</strong></label>
                  {errors.currentAddress && (
                    <span className="text-danger">
                      {errors.currentAddress}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Enter Current Address"
                  className={`form-control ${errors.currentAddress ? "is-invalid" : ""
                    }`}
                  value={formData.currentAddress}
                  onChange={(e) =>
                    handleChange("currentAddress", e.target.value)
                  }
                />
              </div>

              <div className="md-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Aadhaar Number No</strong></label>
                  {errors.aadhaarNumber && (
                    <span className="text-danger small">{errors.aadhaarNumber}</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Enter Aadhar No"
                  className={`form-control ${errors.aadhaarNumber ? "is-invalid" : ""
                    }`}
                  value={formData.aadhaarNumber}
                  onChange={(e) =>
                    handleChange("aadhaarNumber", e.target.value)
                  }
                />

              </div>


              <div className="md-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Aadhar upload</strong></label>
                  {errors.aadhar && (
                    <span className="text-danger small">{errors.aadhar}</span>
                  )}
                </div>
                <input
                  type="file"
                  id="image"
                  placeholder="select your Aadhar File"
                  className={`form-control ${errors.aadhar ? "is-invalid" : ""}`}
                  onChange={(e) => handleChange("aadhar", e.target.files[0])}
                />
              </div>


              <div className="md-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Passport Size Image </strong></label>
                  {errors.passport && (
                    <span className="text-danger small">{errors.passport}</span>
                  )}
                </div>
                <input
                  type="file"
                  id="image"
                  placeholder="select your Passport File"
                  className={`form-control ${errors.passport ? "is-invalid" : ""}`}
                  onChange={(e) => handleChange("passport", e.target.files[0])}
                />
              </div>

              <div className="md-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Applied location for</strong></label>
                  {errors.appliedLocation && (
                    <span className="text-danger small">
                      {errors.appliedLocation}
                    </span>
                  )}
                </div>
                <select
                  className={`form-control ${errors.appliedLocation ? "is-invalid" : ""}`}
                  value={formData.appliedLocation}
                  onChange={(e) => handleChange("appliedLocation", e.target.value)}
                >
                  <option value="" disabled>Select an Applied Location</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Noida">Noida</option>
                  <option value="Bangaluru">Bangaluru</option>
                  {/* Add more options as needed */}
                </select>
              </div>



              <div className="md-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Reference</strong></label>
                  {errors.refferal && (
                    <span className="text-danger">{errors.refferal}</span>
                  )}
                </div>
                <select
                  className={`form-control ${errors.refferal ? "is-invalid" : ""}`}
                  value={formData.refferal}
                  onChange={(e) => handleChange("refferal", e.target.value)}
                >
                  <option value="" disabled>Select Yes or No</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

              </div>
              {formData.refferal === "Yes" && (
                <>
                  <div className="md-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label"><strong>Source</strong></label>
                      {errors.source && <span className="text-danger">{errors.source}</span>}

                    </div>
                    <select
                      className={`form-control ${errors.source ? "is-invalid" : ""}`}
                      value={formData.source}
                      onChange={handleSourceChange}
                    >
                      <option value="" disabled>Select Source</option>
                      <option value="Vendor">Vendor</option>
                      <option value="Emp Ref">Employee Reference</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Portal">Portal</option>
                      <option value="NGO">NGO</option>
                      <option value="Campus">Campus</option>
                      {/* <option value="Walk In">Walk In</option> */}
                    </select>
                  </div>
                  {formData.source === "Vendor" && (
                    <div className="md-2">
                      <label className="form-label"><strong>Sub Source</strong></label>
                      <input
                        type="text"
                        className="form-control"
                        name="subSource"
                        value={formData.subSource}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  {formData.source === "Social Media" && (
                    <div className="md-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label"><strong>Social Media Platform</strong></label>
                        {errors.subSource && <span className="text-danger">{errors.subSource}</span>}

                      </div>
                      <select
                        className={`form-control ${errors.subSource ? "is-invalid" : ""}`}
                        value={formData.subSource}
                        onChange={handleSubSourceChange}
                      >
                        <option value="" disabled>Select Platform</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Twitter">Twitter</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Telegram">Telegram</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  )}

                  {formData.source !== "Social Media" && formData.source  !== "Vendor" && (
                    <div className="md-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label"><strong>Sub Source</strong></label>
                        {errors.subSource && <span className="text-danger">{errors.subSource}</span>}

                      </div>
                      <input
                        type="text"
                        placeholder={`Enter ${formData.source} Details`}
                        className={`form-control ${errors.subSource ? "is-invalid" : ""}`}
                        value={formData.subSource}
                        onChange={handleSubSourceChange}
                      />
                    </div>
                  )}

                </>
              )}
              {/* </div> */}
              {/* Declaration checkbox */}
              <br></br>
              <div className="md-2">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={isDeclarationChecked}
                  onChange={(e) => setIsDeclarationChecked(e.target.checked)}
                />
                <label htmlFor="declaration" className="form-check-label">
                  I declare that the information provided is true and correct.
                </label>
                {errors.declaration && <div className="invalid-feedback">{errors.declaration}</div>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalDetailsComponent;

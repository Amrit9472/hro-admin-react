import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const PersonalDetailsComponent = ({
  formData,
  errors,
  handleChange,
}) => {

  return (
    <div className="container" >
      <div class="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card p-2">
            <h2 className="text-center" style={{ color: 'darkgoldenrod' }}>Personal Details</h2>

            <form style={{ maxWidth: '600px' }}>
              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Full Name</strong></label>
                  {errors.fullName && (
                    <span className="text-danger small">{errors.fullName}</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Enter your Full Name As per Aadhaar Card"
                  className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
              </div>
              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Email</strong></label>
                  {errors.email && (
                    <span className="text-danger small">{errors.email}</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Enter Email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />

              </div>
              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Mobile No</strong></label>
                  {errors.mobileNo && (
                    <span className="text-danger small">{errors.mobileNo}</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Enter Mobile Number"
                  className={`form-control ${errors.mobileNo ? "is-invalid" : ""
                    }`}
                  value={formData.mobileNo}
                  onChange={(e) => handleChange("mobileNo", e.target.value)}
                />

              </div>
              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Gender</strong></label>
                  {errors.gender && (
                    <span className="text-danger small">{errors.gender}</span>
                  )}
                </div>
                <select
                  className={`form-control ${errors.gender ? "is-invalid" : ""
                    }`}
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="TRANSGENDER">TRANSGENDER</option>
                </select>

              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Date of Birth</strong></label>
                  {errors.dob && <span className="text-danger small ">{errors.dob}</span>}
                  <br></br>
                </div>
                <DatePicker
                  selected={formData.dob ? new Date(formData.dob) : null}
                  onChange={(date) => handleChange("dob", date.toISOString().split('T')[0])}
                  className="form-control"
                  placeholderText="Select Dob"
                  dateFormat="MM/dd/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  yearDropdownItemNumber={100} // Add this prop to show 100 year options
                  dropdownMode="select"
                  placeholder="select dob"
                />
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Marital Status</strong></label>
                  {errors.maritalStatus && (
                    <span className="text-danger small">{errors.maritalStatus}</span>
                  )}
                </div>
                <select
                  className={`form-control ${errors.maritalStatus ? "is-invalid" : ""
                    }`}
                  value={formData.maritalStatus}
                  onChange={(e) => handleChange("maritalStatus", e.target.value)}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorce">Divorce</option>
                </select>

              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PersonalDetailsComponent;

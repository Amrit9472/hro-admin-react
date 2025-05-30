import React from "react";
import {boards10th,streams12th,graduateDegrees,postgraduateDegrees, diplomaOptions,phdOptions} from '../components/services/educationData.js'
const EducationalDetailsComponent = ({ formData, errors, handleChange, selectedLanguages, handleLanguageChange }) => {
  const availableLanguages = ["English",
    "Hindi",
    "Tamil",
    "Bengali",
    "Telugu",
    "Marathi",
    "Other"];

   const getDropdownOptions = () => {
    switch(formData.qualification) {
      case "10":
        return boards10th;
      case "12":
        return streams12th;
      case "graduate":
        return graduateDegrees;
      case "postgraduate":
        return postgraduateDegrees;
      case "diploma":
      case "diploma ":
        return diplomaOptions;
      case "doctorate":
      case "phd":
        return phdOptions;
      default:
        return [];
    }
  };

  // Label text depending on qualification
  const getLabelText = () => {
    switch(formData.qualification) {
      case "10":
        return "Board";
      case "12":
        return "Stream";
      case "graduate":
      case "postgraduate":
      case "diploma":
      case "doctorate":
      case "phd":
        return "Stream | Branch";
      default:
        return "Stream | Branch";
    }
  };

  const dropdownOptions = getDropdownOptions();
  const labelText = getLabelText();
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card p-2">
            <h2 className="text-center" >Educational Details</h2>
            <form style={{ maxWidth: '600px' }}>
              {/* <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Highest Qualification </strong></label>
                  {errors.qualification && (
                    <span className="text-danger small">{errors.qualification}</span>
                  )}
                </div>

                <select
                  className={`form-control ${errors.qualification ? "is-invalid" : ""}`}
                  value={formData.qualification}
                  onChange={(e) => handleChange("qualification", e.target.value)}
                >
                  <option value="" disabled>Select your qualification</option> 
                  <option value="10">10th</option>
                  <option value="12">12th</option>
                  <option value="graduate">Graduate</option>
                  <option value="postgraduate">Postgraduate</option>
                  <option value="doctorate">Doctorate</option>
                  <option value="diploma ">Diploma</option>
                  <option value="other">Other</option>
                </select>
              </div> */}
  <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Highest Qualification </strong></label>
                  {errors.qualification && (
                    <span className="text-danger small">{errors.qualification}</span>
                  )}
                </div>

                <select
                  className={`form-control ${errors.qualification ? "is-invalid" : ""}`}
                  value={formData.qualification}
                  onChange={(e) => handleChange("qualification", e.target.value)}
                >
                  <option value="" disabled>Select your qualification</option>
                  <option value="10">10th</option>
                  <option value="12">12th</option>
                  <option value="graduate">Graduate</option>
                  <option value="postgraduate">Postgraduate</option>
                  <option value="doctorate">Doctorate</option>
                  <option value="diploma">Diploma</option>
                  {/* <option value="other">Other</option> */}
                </select>
              </div>

              {/* Stream / Board dropdown (or input if no options) */}
              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>{labelText}</strong></label>
                  {errors.stream && (
                    <span className="text-danger small">{errors.stream}</span>
                  )}
                </div>

                {dropdownOptions.length > 0 ? (
                  <select
                    className={`form-control ${errors.stream ? "is-invalid" : ""}`}
                    value={formData.stream}
                    onChange={(e) => handleChange("stream", e.target.value)}
                  >
                    <option value="" disabled>{`Select your ${labelText}`}</option>
                    {dropdownOptions.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter your Education Stream / Branch"
                    className={`form-control ${errors.stream ? "is-invalid" : ""}`}
                    value={formData.stream}
                    onChange={(e) => handleChange("stream", e.target.value)}
                  />
                )}
              </div>


              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Work Experience</strong></label>
                  {errors.workExp && (
                    <span className="text-danger">
                      {errors.workExp}
                    </span>
                  )}
                </div>
                <select
                  className={`form-control ${errors.workExp ? "is-invalid" : ""}`}
                  value={formData.workExp}
                  onChange={(e) => handleChange("workExp", e.target.value)}
                >
                  <option value="" disabled>Select Work Experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Experience">Experience</option>
                  <option value="Experience in BPO">Experience in BPO</option>
                </select>

              </div>
              {(formData.workExp === "Experience" || formData.workExp === "Experience in BPO") && (
                <div className="form-group">
                  <div className="label-error-container">
                    <label className="form-label"><strong>Previous Organisation</strong></label>
                    {errors.previousOrganisation && (
                      <span className="text-danger">
                        {errors.previousOrganisation}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Previous Organisation"
                    className={`form-control ${errors.previousOrganisation ? "is-invalid" : ""
                      }`}
                    value={formData.previousOrganisation || ""}
                    onChange={(e) =>
                      handleChange("previousOrganisation", e.target.value)
                    }
                  />

                </div>
              )}

              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label"><strong>Total Experience</strong></label>
                  {errors.experience && (
                    <span className="text-danger">{errors.experience}</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Enter Total Experience"
                  className={`form-control ${errors.experience ? "is-invalid" : ""
                    }`}
                  value={formData.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                />

              </div>
            


              <div className="mb-3">
                {/* <label className="form-label"><strong>Languages Known</strong></label> */}

                {/* Header Row for the columns */}
                <div className="d-flex align-items-center mb-2">
                  <div style={{ width: '150px', flexShrink: 0 }}>{/* Adjust width as needed */}
                    <strong>Language Known</strong>
                  </div>
                  <div className="d-flex align-items-center">
                    <div style={{ width: '80px', flexShrink: 0 }} className="me-3"> {/* Adjust width and spacing */}
                      <strong>Read</strong>
                    </div>
                    <div style={{ width: '80px', flexShrink: 0 }}> {/* Adjust width */}
                      <strong>Write</strong>
                    </div>
                  </div>
                </div>

                {/* This is the container with fixed height and scrolling */}
                <div className="language-list-scroll" style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #dee2e6', padding: '10px', borderRadius: '0.25rem' }}>
                  {availableLanguages.map((language) => {
                    const selectedLang = selectedLanguages.find(lang => lang.languageName === language);
                    const isSelected = !!selectedLang;

                    return (
                      <div key={language} className="d-flex align-items-center mb-2"> {/* Use d-flex for the language row */}

                        {/* Main Language Checkbox and Label (acting as the "Language" column) */}
                        <div className="form-check d-flex align-items-center" style={{ width: '150px', flexShrink: 0 }}> {/* Match header width */}
                          <input
                            type="checkbox"
                            className="form-check-input me-2"
                            id={language}
                            checked={isSelected}
                            onChange={(e) => handleLanguageChange(language, 'mainCheckbox', e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor={language}>
                            {language}
                          </label>
                        </div>


                        {/* Read/Write Checkboxes (conditionally rendered, acting as the "Read" and "Write" columns) */}
                        <div className="d-flex align-items-center">
                          {/* Can Read Checkbox */}
                          <div className="form-check me-3" style={{ width: '80px', flexShrink: 0 }}> {/* Match header width and spacing */}
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`${language}-read`}
                              checked={isSelected && selectedLang.canRead} // Ensure checkboxes are only checked if language is selected
                              onChange={(e) => handleLanguageChange(language, 'canRead', e.target.checked)}
                              disabled={!isSelected} // Disable if language is not selected
                            />
                            <label className="form-check-label visually-hidden" htmlFor={`${language}-read`}>Can Read for {language}</label> {/* Add visually-hidden for accessibility */}
                          </div>

                          {/* Can Write Checkbox */}
                          <div className="form-check" style={{ width: '80px', flexShrink: 0 }}> {/* Match header width */}
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`${language}-write`}
                              checked={isSelected && selectedLang.canWrite} // Ensure checkboxes are only checked if language is selected
                              onChange={(e) => handleLanguageChange(language, 'canWrite', e.target.checked)}
                              disabled={!isSelected} // Disable if language is not selected
                            />
                            <label className="form-check-label visually-hidden" htmlFor={`${language}-write`}>Can Write for {language}</label> {/* Add visually-hidden for accessibility */}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalDetailsComponent;

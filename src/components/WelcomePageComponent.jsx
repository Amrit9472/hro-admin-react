import React from 'react';




const WelcomePageComponent = ({ onStart }) => {
    return (
        <div className="container my-0 p-2 bg-light rounded shadow-sm">
            <h1 className="text-center text-primary mb-2">Welcome to EOS Registration portal !</h1>
            <p className="lead mb-0 text-justify">
                Welcome to the Employee Registration Form. Please read the instructions below before you start filling out the form:
            </p>
            <ul className="list-unstyled"> 
                <li className="mb-2">
                    <div className="d-flex align-items-start">
                        <span className="text-danger me-2">*</span> 
                        <p className="mb-0">Please ensure you have all the necessary documents ready.</p> {/* mb-0 removes paragraph bottom margin */}
                    </div>
                </li>
                <li className="mb-2">
                    <div className="d-flex align-items-start">
                        <span className="text-danger me-2">*</span>
                        <p className="mb-0">Fill out all required fields accurately.</p>
                    </div>
                </li>
                <li className="mb-2">
                    <div className='d-flex align-items-start'>
                        <span className="text-danger me-2">*</span>
                        <p className="mb-0">In the "Total Experience" field, if you are a fresher, please type "0" (zero).</p>
                    </div>
                </li>
                <li className="mb-2">
                    <div className='d-flex align-items-start'>
                        <span className="text-danger me-2">*</span>
                        <p className="mb-0">Please enter your total experience in years only (e.g. 2, not 2.6) in the "Total Experience" field.</p>
                    </div>
                </li>
                <li className="mb-2">
                    <p className="mb-0">If you need help, refer to the guidelines provided in the form sections.</p>
                </li>

                <li className="mt-2 mb-3"> {/* Add margin-top for spacing before subsection */}
                    <h2 className="text-primary border-bottom pb-2 d-inline-block">Required Documents</h2> {/* border-bottom, pb-2 for padding-bottom, d-inline-block */}
                </li>
                <li className="mb-2">
                    <div className="d-flex align-items-start">
                        <span className="text-danger me-2">*</span>
                        <p className="mb-0">Aadhaar card picture</p>
                    </div>
                </li>
                <li className="mb-2">
                    <div className="d-flex align-items-start">
                        <span className="text-danger me-2">*</span>
                        <p className="mb-0">Aadhaar card picture (less than 2MB) - please upload backside of the Aadhaar card.</p>
                    </div>
                </li>
                <li className="mb-2">
                    <div className="d-flex align-items-start">
                        <span className="text-danger me-2">*</span>
                        <p className="mb-0">Aadhaar Number</p>
                    </div>
                </li>
                <li className="mb-2">
                    <div className="d-flex align-items-start">
                        <span className="text-danger me-2">*</span>
                        <p className="mb-0">Date of Birth</p>
                    </div>
                </li>
                <li className="mb-2">
                    <div className="d-flex align-items-start">
                        <span className="text-danger me-2">*</span>
                        <p className="mb-0">Educational Details</p>
                    </div>
                </li>
                <li className="mt-2 mb-2 text-center"> {/* Center the note */}
                    <p className="text-danger mb-0">Note: All fields marked with * are compulsory and must be filled out to proceed to the next page.</p>
                </li>
                <li className="mb-2 text-justify"> {/* Justify the text */}
                    <p className="mb-0">Once you have read and understood the above information, please click the "Next" button to proceed to the next page and fill out the form.</p>
                </li>
                <li className="mb-2 text-justify"> {/* Justify the text */}
                    <p className="mb-0">Before submitting the form, please ensure you have checked the "Terms and Conditions" checkbox, confirming that all the information provided by you is accurate and true.</p>
                </li>
            </ul>
        </div>
    );
};

export default WelcomePageComponent;
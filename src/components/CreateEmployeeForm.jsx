import React, { useState } from 'react';
import axios from 'axios';
import './CreateEmployeeForm.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import './CreateEmployeeForm.css';

const CreateEmployeeForm = () => {
    const [employee, setEmployee] = useState({
        fullName: '',
        email: '',
        qualification: '',
        mobileNo: '',
        permanentAddress: '',
        currentAddress: '',
        gender: '',
        previousOrganisation: '',
        workExp: '',
        dob: '',
        maritalStatus: '',
        refferal: '',
        aadhaarNumber: '',
        languages: '',
        experience: '',
        source: '',
        subSource: '',
    });

    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    // const [serverMessage, setServerMessage] = useState('');
    const availableLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
        setServerMessage('');
    };

    // const handleFileChange = (e) => {
    //     setImage(e.target.files[0]);
    // };


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const MAX_SIZE_MB = 2; 

        if (selectedFile) {
            console.log('Selected file:', selectedFile); 
            const fileSizeInMB = selectedFile.size / (1024 * 1024); 
            if (fileSizeInMB > MAX_SIZE_MB) {
                // setServerMessage('The selected file exceeds the maximum size limit of 2MB.');
                toast.error('The selected file exceeds the maximum size limit of 2MB.');
                setImage(null); 
            } else {
                setImage(selectedFile);
                // setServerMessage(''); 
            }
        } else {
            setImage(null); 
        }
    };
    const handleLanguageChange = (e) => {
        const { value, checked } = e.target;
        const selectedLanguages = employee.languages ? employee.languages.split(', ') : [];

        if (checked) {

            selectedLanguages.push(value);
        } else {

            const index = selectedLanguages.indexOf(value);
            if (index > -1) {
                selectedLanguages.splice(index, 1);
            }
        }


        setEmployee((prevState) => ({
            ...prevState,
            languages: selectedLanguages.join(', '),
        }));
    };

    const handleSourceChange = (e) => {
        const { value } = e.target;
        setEmployee((prevState) => ({
            ...prevState,
            source: value,
            subSource: '', 
        }));
    };

    const handleSubSourceChange = (e) => {
        const { value } = e.target;
        setEmployee((prevState) => ({
            ...prevState,
            subSource: value,
        }));
    };
/** 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); 
        setServerMessage(''); 

        const formData = new FormData();
        formData.append('employee', new Blob([JSON.stringify(employee)], { type: 'application/json' }));
        formData.append('image', image);

        console.log('Employee Data:', employee);  
        console.log('Image:', image); 

        try {
            const response = await axios.post('http://localhost:9091/api/employees/createEmployeeDetails', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
            toast.success('Employee created successfully!');
            console.log('Employee created successfully:', response.data);
            setEmployee({
                fullName: '',
                email: '',
                qualification: '',
                mobileNo: '',
                permanentAddress: '',
                currentAddress: '',
                gender: '',
                previousOrganisation: '',
                workExp: '',
                dob: '',
                maritalStatus: '',
                refferal: '',
                aadhaarNumber: '',
                languages: '',
                experience: '',
                source: '',
                subSource: '',
            });
            setImage(null);
            setErrors({});
        } catch (error) {
            console.log("error ----------->",error)
            if (error.response) {
                const errorObj = {};


                if (error.response.data && error.response.data.fieldErrors) {
                    const fieldErrors = error.response.data.fieldErrors;


                    fieldErrors.forEach(err => {
                        if (err.field === 'unknown') {

                            setServerMessage(err.message);
                            console.log("error----2" ,err.message)
                        }
                        errorObj[err.field] = err.message; 
                    });

                    setErrors(errorObj);
                }
            }  else if (error.message.includes("Request failed with status code 413")) {           
                setServerMessage('Uploaded file is too large. Please upload a smaller file.');
            } else {
                setServerMessage('An unexpected error occurred. Please try again later.');
            }
        }
    };

*/
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData();
        formData.append('employee', new Blob([JSON.stringify(employee)], { type: 'application/json' }));
        formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:9091/api/employees/createEmployeeDetails', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Employee created successfully!');
            setEmployee({
                fullName: '',
                email: '',
                qualification: '',
                mobileNo: '',
                permanentAddress: '',
                currentAddress: '',
                gender: '',
                previousOrganisation: '',
                workExp: '',
                dob: '',
                maritalStatus: '',
                refferal: '',
                aadhaarNumber: '',
                languages: '',
                experience: '',
                source: '',
                subSource: '',
            });
            setImage(null);
            setErrors({});
        } catch (error) {
            if (error.response) {
                const fieldErrors = error.response.data.fieldErrors || [];
                const errorObj = {};

                fieldErrors.forEach(err => {
                    errorObj[err.field] = err.message; 
                });
                setErrors(errorObj);

                if (fieldErrors.some(err => err.field === 'unknown')) {
                    toast.error(fieldErrors.find(err => err.field === 'unknown').message);
                }
            } else if (error.message.includes("Request failed with status code 413")) {
                toast.error('Uploaded file is too large. Please upload a smaller file.');
            } else {
                toast.error('An unexpected error occurred. Please try again later.');
            }
        }
    };
    return (
        <div className="create-employee-form">         
           {/* {serverMessage && ( 
                <div style={{ color: 'red', marginBottom: '20px' }}>
                    {serverMessage}
                </div>
            )} */}
            <ToastContainer/>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={employee.fullName}
                        onChange={handleChange}
                    />

                </div>
                    {errors.fullName && <div style={{ color: 'red' }}>{errors.fullName}</div>}                     
                <div className="form-group">
                <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        value={employee.email}
                        onChange={handleChange}
                    />
                </div>
                {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}  
                <div className="form-group">
                    <label>Mobile No</label>
                    <input
                        type="text"
                        name="mobileNo"
                        value={employee.mobileNo}
                        onChange={handleChange}
                    />
                    </div>
                    {errors.mobileNo && <div style={{ color: 'red' }}>{errors.mobileNo}</div>}

                <div className="form-group">
                    <label>Gender</label>
                    <select
                        name="gender"
                        value={employee.gender}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    </div>
                    {errors.gender && <div style={{ color: 'red' }}>{errors.gender}</div>}

                <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={employee.dob}
                        onChange={handleChange}
                    />
                     </div>
                    {errors.dob && <div style={{ color: 'red' }}>{errors.dob}</div>}


                <div className="form-group">
                    <label>Marital Status</label>
                    <select
                        name="maritalStatus"
                        value={employee.maritalStatus}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>

                    </select>
                    </div>
                    {errors.maritalStatus && <div style={{ color: 'red' }}>{errors.maritalStatus}</div>}

                <div className="form-group">
                    <label>Qualification</label>
                    <input
                        type="text"
                        name="qualification"
                        value={employee.qualification}
                        onChange={handleChange}
                    />
                    </div>
                    {errors.qualification && <div style={{ color: 'red' }}>{errors.qualification}</div>}


                <div className="form-group">
                    <label>Permanent Address</label>
                    <input
                        type="text"
                        name="permanentAddress"
                        value={employee.permanentAddress}
                        onChange={handleChange}
                    />
                    </div>
                    {errors.permanentAddress && <div style={{ color: 'red' }}>{errors.permanentAddress}</div>}


                <div className="form-group">
                    <label>Current Address</label>
                    <input
                        type="text"
                        name="currentAddress"
                        value={employee.currentAddress}
                        onChange={handleChange}
                    />
                    </div>
                    {errors.currentAddress && <div style={{ color: 'red' }}>{errors.currentAddress}</div>}

                <div className="form-group">
                    <label>Work Experience</label>
                    <select
                        name="workExp"
                        value={employee.workExp}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select Work Experience</option>
                        <option value="Fresher">Fresher</option>
                        <option value="Experience">Experience</option>
                        <option value="Experience in BPO">Experience in BPO</option>
                    </select>
                    </div>
                    {errors.workExp && <div style={{ color: 'red' }}>{errors.workExp}</div>}

                {(employee.workExp === "Experience" || employee.workExp === "Experience in BPO") && (
                    <div className="form-group">
                        <label>Previous Organisation</label>
                        <input
                            type="text"
                            name="previousOrganisation"
                            value={employee.previousOrganisation}
                            onChange={handleChange}
                        />
                        <div>
                         {errors.previousOrganisation && <div style={{ color: 'red' }}>{errors.previousOrganisation}</div>}     
                         </div>                                    
                    </div>

                )}
                <div className="form-group">
                    <label>Aadhaar Number</label>
                    <input
                        type="text"
                        name="aadhaarNumber"
                        value={employee.aadhaarNumber}
                        onChange={handleChange}
                    />
                    </div>
                    {errors.aadhaarNumber && <div style={{ color: 'red' }}>{errors.aadhaarNumber}</div>}

                <div className="form-group2">
                    <label>Languages</label>
                    <div className="languages-box">

                        <div>
                            {availableLanguages.map((language) => (
                                <div key={language}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={language}
                                            checked={employee.languages.split(', ').includes(language)}
                                            onChange={handleLanguageChange}
                                        />
                                        {language}
                                    </label>
                                </div>
                            ))}
                        </div>

                    </div>
                    {errors.languages && <div style={{ color: 'red' }}>{errors.languages}</div>}
                </div>
                <div className="form-group">
                    <label>Experience</label>
                    <input
                        type="text"
                        name="experience"
                        value={employee.experience}
                        onChange={handleChange}
                    />
                    </div>
                    {errors.experience && <div style={{ color: 'red' }}>{errors.experience}</div>}

                <div className="form-group">
                    <label>Reference</label>
                    <select
                        name="refferal"
                        value={employee.refferal}
                        onChange={handleChange}
                    >
                        <option value="" disabled> Select</option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                    </select>
                    </div>
                    {errors.refferal && <div style={{ color: 'red' }}>{errors.refferal}</div>}

                {employee.refferal == "YES" && (
                    <>
                    <div className="form-group">
                        <label>Source</label>            
                        <select
                            name="source"
                            value={employee.source}
                            onChange={handleSourceChange}
                        >
                            <option value="" disabled>Select Source</option>
                            <option value="Vendor">Vendor</option>
                            <option value="Emp Ref">Employee Reference</option>
                            <option value="Social Media">Social Media</option>
                            <option value="Portal">Portal</option>
                            <option value="NGO">NGO</option>
                            <option value="Campus">Campus</option>
                        </select>
                        </div>
                        {errors.source && <div style={{ color: 'red' }}>{errors.source}</div>}


                {employee.source == "Social Media" ? (
                    <div className="form-group">
                        <label>Social Media Platform</label>
                        <select
                            name="subSource"
                            value={employee.subSource}
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
                        {errors.subSource && <div style={{ color: 'red' }}>{errors.subSource}</div>}
                    </div>
                ) : (
                    employee.source && (
                        <div className="form-group">
                            <label>Sub Source</label>
                            <input
                                type="text"
                                name="subSource"
                                value={employee.subSource}
                                onChange={handleSubSourceChange}
                            />
                            {errors.subSource && <div style={{ color: 'red' }}>{errors.subSource}</div>}
                        </div>
                    )
                )}
                </>
                )}
                <div className="form-group">
                    <label>Aadhaar Image</label>
                    <input type="file" name="image" onChange={handleFileChange} />
                    {errors.image && <div style={{ color: 'red' }}>{errors.image}</div>}
                </div>
                <button type="submit" >Submit</button>
            </form>
        </div>
    );
};

export default CreateEmployeeForm;





// import React, { useState } from 'react';
// import axios from 'axios';
// import './CreateEmployeeForm.css';

// const CreateEmployeeForm = () => {
//     const [employee, setEmployee] = useState({
//         fullName: '',
//         email: '',
//         qualification: '',
//         mobileNo: '',
//         permanentAddress: '',
//         currentAddress: '',
//         gender: '',
//         previousOrganisation: '',
//         workExp: '',
//         dob: '',
//         maritalStatus: '',
//         refferal: '',
//         aadhaarNumber: '',
//         languages: '',
//         experience: '',
//         source: '',
//         subSource: '',
//     });

//     const [image, setImage] = useState(null);
//     const [errors, setErrors] = useState({});
//     const [serverMessage, setServerMessage] = useState('');
//     const [currentStep, setCurrentStep] = useState(1);  // Track current step
//     const availableLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese'];

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setEmployee((prevState) => ({
//             ...prevState,
//             [name]: value,
//         }));
//         setErrors((prevErrors) => ({
//             ...prevErrors,
//             [name]: '',
//         }));
//         setServerMessage('');
//     };

//     const handleFileChange = (e) => {
//         const selectedFile = e.target.files[0];
//         const MAX_SIZE_MB = 2;

//         if (selectedFile) {
//             const fileSizeInMB = selectedFile.size / (1024 * 1024);
//             if (fileSizeInMB > MAX_SIZE_MB) {
//                 setServerMessage('The selected file exceeds the maximum size limit of 2MB.');
//                 setImage(null);
//             } else {
//                 setImage(selectedFile);
//                 setServerMessage('');
//             }
//         } else {
//             setImage(null);
//         }
//     };

//     const handleLanguageChange = (e) => {
//         const { value, checked } = e.target;
//         const selectedLanguages = employee.languages ? employee.languages.split(', ') : [];

//         if (checked) {
//             selectedLanguages.push(value);
//         } else {
//             const index = selectedLanguages.indexOf(value);
//             if (index > -1) {
//                 selectedLanguages.splice(index, 1);
//             }
//         }

//         setEmployee((prevState) => ({
//             ...prevState,
//             languages: selectedLanguages.join(', '),
//         }));
//     };

//     const handleSourceChange = (e) => {
//         const { value } = e.target;
//         setEmployee((prevState) => ({
//             ...prevState,
//             source: value,
//             subSource: '',
//         }));
//     };

//     const handleSubSourceChange = (e) => {
//         const { value } = e.target;
//         setEmployee((prevState) => ({
//             ...prevState,
//             subSource: value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrors({});
//         setServerMessage('');

//         const formData = new FormData();
//         formData.append('employee', new Blob([JSON.stringify(employee)], { type: 'application/json' }));
//         formData.append('image', image);

//         try {
//             const response = await axios.post('http://localhost:9091/api/employees/createEmployeeDetails', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             setEmployee({
//                 fullName: '',
//                 email: '',
//                 qualification: '',
//                 mobileNo: '',
//                 permanentAddress: '',
//                 currentAddress: '',
//                 gender: '',
//                 previousOrganisation: '',
//                 workExp: '',
//                 dob: '',
//                 maritalStatus: '',
//                 refferal: '',
//                 aadhaarNumber: '',
//                 languages: '',
//                 experience: '',
//                 source: '',
//                 subSource: '',
//             });
//             setImage(null);
//             setErrors({});
//         } catch (error) {
//             if (error.response) {
//                 const errorObj = {};

//                 if (error.response.data && error.response.data.fieldErrors) {
//                     const fieldErrors = error.response.data.fieldErrors;
//                     fieldErrors.forEach((err) => {
//                         if (err.field === 'unknown') {
//                             setServerMessage(err.message);
//                         }
//                         errorObj[err.field] = err.message;
//                     });

//                     setErrors(errorObj);
//                 }
//             } else if (error.message.includes('Request failed with status code 413')) {
//                 setServerMessage('Uploaded file is too large. Please upload a smaller file.');
//             } else {
//                 setServerMessage('An unexpected error occurred. Please try again later.');
//             }
//         }
//     };

//     const handleNext = () => {
//         setCurrentStep((prevStep) => Math.min(prevStep + 1, 3));  // Max step is 3
//     };

//     const handleBack = () => {
//         setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));  // Min step is 1
//     };

//     return (
//         <div className="create-employee-form">
//             {serverMessage && (
//                 <div style={{ color: 'red', marginBottom: '20px' }}>
//                     {serverMessage}
//                 </div>
//             )}

//             <form onSubmit={handleSubmit}>
//                 {/* Step 1: Personal Details */}
//                 {currentStep === 1 && (
//                     <div>
//                         <div className="form-group">
//                             <label>Full Name</label>
//                             <input
//                                 type="text"
//                                 name="fullName"
//                                 value={employee.fullName}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         {errors.fullName && <div style={{ color: 'red' }}>{errors.fullName}</div>}
//                         <div className="form-group">
//                             <label>Email</label>
//                             <input
//                                 type="text"
//                                 name="email"
//                                 value={employee.email}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
//                         <div className="form-group">
//                             <label>Mobile No</label>
//                             <input
//                                 type="text"
//                                 name="mobileNo"
//                                 value={employee.mobileNo}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         {errors.mobileNo && <div style={{ color: 'red' }}>{errors.mobileNo}</div>}
//                         <div className="form-group">
//                             <label>Gender</label>
//                             <select
//                                 name="gender"
//                                 value={employee.gender}
//                                 onChange={handleChange}
//                             >
//                                 <option value="" disabled>Select Gender</option>
//                                 <option value="Male">Male</option>
//                                 <option value="Female">Female</option>
//                             </select>
//                         </div>
//                         {errors.gender && <div style={{ color: 'red' }}>{errors.gender}</div>}
//                         <div className="form-group">
//                             <label>Date of Birth</label>
//                             <input
//                                 type="date"
//                                 name="dob"
//                                 value={employee.dob}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         {errors.dob && <div style={{ color: 'red' }}>{errors.dob}</div>}

//                         <div className="form-group">
//                             <label>Marital Status</label>
//                             <select
//                                 name="maritalStatus"
//                                 value={employee.maritalStatus}
//                                 onChange={handleChange}
//                             >
//                                 <option value="" disabled>Select</option>
//                                 <option value="single">Single</option>
//                                 <option value="married">Married</option>

//                             </select>
//                         </div>
//                         {errors.maritalStatus && <div style={{ color: 'red' }}>{errors.maritalStatus}</div>}



//                     </div>

//                 )}

//                 {/* Step 2: Educational Details */}
//                 {currentStep === 2 && (
//                     <div>
//                         <div className="form-group">
//                             <label>Qualification</label>
//                             <input
//                                 type="text"
//                                 name="qualification"
//                                 value={employee.qualification}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         {errors.qualification && <div style={{ color: 'red' }}>{errors.qualification}</div>}
//                         {/* <div className="form-group">
//                             <label>Work Experience</label>
//                             <select
//                                 name="workExp"
//                                 value={employee.workExp}
//                                 onChange={handleChange}
//                             >
//                                 <option value="" disabled>Select Work Experience</option>
//                                 <option value="Fresher">Fresher</option>
//                                 <option value="Experience">Experience</option>
//                                 <option value="Experience in BPO">Experience in BPO</option>
//                             </select>
//                         </div>
//                         {errors.workExp && <div style={{ color: 'red' }}>{errors.workExp}</div>} */}
//                         <div className="form-group">
//                             <label>Work Experience</label>
//                             <select
//                                 name="workExp"
//                                 value={employee.workExp}
//                                 onChange={handleChange}
//                             >
//                                 <option value="" disabled>Select Work Experience</option>
//                                 <option value="Fresher">Fresher</option>
//                                 <option value="Experience">Experience</option>
//                                 <option value="Experience in BPO">Experience in BPO</option>
//                             </select>
//                         </div>
//                         {errors.workExp && <div style={{ color: 'red' }}>{errors.workExp}</div>}

//                         {(employee.workExp === "Experience" || employee.workExp === "Experience in BPO") && (
//                             <div className="form-group">
//                                 <label>Previous Organisation</label>
//                                 <input
//                                     type="text"
//                                     name="previousOrganisation"
//                                     value={employee.previousOrganisation}
//                                     onChange={handleChange}
//                                 />
//                                 <div>
//                                     {errors.previousOrganisation && <div style={{ color: 'red' }}>{errors.previousOrganisation}</div>}
//                                 </div>
//                             </div>

//                         )}



//                         <div className="form-group">
//                             <label>Languages</label>
//                             <div className="languages-box">
//                                 {availableLanguages.map((language) => (
//                                     <div key={language}>
//                                         <label>
//                                             <input
//                                                 type="checkbox"
//                                                 value={language}
//                                                 checked={employee.languages.split(', ').includes(language)}
//                                                 onChange={handleLanguageChange}
//                                             />
//                                             {language}
//                                         </label>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                         {errors.languages && <div style={{ color: 'red' }}>{errors.languages}</div>}


//                         <div className="form-group">
//                             <label>Experience</label>
//                             <input
//                                 type="text"
//                                 name="experience"
//                                 value={employee.experience}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         {errors.experience && <div style={{ color: 'red' }}>{errors.experience}</div>}



//                     </div>
//                 )}

//                 {/* Step 3: Additional Details */}
//                 {currentStep === 3 && (
//                     <div>
//                         <div className="form-group">
//                             <label>Aadhaar Number</label>
//                             <input
//                                 type="text"
//                                 name="aadhaarNumber"
//                                 value={employee.aadhaarNumber}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         {errors.aadhaarNumber && <div style={{ color: 'red' }}>{errors.aadhaarNumber}</div>}
//                         <div className="form-group">
//                             <label>Aadhaar Image</label>
//                             <input type="file" name="image" onChange={handleFileChange} />
//                             {errors.image && <div style={{ color: 'red' }}>{errors.image}</div>}
//                         </div>
//                     </div>
//                 )}

//                 {/* Navigation Buttons */}
//                 <div className="form-navigation">
//                     {currentStep > 1 && (
//                         <button type="button" onClick={handleBack}>
//                             Back
//                         </button>
//                     )}
//                     {currentStep < 3 ? (
//                         <button type="button" onClick={handleNext}>
//                             Next
//                         </button>
//                     ) : (
//                         <button type="submit">
//                             Submit
//                         </button>
//                     )}
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default CreateEmployeeForm;

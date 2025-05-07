import React, { useState, useEffect } from "react";
import PersonalDetailsComponent from "./PersonalDetailsComponent";
import EducationalDetailsComponent from "./EducationalDetailsComponent";
import AdditionalDetailsComponent from "./AdditionalDetailsComponent";
import WelcomePageComponent from "./WelcomePageComponent";
import { creatEmployee } from "../components/services/EmployeeService";
// import '../components/EmployeeCreatePageComponent.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SuccessPageComponent from "./SuccessPageComponent";

const EmployeeCreatePageComponent = () => {
  const [formData, setFormData] = useState({
    fullName: "", email: "", 
     qualification: "", stream:"", mobileNo: "",
    permanentAddress: "", currentAddress: "", gender: "", previousOrganisation: "",
    appliedLocation:"",
    dob: null, maritalStatus: "", refferal: "", year: new Date().getFullYear(),
    file: null, 
    source: "", subSource: "", language:"", experience: "", workExp: "", aadhaarNumber: ""
  });
  const goToHome = () => {
    setCurrentPage(0); 
  };

  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [isPersonalValid, setIsPersonalValid] = useState(false);
  const [isEducationalValid, setIsEducationalValid] = useState(false);
  const [isAdditionalValid, setIsAdditionalValid] = useState(false);
  const [referenceNo, setReferenceNo] = useState(null); 
  // const [selectedLanguages, setSelectedLanguages] = useState(formData.language ? formData.language.split(', ') : []);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  useEffect(() => {
    validateCurrentPage();
  }, [formData, currentPage]);

  const handleChange = (field, value) => {

    if (field === 'dob' && value) {
      const selectedDate = new Date(value);
      const today = new Date();

    // Calculate age based on full date (years, months, and days)
    let age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    const dayDiff = today.getDate() - selectedDate.getDate();

    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    // Check if the user is at least 18 years old
    if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
      setErrors(prevErrors => ({
        ...prevErrors,
        dob: 'You must be at least 18 years old.',
      }));
      return;
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        dob: '', // Clear the error if age is valid
      }));
    }
  }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };
  const handleSourceChange = (e) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      source: value,
      subSource: value ? prevFormData.subSource : "",
    }));
  };

  const handleSubSourceChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      subSource: e.target.value,
    }));
  };

 // Handle language selection change
//  const handleLanguageChange = (languages) => {
//   const updatedLanguages = selectedLanguages.includes(languages)
//     ? selectedLanguages.filter(lang => lang !== languages)
//     : [...selectedLanguages, languages];
//   setSelectedLanguages(updatedLanguages);
//   handleChange("languages", updatedLanguages.join(', ')); 
// };
// EmployeeCreatePageComponent.jsx

// In EmployeeCreatePageComponent.jsx

const handleLanguageChange = (languageName, type, value) => {
  // Find the index of the language in the selectedLanguages array
  const languageIndex = selectedLanguages.findIndex(lang => lang.languageName === languageName);

  if (languageIndex !== -1) {
    // Language is already selected
    const updatedLanguages = [...selectedLanguages];

    if (type === 'mainCheckbox') {
      // Main checkbox is being unchecked - remove the language
      if (!value) {
        updatedLanguages.splice(languageIndex, 1);
      }
      // If the main checkbox is being checked, we don't do anything here
      // as the initial selection is handled when clicking the main checkbox
    } else {
      // Can Read or Can Write checkbox is clicked - update the specific property
      updatedLanguages[languageIndex] = {
        ...updatedLanguages[languageIndex],
        [type]: value,
      };
    }

    setSelectedLanguages(updatedLanguages);
    handleChange("language", updatedLanguages); // Update the form data
  } else {
    // Language is not yet selected - add it
    if (type === 'mainCheckbox' && value) {
      const updatedLanguages = [...selectedLanguages, {
        languageName: languageName,
        canRead: false, // Initialize canRead and canWrite to false
        canWrite: false,
      }];
      setSelectedLanguages(updatedLanguages);
      handleChange("language", updatedLanguages); // Update the form data
    }
  }
};



  const nextPage = () => {
    if (currentPage === 1 && !isPersonalValid) return;
    if (currentPage === 2 && !isEducationalValid) return;
    if (currentPage === 3 && !isAdditionalValid) return;

    setCurrentPage((prevPage) => prevPage + 1);
  };

  const previousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };


  const validatePersonalDetails = () => {
    const newErrors = {};
    const requiredFields = ['fullName', 'email', 'mobileNo', 'gender', 'dob', 'maritalStatus'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = '*';
      } else if (field === 'email' && !validateEmail(formData.email)) {
        newErrors.email = 'Invalid email format';
      } else if (field === 'mobileNo' && !validatePhoneNumber(formData.mobileNo)) {
        newErrors.mobileNo = 'Invalid phone number format';
      }
    });
    // if (formData.dob && !validateDOB(formData.dob)) newErrors.dob = 'Date of birth cannot be in the future';
    setErrors(newErrors);
    setIsPersonalValid(Object.keys(newErrors).length === 0);
  };

  const validateEducationalDetails = () => {
    const newErrors = {};
  
    const requiredFields = ['qualification', 'workExp',   'experience','stream'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = '*';
      }
    });
   
    if (Object.keys(newErrors).length === 0) {
      if (!validateExperience(formData.experience)) {
        newErrors.experience = 'Float value required';
      }

      // Additional checks based on work experience
      if (formData.workExp === "Experience" && !formData.previousOrganisation.trim()) {
        newErrors.previousOrganisation = '*';
      }
      if (formData.workExp === "Experience in BPO" && !formData.previousOrganisation.trim()) {
        newErrors.previousOrganisation = '*';
      }
    }

    setErrors(newErrors);
    setIsEducationalValid(Object.keys(newErrors).length === 0);
  };




  const validateAdditionalDetails = () => {
    const newErrors = {};
    // const requiredFields = ['permanentAddress', 'currentAddress', 'refferal', 'file', 'aadhaarNumber', 'jobProfile'];
    //'file'
    const requiredFields = ['permanentAddress', 'currentAddress', 'refferal', 'file', 'aadhaarNumber' ,'appliedLocation'];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = '*';
      } else if (field === 'aadhaarNumber' && !validateAadhaar(formData.aadhaarNumber)) {
        newErrors.aadhaarNumber = 'invalid format';
      }
    });
    // Check file size if the file is provided
    if (formData.file && formData.file.size > 3 * 1024 * 1024) { // 3MB in bytes
      newErrors.file = 'Please upload a file size less than 3MB';
    }
    if (formData.refferal === "Yes" && (!formData.source || !formData.subSource)) {
      if (!formData.source) newErrors.source = '*';
      if (!formData.subSource) newErrors.subSource = '*';
    }
    setErrors(newErrors);
    setIsAdditionalValid(Object.keys(newErrors).length === 0);
  };
  const validateCurrentPage = () => {
    if (currentPage === 1) validatePersonalDetails();
    if (currentPage === 2) validateEducationalDetails();
    if (currentPage === 3) validateAdditionalDetails();
  };


  const saveEmployee = () => {
    if (!isAdditionalValid) {
      toast.error('Please correct the errors before submitting.');
      return;
    }
    if (!isDeclarationChecked) {
      toast.error('You must agree to the declaration to submit.');
      return;
    }

    const formDataToSend = new FormData();
    console.log("Submitting employee data:", formData);
    // Prepare languages data for submission
  const languagesData = selectedLanguages.map(lang => ({
    languageName: lang.languageName,
    canRead: lang.canRead,
    canWrite: lang.canWrite
  }));
    formDataToSend.append("employee", new Blob([JSON.stringify(formData)], { type: "application/json" }));
    formDataToSend.append("languages", new Blob([JSON.stringify(languagesData)], { type: "application/json" }));

    formDataToSend.append("image", formData.file);
    console.log("FormData to be sent to the backend:", formDataToSend);
    creatEmployee(formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        const employeeId = response.data.id; // Assuming the response contains the 'id' of the employee
        setReferenceNo(employeeId); // Store the reference number
        toast.success(`Employee created successfully! Your reference number is ${employeeId}`);
        // toast.success("Employee created successfully!");
        setFormData({
          fullName: "", email: "",
          //  jobProfile: "", 
           qualification: "",stream:"", mobileNo: "",
          permanentAddress: "", currentAddress: "", gender: "", previousOrganisation: "",appliedLocation:"",
          dob: null, maritalStatus: "", refferal: "", year: new Date().getFullYear(), 
          file: null,
          source: "", subSource: "", language: "", experience: "", aadhaarNumber: "", workExp: "",
        });
        setSelectedLanguages([]); 
        setCurrentPage(4);
        setIsDeclarationChecked(false);
      })
      .catch((errors) => {
        if (errors.response) {
          const errorMessage = errors.response.data; // Assuming your backend returns the message directly
          toast.error(`${errorMessage}`);
          // toast.error(`Failed to create employee: ${errorMessage}`);

        } else {
          toast.error("Failed to create employee. Please try again.");
        }
      });
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhoneNumber = (phoneNumber) => /^\d{10}$/.test(phoneNumber);
  const validateAadhaar = (aadhaarNumber) => /^\d{12}$/.test(aadhaarNumber);
  const validateDOB = (dob) => new Date(dob) < new Date();
  const validateExperience = (experience) => {
    const num = Number(experience);
    return Number.isFinite(num) && num !== NaN;
  };




  return (
    <div  className="container mt-2">
      <ToastContainer />
      {currentPage === 0 && <WelcomePageComponent onStart={() => setCurrentPage(1)} />}
      {currentPage === 1 && (
        <PersonalDetailsComponent
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />
      )}
      {currentPage === 2 && (
        <EducationalDetailsComponent
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          selectedLanguages={selectedLanguages} 
          handleLanguageChange={handleLanguageChange} 
        />
      )}
      {currentPage === 3 && (
        <AdditionalDetailsComponent
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          handleSourceChange={handleSourceChange}
          handleSubSourceChange={handleSubSourceChange}
          isDeclarationChecked={isDeclarationChecked}
          setIsDeclarationChecked={setIsDeclarationChecked}
        />
      )}
       {currentPage === 4 && (
      <SuccessPageComponent employeeId={referenceNo} goToHome={goToHome} />
    )}
      <div className="button-container text-center mt-2">
        {currentPage > 0 && currentPage !== 4  && (
          <button
            className="btn btn-secondary mx-2"
            style={{ backgroundColor: "#D4A373", color: 'black', width: '10%' }}
            onClick={previousPage}
          >
            Previous
          </button>
        )}
        {currentPage < 3  && currentPage !== 4 ? (
          <button
            className="btn btn-secondary mx-2"
            style={{ backgroundColor: "#D4A373", color: 'black', width: '10%' }}
            onClick={nextPage}
            disabled={currentPage === 1 && !isPersonalValid ||
              currentPage === 2 && !isEducationalValid ||
              currentPage === 3 && !isAdditionalValid}
          >
            Next
          </button>
        ) : currentPage !== 4 && (
          <button
            className="btn btn-secondary mx-2"
            style={{ backgroundColor: "#D4A373", color: 'black', width: '10%' }}
            onClick={saveEmployee}
            disabled={!isAdditionalValid}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeCreatePageComponent;

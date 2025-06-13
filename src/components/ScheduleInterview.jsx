import React, { useEffect, useState } from 'react';
import { getListOfEmployeeScheduleInterview, submitScheduleInterview } from '../components/services/EmployeeService';
import { getValuesInDropDown, getDegiAndDepart } from '../components/services/LoiService';
import { getAllProcessNameCode } from './services/ProcessService';
import UsersService from '../components/services/UserServices'; // make sure this path is correct
import DataTable from 'react-data-table-component';
import jobTitles from '../components/constants/jobProfiles'; // ✅ Job profiles import
import { useAuth } from '../components/AuthProvider';
import '../components/css/ScheduleInterview.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ScheduleInterview() {
  const [employees, setEmployees] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [processNames, setProcessName] = useState([]);
  const [dropdownValues, setDropdownValues] = useState([]);
  const [selectionError, setSelectionError] = useState(false);
  const [designationDepartmentOptions, setDesignationDepartmentOptions] = useState([]);

  // const { user } = useAuth();
   const { employeeUser: user } = useAuth();
  const departments = designationDepartmentOptions.filter(item => item.type === 'Department');
  const designations = designationDepartmentOptions.filter(item => item.type === 'Designation');

  useEffect(() => {
    UsersService.initialize();
    fetchProcessNames();
    fetchDropdownValues();
    getAllEmployees();
  }, [filterDate]);

  useEffect(() => {
    if (user?.city) {
      getDesignationAndDepartment(user.city);
    }
  }, [user?.city]);

  // const fetchProcessNames = async () => {
  //   try {
  //     const response = await UsersService.getAllProcessNameCode();
  //     setProcessName(response); // assuming it's an array of strings
  //   } catch (error) {
  //     console.error('Error fetching process names:', error.message);
  //   }
  // };
const fetchProcessNames = async () => {
  try {
    const response = await getAllProcessNameCode();
    // Assuming response.data is your array of objects [{name: "xyz"}, ...]
    const processNamesArray = response.data.map(item => item.name);
    setProcessName(processNamesArray);
  } catch (error) {
    console.error('Error fetching process names:', error.message);
  }
};

  const fetchDropdownValues = async () => {
    try {
      const response = await getValuesInDropDown();
      setDropdownValues(response.data);
    } catch (error) {
      console.error('Error fetching dropdown values:', error.message);
    }
  }
  const getAllEmployees = () => {
    getListOfEmployeeScheduleInterview(user.city ,user.branch)
      .then((response) => {
        let filteredEmployees = response.data;
        if (filterDate) {
          filteredEmployees = filteredEmployees.filter(emp =>
            new Date(emp.creationDate).toISOString().slice(0, 10) ===
            filterDate.toISOString().slice(0, 10)
          );
        }
        setEmployees(filteredEmployees);
      })
      .catch(error => {
        console.error('Error fetching employees:', error.message);
      });
  };
  const getDesignationAndDepartment = async (location) => {
    try {
      const response = await getDegiAndDepart(location);
      setDesignationDepartmentOptions(response.data);
    } catch (error) {
      console.error("Error fetching designation/department:", error.message);
    }
  };

  const handleFilterChange = (e) => {
    const date = e.target.valueAsDate;
    setFilterDate(date);
  };

  const clearFilter = () => {
    setFilterDate(null);
  };

  const handleRemarkChange = (empId, value) => {
    setRemarks(prevRemarks => ({
      ...prevRemarks,
      [empId]: value,
    }));
  };
  const handleProcessChange = (e, employeeId) => {
    const selectedProcess = e.target.value;
    setEmployees(prevEmployees =>
      prevEmployees.map(employee => {
        if (employee.id === employeeId) {
          return { ...employee, selectedProcess: selectedProcess };
        }
        return employee;
      }));
    setSelectionError(false);
  };

  const handleGradeChange = (e, empId) => {
    const selectedGrade = e.target.value;
    setEmployees(prevEmployees =>
      prevEmployees.map(employee => {
        if (employee.id === empId) {
          return { ...employee, selectedGrade: selectedGrade };
        }
        return employee;
      })
    );
  };

  const handleCompanyTypeChange = (e, empId) => {
    const selectedCompanyType = e.target.value;
    setEmployees(prevEmployees =>
      prevEmployees.map(employee => {
        if (employee.id === empId) {
          return { ...employee, selectedCompanyType: selectedCompanyType };
        }
        return employee;
      })
    );
  };


  const handleDropdownChange = (e, empId) => {
    const selectedValue = e.target.value;
    setEmployees(prev =>
      prev.map(emp => emp.id === empId ? { ...emp, selectedDropdownValue: selectedValue } : emp)
    );
  };
  const handleDepartmentChange = (e, empId) => {
    const selectedDepartment = e.target.value;
    setEmployees(prevEmployees =>
      prevEmployees.map(employee =>
        employee.id === empId ? { ...employee, selectedDepartment: selectedDepartment } : employee
      )
    );
  };

  const handleDesignationChange = (e, empId) => {
    const selectedDesignation = e.target.value;
    setEmployees(prevEmployees =>
      prevEmployees.map(employee =>
        employee.id === empId ? { ...employee, selectedDesignation: selectedDesignation } : employee
      )
    );
  };

  const handleSubmit = async (empId) => {
    const employee = employees.find(emp => emp.id === empId);
    const remark = remarks[empId];

    const payload = {
      id: empId,
      newStatus: "INTERVIEW_SCHEDULED",
      responseSubmitbyName: user.email,
      remarks: remark,
      processName: employee.selectedProcess,
      grade: employee.selectedGrade,
      companyType: employee.selectedCompanyType,
      department: employee.selectedDepartment,         
      jobProfile: employee.selectedDesignation
    };
    try {
      await submitScheduleInterview(empId, payload);
      getAllEmployees();
      toast.success('Response submitted successfully');
    } catch (error) {
      console.error('Error submitting interview:', error.response.data);
      const errorMessage = error?.response?.data || 'Failed to schedule interview. Please try again.';

      toast.error(errorMessage);
    }
  };

  const columns = [
    { name: 'Name', selector: row => row.fullName },
    { name: 'Register Date', selector: row => new Date(row.creationDate).toLocaleDateString() },
    {
      name: 'Remarks',
      cell: row => (
        <input
          type="text"
          value={remarks[row.id] || ''}
          onChange={(e) => handleRemarkChange(row.id, e.target.value)}
          placeholder="Enter remarks"
        />
      )
    },
    {
      name: 'Process',
      selector: row => (
        <select
          className='form-select'
          value={row.selectedProcess || ''}
          onChange={(e) => handleProcessChange(e, row.id)}
        >
          <option value="" disabled>Select</option>
          {processNames.map((process, index) => (
            <option key={index} value={process}>{process}</option>
          ))}


        </select>
      )
    },
    {
      name: 'Grade',
      cell: row => (
        <select
          className="form-select"
          value={row.selectedGrade || ''}
          onChange={(e) => handleGradeChange(e, row.id)}
        >
          <option value="">Select Grade</option>
          {dropdownValues.map((option, index) => (
            <option key={index} value={option.grade}>{option.grade}</option>
          ))}
        </select>
      ),
    },
    {
      name: 'Company Type',
      cell: row => (
        <select
          className="form-select"
          value={row.selectedCompanyType || ''}
          onChange={(e) => handleCompanyTypeChange(e, row.id)}
        >
          <option value="">Select Company Type</option>
          {dropdownValues.map((option, index) => (
            <option key={index} value={option.companyType}>{option.companyType}</option>
          ))}
        </select>
      ),
    },
    {
      name: 'Department',
      cell: row => (
        <select
          className="form-select"
          value={row.selectedDepartment || ''}
          onChange={(e) => handleDepartmentChange(e, row.id)}
        >
          <option value="">Select Department</option>
          {departments.map((option, index) => (
            <option key={index} value={option.name}>{option.name}</option>
          ))}
        </select>
      )
    },
    {
      name: 'Designation',
      cell: row => (
        <select
          className="form-select"
          value={row.selectedDesignation || ''}
          onChange={(e) => handleDesignationChange(e, row.id)}
        >
          <option value="">Select Designation</option>
          {designations.map((option, index) => (
            <option key={index} value={option.name}>{option.name}</option>
          ))}
        </select>
      )
    },

    {
      name: 'Action',
      cell: row => (
        <button
          className="btn btn-primary"
          onClick={() => handleSubmit(row.id)}
        >
          Submit
        </button>
      )
    }
  ];

  return (
    <div className="dashboard-wrap">
      <ToastContainer
        className="custom-toast-container"
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="row mb-3">
        <div className="col-auto">
          <label htmlFor="filterDate" className="col-form-label">Filter by Date:</label>
        </div>
        <div className="col-auto">
          <input
            type="date"
            id="filterDate"
            className="form-control"
            onChange={handleFilterChange}
            value={filterDate ? filterDate.toISOString().split('T')[0] : ''}
          />
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-info" onClick={clearFilter}>Clear Filter</button>
        </div>
      </div>
      <div className="table-responsive">
        <DataTable
          columns={columns}
          data={employees}
          pagination
          highlightOnHover
          responsive
          persistTableHead
          noDataComponent={<div style={{ padding: '1rem' }}>No employee data available.</div>}
        />
      </div>
    </div>
  );
}

export default ScheduleInterview;
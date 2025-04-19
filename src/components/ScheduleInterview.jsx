import React, { useEffect, useState } from 'react';
import { getListOfEmployeeScheduleInterview,submitScheduleInterview } from '../components/services/EmployeeService';
import  UsersService  from '../components/services/UserServices'; // make sure this path is correct
import DataTable from 'react-data-table-component';
import jobTitles from '../components/constants/jobProfiles'; // ✅ Job profiles import

function ScheduleInterview() {
  const [employees, setEmployees] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [processNames , setProcessName ] = useState([]);
  const [selectionError, setSelectionError] = useState(false);

  useEffect(() => {
    UsersService.initialize();
    fetchProcessNames();
    getAllEmployees();
  }, [filterDate]);

  const fetchProcessNames = async () => {
    try {
      const response = await UsersService.getAllProcessNameCode();
      setProcessName(response); // assuming it's an array of strings
    } catch (error) {
      console.error('Error fetching process names:', error.message);
    }
  };

  const getAllEmployees = () => {
    getListOfEmployeeScheduleInterview()
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

  const handleJobProfileChange = (e, empId) => {
    const value = e.target.value;
    setEmployees(prev => prev.map(emp => (
      emp.id === empId ? { ...emp, selectedJobProfile: value } : emp
    )));
  };

//   const handleSubmit = (empId) => {
//     console.log(`Submitted remark for ${empId}:`, remarks[empId]);
//   };

const handleSubmit = async (empId) => {
    const employee = employees.find(emp => emp.id === empId);
    const remark = remarks[empId];
  
    const payload = {
      id: empId,
      newStatus: "INTERVIEW_SCHEDULED", // replace with your actual status value or dynamic if needed
      responseSubmitbyName: localStorage.getItem('email'), // or use auth context / user service
      remarks: remark,
      processName: employee.selectedProcess,
      jobProfile: employee.selectedJobProfile
    };  
    try {
      await submitScheduleInterview(empId, payload);
      alert('Interview scheduled successfully!');
    } catch (error) {
      console.error('Error submitting interview:', error.message);
      alert('Failed to schedule interview: ' + (error?.response?.data?.message || 'Unknown error'));
    }
  };
  
  const columns = [
    { name: 'Name', selector: row => row.fullName},
    { name: 'Email', selector: row => row.email},
    { name: 'Mobile No',selector: row => row.mobileNo},
    { name: 'Gender',selector: row => row.gender},
    { name: 'Register Date',selector: row => new Date(row.creationDate).toLocaleDateString()},
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
        selector : row => (
            <select 
            className='form-select'
            value={row.selectProcess || ''}
            onChange={(e) => handleProcessChange(e , row.id)}
            >
              <option value="" disabled>Select</option>
          {processNames.map((process, index) => (
            <option key={index} value={process}>{process}</option>
          ))}


            </select>
        )
    },
    {
        name: 'Job Profile',
        cell: row => (
          <select
            className="form-select"
            value={row.selectedJobProfile || ''}
            onChange={(e) => handleJobProfileChange(e, row.id)}
          >
            <option value="">Select Job Profile</option>
            {jobTitles.map((title, i) => (
              <option key={i} value={title}>{title}</option>
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

      <DataTable
        columns={columns}
        data={employees}
        pagination
        customStyles={{
          headRow: {
            style: {
              backgroundColor: '#1C3657',
            }
          },
          table: {
            style: {
              border: '1px solid #ddd',
              width: '100%',
            }
          },
          headCells: {
            style: {
              color: 'white',
              fontSize: '12px',
            }
          }
        }}
      />
    </div>
  );
}

export default ScheduleInterview;
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useAuth } from '../components/AuthProvider';
import { getAllEmployeeRejectedByManager ,submitResponseOnRejectPage} from '../components/services/EmployeeService';
import UsersService from '../components/services/UserServices'; // 👈 make sure this is the correct path
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDate } from 'date-fns';

const RejectedEmployeesTable = () => {
  // const { user } = useAuth();
    const { employeeUser: user } = useAuth();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processNames, setProcessNames] = useState([]);
  const [selectedProcesses, setSelectedProcesses] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [filterDate , setFilterDate] = useState(null);



  useEffect(() => {
    if (user?.city) {
      fetchRejectedEmployees();
      fetchProcessNames();
    }
  }, [user]);

   useEffect(() => {
    if (data.length === 0) return;

    if (filterDate) {
      const filtered = data.filter(emp => {
        if (!emp.creationDate) return false;
        const empDate = new Date(emp.creationDate);
      
        return empDate.toISOString().slice(0,10) === filterDate.toISOString().slice(0,10);
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [filterDate, data]);


  const fetchRejectedEmployees = async () => {
    try {
      setLoading(true);
      const response = await getAllEmployeeRejectedByManager(user.city);
      const responseData = response.data !== undefined ? response.data : response;
      const employeesArray = Array.isArray(responseData)? responseData :responseData?.data || [];
     
      if(!Array.isArray(employeesArray)){
        setData([]);
        setFilteredData([]);
        return;
      }
      setData(employeesArray);
     
      if(!filterDate){
        setFilteredData(employeesArray);
      }
    } catch (error) {
      console.error('Failed to fetch rejected employees:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchProcessNames = async () => {
    try {
      const processList = await UsersService.getAllProcessNameCode();
      setProcessNames(processList);
    } catch (error) {
      console.error('Failed to fetch process names:', error);
    }
  };

  const handleFilterChange = (e) => {
    const date = e.target.valueAsDate;
    setFilterDate(date);
  };

  const clearFilter = () => {
    setFilterDate(null);
  };
 
  const handleProcessChange = (employeeId, process) => {
    setSelectedProcesses(prev => ({ ...prev, [employeeId]: process }));
  };


  const handleSubmit = async (employeeId) => {
    const processName = selectedProcesses[employeeId];
    if (!processName) {
      alert('Please select a process');
      return;
    }
    setSubmittingId(employeeId);
    try {
      const payload = {
        newStatus: 'Reschedule',
        responseSubmitbyName: user.email,
        processName
      };
      await submitResponseOnRejectPage(employeeId, payload);
      alert('Submitted successfully');
      fetchRejectedEmployees();
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Submission failed');
    } finally {
      setSubmittingId(null);
    }
  };

  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Full Name', selector: row => row.fullName, sortable: true },
    { name: 'Email', selector: row => row.email },
    { name: 'Job Profile', selector: row => row.jobProfile },
    { name: 'Creation Date', selector: row => new Date(row.creationDate).toLocaleString() },
  
    {
      name: 'Process Name',
      cell: row => (
        <select
          className="border rounded"
          value={selectedProcesses[row.id] || ''}
          onChange={e => handleProcessChange(row.id, e.target.value)}
        >
          <option value="">Select</option>
          {processNames.map((p, idx) => (
            <option key={idx} value={p}>{p}</option>
          ))}
        </select>
      ),
       width:'200px',
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

    {
      name: 'Action',
      cell: row => (
        <button
          className="btn btn-primary"
          onClick={() => handleSubmit(row.id)}
          disabled={submittingId === row.id}
        >
          {submittingId === row.id ? 'Submitting...' : 'Submit'}
        </button>
      ),
      width:'200px',
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

  ];

  return (
    <div>
    <div className="row mb-3">
          <div className="col-auto">
            <label htmlFor="filterDate" className="col-form-label">Filter by Date:</label>
          </div>
          <div className="col-auto">
            <input type="date" id="filterDate" className="form-control" onChange={handleFilterChange} value={filterDate ? filterDate.toISOString().split('T')[0] : ''} />
          </div>
          <div className="col-auto">
            <button className="btn btn-outline-info" onClick={clearFilter}>Clear Filter</button>
          </div>
        </div>
    <div className="p-4">
   
      <DataTable
        columns={columns}
        data={filteredData}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
        persistTableHead
        noDataComponent={<div style={{ padding: '1rem' }}>No employee data available.</div>}
      />
    </div>
    </div>
  );
};

export default RejectedEmployeesTable;

import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { getEmployeesListOnManagerPageWithRoleAndLocation, submitManagerPageResponse } from '../components/services/EmployeeService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

function ManagerPageOnRoleType() {
  const [employees, setEmployees] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [managerRemarks, setManagerRemarks] = useState({});
  const [clientRoundResponse, setClientRoundResponse] = useState({});
  const [filterDate, setFilterDate] = useState(null);
  const [responseError, setResponseError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [processingEmployeeId, setProcessingEmployeeId] = useState(null);

  // const { user } = useAuth();
    const { employeeUser: user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
     console.log('User in useEffect:', user);
    if (user?.uniqueCode && user?.city && user?.branch) {
         console.log('Calling getAllEmployees...');
      getAllEmployees(user.uniqueCode, user.city,user.branch);
    }
  }, [user, filterDate]);

  const getAllEmployees = async (uniqueCode, location,branch) => {
    try {
      console.log('Calling API...');
      const response = await getEmployeesListOnManagerPageWithRoleAndLocation(uniqueCode, location ,branch);
      console.log('Response:', response);
      let filtered = response.data;
      if (filterDate) {
        filtered = filtered.filter(emp =>
          new Date(emp.creationDate).toISOString().slice(0, 10) === filterDate.toISOString().slice(0, 10)
        );
      }
      setEmployees(filtered);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleHrResponse = (e, id) => {
    setSelectedResponse(prev => ({ ...prev, [id]: e.target.value }));
  };

  const handleRemarksChange = (e, id) => {
    setManagerRemarks(prev => ({ ...prev, [id]: e.target.value }));
  };

  const handleClientRoundChange = (e, id) => {
    setClientRoundResponse(prev => ({ ...prev, [id]: e.target.value }));
  };

  const handleHrResponseValue = async (employeeId) => {
    if (processingEmployeeId) {
      setResponseError('Please wait until the current submission is processed.');
      return;
    }

    const selectedValue = selectedResponse[employeeId];
    const managerRemark = managerRemarks[employeeId];
    const clientRound = clientRoundResponse[employeeId];

    if (!selectedValue || !managerRemark) {
      setResponseError('Please select a response and enter remarks');
      setSuccessMessage('');
      return;
    }

    const confirmSubmit = window.confirm('Are you sure you want to submit this response?');
    if (!confirmSubmit) return;

    setProcessingEmployeeId(employeeId);

    try {
      const payload = {
        newStatus: selectedValue,
        remarks: managerRemark,
        clientRoundStatus: clientRound,
        responseSubmitbyName: user?.email,
      };

      const response = await submitManagerPageResponse(employeeId, payload);

      setEmployees(prev =>
        prev.map(emp => emp.id === employeeId ? { ...emp, ...response.data } : emp)
      );

      setResponseError('');
      setSuccessMessage('Response submitted successfully!');
      getAllEmployees(user.uniqueCode, user.city);
    } catch (error) {
      console.error('Error submitting manager response:', error);
      setResponseError('Error submitting response. Please try again.');
    } finally {
      setProcessingEmployeeId(null);
    }
  };

  const handleFilterChange = (e) => {
    setFilterDate(e.target.valueAsDate);
  };

  const clearFilter = () => {
    setFilterDate(null);
  };

  const columns = [
    { name: 'Name', selector: row => row.fullName, sortable: true },
    { name: 'Email', selector: row => row.email ,cell: row => (
      <div
        title={row.email}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '200px'
        }}
      >
        {row.email}
      </div>)},
    { name: 'Job Profile', selector: row => row.jobProfile  , cell:row =>(
      <div
        title = {row.jobProfile}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '200px'
        }}
        >
          {row.jobProfile}
      </div>
    )},
    { name: 'Mobile No', selector: row => row.mobileNo },
    // { name: 'Gender', selector: row => row.gender },
    { name: 'Register Date', selector: row => new Date(row.creationDate).toLocaleDateString() },
    {
      name: 'Remarks',
      cell: row => (
        <input
          type="text"
          className="form-control"
          value={managerRemarks[row.id] || ''}
          onChange={(e) => handleRemarksChange(e, row.id)}
          placeholder="Enter remarks"
        />
      )
    },
    {
      name: 'Actions',
      cell: row => (
        <select
          className="form-select"
          value={selectedResponse[row.id] || ''}
          onChange={(e) => handleHrResponse(e, row.id)}
        >
          <option value="" disabled>Choose</option>
          <option value="Select">Select</option>
          <option value="Reject">Reject</option>
        </select>
      )
    },
    {
      name: 'Client Round',
      cell: row => (
        <select
          className="form-select"
          value={clientRoundResponse[row.id] || ''}
          onChange={(e) => handleClientRoundChange(e, row.id)}
        >
          <option value="" disabled>Choose</option>
          <option value="Select">Select</option>
          <option value="Reject">Reject</option>
          <option value="Not Required">Not Required</option>
        </select>
      )
    },
    {
      name: 'Submit',
      cell: row => (
        <button
          className="btn btn-outline-info"
          onClick={() => handleHrResponseValue(row.id)}
          disabled={processingEmployeeId === row.id}
        >
          Submit
        </button>
      ),
      button: true
    }
  ];

  return (
    <div className="container">
      <br />
      {responseError && <div className="alert alert-danger">{responseError}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

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

      <DataTable
        columns={columns}
        data={employees}
        pagination
        highlightOnHover
        responsive
        striped
        persistTableHead
        noDataComponent={<div style={{ padding: '1rem' }}>No employee data available.</div>}
      />
    </div>
  );
}

export default ManagerPageOnRoleType;

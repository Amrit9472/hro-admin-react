import React, { useState, useEffect, useContext } from 'react';
import {getEmployeesListOnManagerPageWithRoleAndLocation ,submitManagerPageResponse} from '../components/services/EmployeeService';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider'; // ✅ adjust path if needed

function ManagerPageOnRoleType() {
  const [employees, setEmployees] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [managerRemarks, setManagerRemarks] = useState({});
  const [clientRoundResponse, setClientRoundResponse] = useState({});
  const [filterDate, setFilterDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [responseError, setResponseError] = useState('');
//   const { user} = useContext(useAuth);
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [processingEmployeeId, setProcessingEmployeeId] = useState(null);

  useEffect(() => {
    if (user?.uniqueCode && user?.city) {
      getAllEmployees(user.uniqueCode, user.city);
      updateDateTime();
      const intervalId = setInterval(updateDateTime, 1000);
      return () => clearInterval(intervalId);
    }
  }, [user, filterDate, currentPage]);

  const getAllEmployees = async (uniqueCode, location) => {
    try {
      const response = await getEmployeesListOnManagerPageWithRoleAndLocation(uniqueCode, location);
      let filteredEmployees = response.data;

      if (filterDate) {
        filteredEmployees = filteredEmployees.filter(emp =>
          new Date(emp.creationDate).toISOString().slice(0, 10) === filterDate.toISOString().slice(0, 10)
        );
      }
      setEmployees(filteredEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleHrResponse = (e, employeeId) => {
    const selectedValue = e.target.value;
    setSelectedResponse(prev => ({ ...prev, [employeeId]: selectedValue || '' }));
  };

  const handleRemarksChange = (e, employeeId) => {
    const managerRemarks = e.target.value;
    setManagerRemarks(prev => ({ ...prev, [employeeId]: managerRemarks }));
  };

  const handleClientRoundChange = (e, employeeId) => {
    const clientRound = e.target.value;
    setClientRoundResponse(prev => ({ ...prev, [employeeId]: clientRound }));
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
    if (confirmSubmit) {
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

        getAllEmployees(user.uniqueCode, user.city);
        setResponseError('');
        setSuccessMessage('Response submitted successfully!');
      } catch (error) {
        console.error('Error submitting manager response:', error);
        setResponseError('Error submitting response. Please try again.');
      } finally {
        setProcessingEmployeeId(null);
      }
    }
  };


  const handleFilterChange = (e) => {
    const date = e.target.valueAsDate;
    setFilterDate(date);
  };

  const clearFilter = () => {
    setFilterDate(null);
  };

  const indexOfLastEmployee = currentPage * perPage;
  const indexOfFirstEmployee = indexOfLastEmployee - perPage;
  const displayedEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const updateDateTime = () => {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(now);
    setCurrentDateTime(formattedDateTime);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      setEmployees([]);
      setSelectedResponse({});
      setManagerRemarks({});
      setFilterDate(null);
      setCurrentPage(1);
      setResponseError('');
      logout();
      navigate('/');
    }
  };

  return (
    <>
      <div className="header">
        <span className="pe-3">{currentDateTime}</span>
        <Link className="logout-btn" onClick={handleLogout}><i className="fas fa-power-off"></i></Link>
      </div>
      <div className='container'>
        <br />
        {responseError && <div className="alert alert-danger">{responseError}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <br />
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

        <table className='table table-striped table-bordered'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Job Profile</th>
              <th>Mobile No</th>
              <th>Gender</th>
              <th>Register Date</th>
              <th>Remarks</th>
              <th>Actions</th>
              <th>Client Round</th>
              <th>Submit Response</th>
            </tr>
          </thead>
          <tbody>
            {displayedEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.fullName}</td>
                <td>{employee.email}</td>
                <td>{employee.jobProfile}</td>
                <td>{employee.mobileNo}</td>
                <td>{employee.gender}</td>
                <td>{new Date(employee.creationDate).toLocaleDateString()}</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={managerRemarks[employee.id] || ''}
                    onChange={(e) => handleRemarksChange(e, employee.id)}
                    placeholder="Enter remarks"
                  />
                </td>
                <td>
                  <select
                    className='form-select'
                    value={selectedResponse[employee.id] || ''}
                    onChange={(e) => handleHrResponse(e, employee.id)}
                  >
                    <option value="" disabled>Choose</option>
                    <option value="Select">Select</option>
                    <option value="Reject">Reject</option>
                  </select>
                </td>
                <td>
                  <select
                    className='form-select'
                    value={clientRoundResponse[employee.id] || ''}
                    onChange={(e) => handleClientRoundChange(e, employee.id)}
                  >
                    <option value="" disabled>Choose</option>
                    <option value="Select">Select</option>
                    <option value="Reject">Reject</option>
                    <option value="Not Required">Not Required</option>
                  </select>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn btn-outline-info" onClick={() => handleHrResponseValue(employee.id)}>Submit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
            </li>
            <li className="page-item"><span className="page-link">{currentPage}</span></li>
            <li className={`page-item ${displayedEmployees.length < perPage ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default ManagerPageOnRoleType;

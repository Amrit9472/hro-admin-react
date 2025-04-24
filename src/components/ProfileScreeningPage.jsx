import React, { useState, useEffect, useContext } from 'react'
import { getProfileScreaningList, getEmployeesInformation, putResponseOnProfileScreening } from '../components/services/EmployeeService';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import { useAuth } from '../components/AuthProvider';
import '../components/css/ProfileScreeningPage.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProfileScreeningPage({ role, name }) {
  const [employees, setEmployees] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [profileScreenRemarks, setProfileScreenRemarks] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    getAllEmployees();
  }, [filterDate]);



  const getAllEmployees = async () => {
    try {
      const response = await getProfileScreaningList(user.city);
      let filteredEmployees = response.data;
      if (filterDate) {
        filteredEmployees = filteredEmployees.filter(emp =>
          new Date(emp.creationDate).toISOString().slice(0, 10) === filterDate.toISOString().slice(0, 10)
        );
      }
      setEmployees(filteredEmployees);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
      toast.error('Failed to fetch employees. Please try again!');
    }
  };

  const handleFilterChange = (e) => {
    const date = e.target.valueAsDate;
    setFilterDate(date);
  };

  const clearFilter = () => {
    setFilterDate(null);
  };



  const handleHrResponse = (e, employeeId) => {
    const selectedValue = e.target.value;
    console.log('Selected Response:', selectedValue);
    setSelectedResponse(prevSelectedResponse => ({
      ...prevSelectedResponse,
      [employeeId]: selectedValue
    }));
  };
  const handleRemarksChange = (e, employeeId) => {
    const profileScreenRemark = e.target.value;
    setProfileScreenRemarks((prevRemarks) => ({
      ...prevRemarks,
      [employeeId]: profileScreenRemark
    }));
  };



  const handleHrResponseValue = async (employeeId) => {
    const selectedValue = selectedResponse[employeeId];
    const profileScreenRemark = profileScreenRemarks[employeeId];


    const statusRequestDTO = {
      newStatus: selectedValue,
      responseSubmitbyName: name,
      remarks: profileScreenRemark
    };

    try {
      const response = await putResponseOnProfileScreening(employeeId, statusRequestDTO);
      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp.id === employeeId ? response.data : emp
        )
      );
      toast.success('Response submitted successfully');
    } catch (error) {
      console.error('Error submitting HR response:', error);
      toast.error(error.response?.data || 'Failed to submit response. Please try again');
    }
  };


  const showEmployeeDetails = async (employeeId) => {
    try {
      const response = await getEmployeesInformation(employeeId);
      if (response.data.length > 0) {
        const employeeDetails = response.data[0];
        setSelectedEmployeeDetails(employeeDetails);
        setShowDetailsModal(true);
      } else {
        setSelectedEmployeeDetails(null);
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setSelectedEmployeeDetails(null);
      setShowDetailsModal(false);
      toast.error('Failed to fetch employee details');
    }
  };
  const closeModal = () => {
    setShowDetailsModal(false);
  };


  const columns = [
    {
      name: 'Name',
      selector: row => row.fullName,
      cell: row => (
        <span
          onClick={() => showEmployeeDetails(row.id)}
          style={{ color: '#0d6efd', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {row.fullName}
        </span>
      ),
      sortable: true,
    },

    {
      name: 'Email',
      sortable: true,
      selector: row => row.email,
      cell: row => (
        <div
          title={row.email}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '200px'
          }}>
          {row.email}
        </div>
      )


    },
    {
      name: 'Mobile No',
      selector: row => row.mobileNo,

    },
    {
      name: 'Permanent Address',
      selector: row => row.permanentAddress,
      cell: row => (
        <div
          title={row.permanentAddress}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '200px'
          }}
        >
          {row.permanentAddress}
        </div>
      )

    },
    {
      name: 'Gender',
      selector: row => row.gender
    },
    {
      name: 'Register Date',
      selector: row => new Date(row.creationDate).toLocaleDateString(),

    },
    {
      name: 'Remarks',
      selector: row => (
        <input
          type="text"
          className="form-control"
          value={profileScreenRemarks[row.id] || ''}
          onChange={(e) => handleRemarksChange(e, row.id)}
          placeholder="Enter remarks"
        />
      ),
    },
    {
      name: 'Action',
      cell: row => (
        <div>
          <select className='form-select' value={selectedResponse[row.id] || ''}
            onChange={(e) => handleHrResponse(e, row.id)}>
            <option value="" disabled>Choose</option>
            <option value="Select">Select</option>
            <option value="Reject">Reject</option>
          </select>

        </div>
      ),
    },
    {
      name: 'Action',
      selector: row => <button className="btn btn-outline-info mt-2" onClick={() => handleHrResponseValue(row.id)}>Submit</button>,
    }

  ];

  return (
    <>

      <div className='container'>
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
            <input type="date" id="filterDate" className="form-control" onChange={handleFilterChange} value={filterDate ? filterDate.toISOString().split('T')[0] : ''} />
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
            paginationPerPage={7}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
            paginationComponentOptions={{ noRowsPerPage: true }}
            striped
            persistTableHead
            noDataComponent={<div style={{ padding: '1rem' }}>No employee data available.</div>}

          />
        </div>
        {selectedEmployeeDetails && (
          <div className={`modal ${showDetailsModal ? 'show' : ''}`}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <table>
                    <tr>
                      <th>Full Name</th>
                      <td>{selectedEmployeeDetails.fullName}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{selectedEmployeeDetails.email}</td>
                    </tr>
                    <tr>
                      <th>Aadhar Number</th>
                      <td>{selectedEmployeeDetails.aadhaarNumber}</td>
                    </tr>
                  </table>
                  <hr />
                  {selectedEmployeeDetails.statusHistory && selectedEmployeeDetails.statusHistory.map((history, index) => (
                    <div key={index}>
                      <p><strong>Status: </strong><span className="status" data-status={history.status}>{history.status}</span></p>
                      {history.hrName && <p><strong>Updated By: </strong>{history.hrName}</p>}
                      <p><strong>Changes Date Time: </strong>{format(new Date(history.changesDateTime), 'yyyy-MM-dd HH:mm:ss')}</p>
                      <hr />
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-primary" onClick={closeModal}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileScreeningPage


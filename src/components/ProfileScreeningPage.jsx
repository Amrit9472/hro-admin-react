import React, { useState, useEffect, useContext } from 'react'
import { getProfileScreaningList, getEmployeesInformation, putResponseOnProfileScreening } from '../components/services/EmployeeService';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import { useAuth } from '../components/AuthProvider';
// import '../components/css/ProfileScreeningPage.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from 'react-bootstrap';

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
      let data = response.data !== undefined ? response.data : response; // handle different response structures

      // Debug to verify response
      console.log('API response data:', data);

      // Ensure data is an array
      const employeesArray = Array.isArray(data) ? data : (data?.data || []);

      // Debug to verify data shape
      console.log('Employees array after check:', employeesArray);

      if (!Array.isArray(employeesArray)) {
        // fallback
        setEmployees([]);
        return;
      }

      let filteredEmployees = employeesArray;

      if (filterDate) {
        filteredEmployees = filteredEmployees.filter(emp => {
          if (!emp.creationDate) return false;
          return (
            new Date(emp.creationDate).toISOString().slice(0, 10) ===
            filterDate.toISOString().slice(0, 10)
          );
        });
      }
      setEmployees(filteredEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
      toast.error('Failed to fetch employees. Please try again!');
    }
  }
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
    try {
      const selectedValue = selectedResponse[employeeId];
      const profileScreenRemark = profileScreenRemarks[employeeId];

      const statusRequestDTO = {
        newStatus: selectedValue,
        responseSubmitbyName: name,
        remarks: profileScreenRemark,
      };

      // Send the response
      const response = await putResponseOnProfileScreening(employeeId, statusRequestDTO);
      // You can check response.message or response.status if needed
      console.log('Response message:', response.message);
      const updatedEmployees = await getProfileScreaningList(user.city);
      const data = Array.isArray(updatedEmployees) ? updatedEmployees : (updatedEmployees?.data || []);

      setEmployees(Array.isArray(data) ? data : []);

      // Reset selections
      setSelectedResponse(prev => ({ ...prev, [employeeId]: '' }));
      toast.success('Response submitted successfully');
    } catch (error) {
      console.error('Error submitting response:', error);
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
    setSelectedEmployeeDetails(null);
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
      name: 'Languages',
      selector: row => (
        <div>
          {row.languages?.map((language, index) => (
            <div key={index}>
              {language.replace('Read:', ' (Read:').replace('Write:', ', Write:')} {/* Adjust the formatting */}
            </div>
          ))}
        </div>
      ),
      sortable: true,
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
        <Modal
          show={showDetailsModal}
          onHide={closeModal}
          size="lg"
          centered
          backdrop="static"
          scrollable
        >
          <Modal.Header >
            <Modal.Title>Employee Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEmployeeDetails ? (
              <>
                <table className="table table-bordered">
                  <tbody>
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
                  </tbody>
                </table>
                <hr />
                {selectedEmployeeDetails.statusHistory &&
                  selectedEmployeeDetails.statusHistory.map((history, index) => (
                    <div key={index}>
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className="status" data-status={history.status}>
                          {history.status}
                        </span>
                      </p>
                      {history.hrName && (
                        <p>
                          <strong>Updated By:</strong> {history.hrName}
                        </p>
                      )}
                      <p>
                        <strong>Changes Date Time:</strong>{' '}
                        {format(
                          new Date(history.changesDateTime),
                          'yyyy-MM-dd HH:mm:ss'
                        )}
                      </p>
                      <hr />
                    </div>
                  ))}
              </>
            ) : (
              <p>No details available.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ProfileScreeningPage

{/* {selectedEmployeeDetails && (
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
        )} */}
{/* React Bootstrap Modal */ }
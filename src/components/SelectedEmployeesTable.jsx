import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useAuth } from '../components/AuthProvider';
import { getListOfSelectedEmployee } from '../components/services/EmployeeService';
import LoiDropdownForm from './LoiDropdownForm';
import { Modal, Button } from 'react-bootstrap';


const SelectedEmployeesTable = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee ,setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
 
    const fetchEmployees = async () => {
      try {
        const location = user?.city; 
        const response = await getListOfSelectedEmployee(location);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching selected employees:', error);
      } finally {
        setLoading(false);
      }
    };
useEffect(() =>{
    fetchEmployees();
  }, [user]);
 const handleShowModal = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setShowModal(false);
  };

  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Full Name', selector: row => row.fullName, sortable: true },
    { name: 'Email', selector: row => row.email },
    { name: 'Mobile No', selector: row => row.mobileNo },
    { name: 'Gender', selector: row => row.gender },
    { name: 'Creation Date', selector: row => new Date(row.creationDate).toLocaleString() },
    { name: 'HR Remarks', selector: row => row.remarksByHr },
    { name: 'Manager Remarks', selector: row => row.remarksByManager },
    { name: 'Profile Screen Remarks', selector: row => row.profileScreenRemarks },
    {
      name: 'Action', 
      cell: (row) => (
        // <button 
        //   onClick={() => setSelectedEmployee(row)} 
        //   className="btn btn-primary"
        // >
        <button 
          onClick={() => handleShowModal(row)} 
          className="btn btn-primary"
        >
          LOI
        </button>
      ),
    },
  ];

  return (
    <div>
      {/* <h2>Selected Employees</h2> */}
      <DataTable
        columns={columns}
        data={employees}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
        persistTableHead
        noDataComponent={<div style={{ padding: '1rem' }}>No employee data available.</div>}
      />

    
       {/* {selectedEmployee && (
        <LoiDropdownForm 
          selectedEmployee={selectedEmployee} 
          setSelectedEmployee={setSelectedEmployee} 
          refreshEmployeeList={fetchEmployees}
        />
      )} */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header>
          {/* <Modal.Title>
            Generate LOI for {selectedEmployee?.fullName}
          </Modal.Title> */}
        </Modal.Header>
        <Modal.Body size ="lg">
          {selectedEmployee && (
            <LoiDropdownForm
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
              refreshEmployeeList={fetchEmployees}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SelectedEmployeesTable;

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
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');


  const uniqueDepartments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
  const uniqueDesignations = [...new Set(employees.map(emp => emp.jobProfile).filter(Boolean))];

  useEffect(() => {
    if (user?.city) {
      fetchEmployees();
    }
  }, [user]);

  // useEffect(() => {
  //   if (employees.length === 0) return;

  //   if (filterDate) {
  //     const filtered = employees.filter(emp => {
  //       if (!emp.creationDate) return false;
  //       const empDate = new Date(emp.creationDate);
  //       // compare only the date part
  //       return empDate.toISOString().slice(0, 10) === filterDate.toISOString().slice(0, 10);
  //     });
  //     setFilteredData(filtered);
  //   } else {
  //     setFilteredData(employees);
  //   }
  // }, [filterDate, employees]);
  useEffect(() => {
    if (employees.length === 0) return;

    let filtered = [...employees];

    if (filterDate) {
      filtered = filtered.filter(emp => {
        if (!emp.creationDate) return false;
        const empDate = new Date(emp.creationDate);
        return empDate.toISOString().slice(0, 10) === filterDate.toISOString().slice(0, 10);
      });
    }

    if (selectedDepartment) {
      filtered = filtered.filter(emp => emp.department === selectedDepartment);
    }

    if (selectedDesignation) {
      filtered = filtered.filter(emp => emp.jobProfile === selectedDesignation);
    }

    setFilteredData(filtered);
  }, [filterDate, employees, selectedDepartment, selectedDesignation]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const location = user?.city;
      const response = await getListOfSelectedEmployee(location);
      const responseData = response.data !== undefined ? response.data : response;
      const employeesArray = Array.isArray(responseData) ? responseData : responseData?.data || [];
      if (!Array.isArray(employeesArray)) {
        setEmployees([]);
        setFilteredData([]);
        return;
      }
      setEmployees(employeesArray);
      if (!filterDate) {
        setFilteredData(employeesArray);
      }
      console.log("select employee Response ", response.data)
    } catch (error) {
      console.error('Error fetching selected employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const date = e.target.valueAsDate;
    setFilterDate(date);
  };

  // useEffect(() =>{
  //     fetchEmployees();
  //   }, [user]);
  const handleShowModal = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setShowModal(false);
  };

  const columns = [
   
    { name: 'Full Name', selector: row => row.fullName, sortable: true },
    { name: 'Email', selector: row => row.email },
    { name: 'Mobile No', selector: row => row.mobileNo },
    { name: 'Creation Date', selector: row => new Date(row.creationDate).toLocaleString() },
    { name: 'HR Remarks', selector: row => row.remarksByHr },
    { name: 'Manager Remarks', selector: row => row.remarksByManager },
    { name: 'Profile Screen Remarks', selector: row => row.profileScreenRemarks },
    {
      name: 'Action',
      cell: (row) => (
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
      <div className="row mb-3">
        <div className="col-auto">    
          <label htmlFor="filterDate" className="col-form-label">Date:</label>
          <input type="date" id="filterDate" 
          className="form-control"  
          onChange={handleFilterChange} 
          value={filterDate ? filterDate.toISOString().split('T')[0] : ''} 
          />
        </div>
        <div className="col-auto">
          <label className="col-form-label">Department:</label>
          <select
            className="form-select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All</option>
            {uniqueDepartments.map((dept, idx) => (
              <option key={idx} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="col-auto">
          <label className="col-form-label">Designation:</label>
          <select
            className="form-select"
            value={selectedDesignation}
            onChange={(e) => setSelectedDesignation(e.target.value)}
          >
            <option value="">All</option>
            {uniqueDesignations.map((desig, idx) => (
              <option key={idx} value={desig}>{desig}</option>
            ))}
          </select>
        </div>

        <div className="col-auto">
          <button
            className="btn btn-outline-warning"
            onClick={() => {
              setFilterDate(null);
              setSelectedDepartment('');
              setSelectedDesignation('');
            }}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="p-4"></div>
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

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header>
          <Modal.Title>
            Generate LOI for {selectedEmployee?.fullName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body size="lg">
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




// import React, { useEffect, useState } from 'react';
// import DataTable from 'react-data-table-component';
// import { useAuth } from '../components/AuthProvider';
// import { getListOfSelectedEmployee } from '../components/services/EmployeeService';
// import LoiDropdownForm from './LoiDropdownForm';
// import { Modal, Button } from 'react-bootstrap';


// const SelectedEmployeesTable = () => {
//   const { user } = useAuth();
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedEmployee ,setSelectedEmployee] = useState(null);
//   const [showModal, setShowModal] = useState(false);
 
//     const fetchEmployees = async () => {
//       try {
//         const location = user?.city; 
//         const response = await getListOfSelectedEmployee(location);
//         setEmployees(response.data);
//       } catch (error) {
//         console.error('Error fetching selected employees:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
// useEffect(() =>{
//     fetchEmployees();
//   }, [user]);
//  const handleShowModal = (employee) => {
//     setSelectedEmployee(employee);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedEmployee(null);
//     setShowModal(false);
//   };

//   const columns = [
//     { name: 'ID', selector: row => row.id, sortable: true },
//     { name: 'Full Name', selector: row => row.fullName, sortable: true },
//     { name: 'Email', selector: row => row.email },
//     { name: 'Mobile No', selector: row => row.mobileNo },
//     { name: 'Gender', selector: row => row.gender },
//     { name: 'Creation Date', selector: row => new Date(row.creationDate).toLocaleString() },
//     { name: 'HR Remarks', selector: row => row.remarksByHr },
//     { name: 'Manager Remarks', selector: row => row.remarksByManager },
//     { name: 'Profile Screen Remarks', selector: row => row.profileScreenRemarks },
//     {
//       name: 'Action', 
//       cell: (row) => (
//         // <button 
//         //   onClick={() => setSelectedEmployee(row)} 
//         //   className="btn btn-primary"
//         // >
//         <button 
//           onClick={() => handleShowModal(row)} 
//           className="btn btn-primary"
//         >
//           LOI
//         </button>
//       ),
//     },
//   ];

//   return (
//     <div>
//       {/* <h2>Selected Employees</h2> */}
//       <DataTable
//         columns={columns}
//         data={employees}
//         progressPending={loading}
//         pagination
//         highlightOnHover
//         responsive
//         persistTableHead
//         noDataComponent={<div style={{ padding: '1rem' }}>No employee data available.</div>}
//       />

    
//        {/* {selectedEmployee && (
//         <LoiDropdownForm 
//           selectedEmployee={selectedEmployee} 
//           setSelectedEmployee={setSelectedEmployee} 
//           refreshEmployeeList={fetchEmployees}
//         />
//       )} */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
//         <Modal.Header>
//           {/* <Modal.Title>
//             Generate LOI for {selectedEmployee?.fullName}
//           </Modal.Title> */}
//         </Modal.Header>
//         <Modal.Body size ="lg">
//           {selectedEmployee && (
//             <LoiDropdownForm
//               selectedEmployee={selectedEmployee}
//               setSelectedEmployee={setSelectedEmployee}
//               refreshEmployeeList={fetchEmployees}
//             />
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default SelectedEmployeesTable;
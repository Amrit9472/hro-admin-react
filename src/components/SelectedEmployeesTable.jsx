// components/SelectedEmployeesTable.jsx
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useAuth } from '../components/AuthProvider';
import { getListOfSelectedEmployee } from '../components/services/EmployeeService';

const SelectedEmployeesTable = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const location = user?.city; // Replace with appropriate default
        const response = await getListOfSelectedEmployee(location);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching selected employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user]);

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
      />
    </div>
  );
};

export default SelectedEmployeesTable;

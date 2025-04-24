import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useAuth } from '../components/AuthProvider';
import { getListOfEmployeeRejectedInProfileScreening ,submitResponseForReScreening} from '../components/services/EmployeeService';

const ProfileScreeningRejectedTable = () => {
  const { user } = useAuth();
  const [rejectedList, setRejectedList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRejectedList = async () => {
    try {
      const response = await getListOfEmployeeRejectedInProfileScreening(user.city);
      setRejectedList(response.data);
    } catch (error) {
      console.error('Failed to fetch rejected employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.city) {
      fetchRejectedList();
    }
  }, [user]);

  const handleRescreen = async (employeeId) => {
    try {
      const payload = {
        newStatus: "Reschedule",
        responseSubmitByName: user.email
      };
      await submitResponseForReScreening(employeeId, payload);
      alert("Employee marked for rescreening successfully!");
      fetchRejectedList(); // Refresh the table
    } catch (error) {
      console.error('Error during rescreening:', error);
      alert("Failed to rescreen employee");
    }
  };


  const columns = [
    { name: 'Full Name', selector: row => row.fullName, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Mobile No', selector: row => row.mobileNo },
    { name: 'Gender', selector: row => row.gender },
    { name: 'Creation Date', selector: row => new Date(row.creationDate).toLocaleDateString() },
    { name: 'HR Remarks', selector: row => row.remarksByHr },
    { name: 'Manager Remarks', selector: row => row.remarksByManager },
    { name: 'Profile Screen Remarks', selector: row => row.profileScreenRemarks },
    {
        name: 'Actions',
        cell: row => (
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            onClick={() => handleRescreen(row.id)}
          >
            Rescreen
          </button>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
   
];

  return (
    <div className="p-4">
      <DataTable
        columns={columns}
        data={rejectedList}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
        persistTableHead
        noDataComponent={<div style={{ padding: '1rem' }}>No employee data available.</div>}
      />
    </div>
  );
};

export default ProfileScreeningRejectedTable;

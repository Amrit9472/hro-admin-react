import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useAuth } from '../components/AuthProvider';
import { getAllEmployeeRejectedByManager } from '../components/services/EmployeeService';
import UsersService from '../components/services/UserServices'; // 👈 make sure this is the correct path

const RejectedEmployeesTable = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processNames, setProcessNames] = useState([]);

  const fetchRejectedEmployees = async () => {
    try {
      const response = await getAllEmployeeRejectedByManager(user.city);
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch rejected employees:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchProcessNames = async () => {
    try {
      const processList = await UsersService.getAllProcessNameCode();
      setProcessNames(processList); // should be an array of strings or objects
    } catch (error) {
      console.error('Failed to fetch process names:', error);
    }
  };
  useEffect(() => {
    if (user?.city) {
      fetchRejectedEmployees();
      fetchProcessNames();

    }
  }, [user]);

  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Full Name', selector: row => row.fullName, sortable: true },
    { name: 'Email', selector: row => row.email },
    { name: 'Job Profile', selector: row => row.jobProfile },
    { name: 'Creation Date', selector: row => new Date(row.creationDate).toLocaleString() },
    {
      name: 'Process Name',
      cell: row => (
        <select className="border rounded px-2 py-1">
          {processNames.map((p, idx) => (
            <option key={idx} value={p}>{p}</option>
          ))}
        </select>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Rejected Employees</h2>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
      />
    </div>
  );
};

export default RejectedEmployeesTable;

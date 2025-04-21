import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useAuth } from '../components/AuthProvider';
import { getAllEmployeeRejectedByManager ,submitResponseOnRejectPage} from '../components/services/EmployeeService';
import UsersService from '../components/services/UserServices'; // 👈 make sure this is the correct path

const RejectedEmployeesTable = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processNames, setProcessNames] = useState([]);
  const [selectedProcesses, setSelectedProcesses] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

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
          className="border rounded px-2 py-1"
          value={selectedProcesses[row.id] || ''}
          onChange={e => handleProcessChange(row.id, e.target.value)}
        >
          <option value="">Select</option>
          {processNames.map((p, idx) => (
            <option key={idx} value={p}>{p}</option>
          ))}
        </select>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

    {
      name: 'Action',
      cell: row => (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => handleSubmit(row.id)}
          disabled={submittingId === row.id}
        >
          {submittingId === row.id ? 'Submitting...' : 'Submit'}
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

  ];

  return (
    <div className="p-4">
      {/* <h2 className="text-xl font-semibold mb-4">Rejected Employees</h2> */}
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

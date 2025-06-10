import React, { useState, useEffect } from 'react';
import {
  getProcesses,
  getEmployeesByDateAndProcess,
  saveAttendance,
} from './services/InductionAttendanceService.js';
import { useAuth } from "./AuthProvider.jsx";

const Attendance = () => {
  const [date, setDate] = useState('');
  const [process, setProcess] = useState('');
  // const [type, setType] = useState(''); // training or induction
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [processOptions, setProcessOptions] = useState([]);
   const { employeeUser} = useAuth();
  const user = employeeUser;

  useEffect(() => {
    // Fetch process options from backend
    getProcesses()
      .then((response) => setProcessOptions(response.data))
      .catch((error) => console.error('Error fetching processes:', error));
  }, []);

  useEffect(() => {
    if (date && process) {
      getEmployeesByDateAndProcess(date, process)
        .then((response) => {
          setEmployees(response.data);

          // Initialize attendance state
          const initialAttendance = {};
          response.data.forEach(emp => {
            initialAttendance[emp.employeeId || emp.id] = emp.status || 'Absent';
          });
          setAttendance(initialAttendance);
        })
        .catch((error) => console.error('Error fetching employees:', error));
    }
  }, [date, process]);

  const handleMarkAttendance = (employeeId, status) => {
    setAttendance((prev) => ({ ...prev, [employeeId]: status }));
  };

  const handleSubmit = () => {
    const marker = user?.email || 'Unknown Marker'; 
    const records = employees.map((emp) => ({
      employeeId: emp.employeeId,
      date: new Date(date).toISOString().split('T')[0], // Ensures proper date format
      process,
      status: attendance[emp.employeeId] || 'Absent',
      marker,
       type: "INDUCTION",
    }));

    saveAttendance(records)
      .then(() => {
        alert('Attendance saved successfully!');
        setAttendance({});
      })
      .catch((error) => {
        console.error('Error saving attendance:', error);
        alert('Failed to save attendance.');
      });
  };

  const isFormFilled = date && process;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Attendance Dashboard</h2>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label>Joining Date:</label><br />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label>Process:</label><br />
          <select value={process} onChange={(e) => setProcess(e.target.value)}>
            <option value="">Select Process</option>
            {processOptions.map((proc, idx) => (
              <option key={idx} value={proc}>{proc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Attendance Table */}
      {isFormFilled && (
        <>
          {employees.length === 0 ? (
            <p>No employees found for the selected date and process.</p>
          ) : (
            <>
              <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mark Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.employeeId}>
                      <td>{emp.name}</td>
                      <td>
                        <button
                          onClick={() => handleMarkAttendance(emp.employeeId, 'Present')}
                          style={{
                            backgroundColor:
                              attendance[emp.employeeId] === 'Present' ? '#4caf50' : '#e0e0e0',
                            marginRight: '10px',
                          }}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(emp.employeeId, 'Absent')}
                          style={{
                            backgroundColor:
                              attendance[emp.employeeId] === 'Absent' ? '#f44336' : '#e0e0e0',
                              marginRight: '10px',
                          }}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(emp.employeeId, 'Half day')}
                          style={{
                            backgroundColor:
                              attendance[emp.employeeId] === 'Half day' ? '#f44336' : '#e0e0e0',
                          }}
                        >
                          Half day
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={handleSubmit}
                style={{ marginTop: '20px', padding: '10px 20px' }}
              >
                Submit Attendance
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Attendance;
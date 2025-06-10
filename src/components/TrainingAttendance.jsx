import React, { useState, useEffect } from 'react';
import {
  getTrainingBatches,
  getEmployeesByBatchId,
  saveTrainingAttendance,
} from './services/TrainingAttendanceService.js';
import { useAuth } from "./AuthProvider.jsx";

const TrainingAttendance = () => {
  const [date, setDate] = useState('');
  const [batchId, setBatchId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [batchOptions, setBatchOptions] = useState([]);
  const [trainingStartDate, setTrainingStartDate] = useState('');
  const [trainingDays, setTrainingDays] = useState(0);
  const { employeeUser } = useAuth();
  const user = employeeUser;

  // Fetch training batch options
  useEffect(() => {
    getTrainingBatches()
      .then((response) => setBatchOptions(response.data))
      .catch((error) => console.error('Error fetching training batches:', error));
  }, []);

  // Fetch employees when batch selected
  useEffect(() => {
    if (batchId) {
      getEmployeesByBatchId(batchId)
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
    } else {
      setEmployees([]);
      setAttendance({});
    }
  }, [batchId]);

  const handleMarkAttendance = (employeeId, status) => {
    setAttendance((prev) => ({ ...prev, [employeeId]: status }));
  };

  const handleSubmit = () => {
    if (!date) {
      alert("Please select a date before submitting attendance.");
      return;
    }

    const marker = user?.email || 'Unknown Marker';
    const records = employees.map((emp) => ({
      employeeId: emp.employeeId,
      date: new Date(date).toISOString().split('T')[0],
      status: attendance[emp.employeeId] || 'Absent',
      marker,
      type: "TRAINING",
      process: emp.process || 'N/A'  
    }));

    saveTrainingAttendance(records)
      .then(() => {
        alert('Training attendance saved successfully!');
        setAttendance({});
      })
      .catch((error) => {
        console.error('Error saving training attendance:', error);
        alert('Failed to save training attendance.');
      });
  };

  const isFormFilled = date && batchId;

  // Compute min and max date limits
  const minDate = trainingStartDate;
  const maxDate = trainingStartDate && trainingDays
    ? new Date(new Date(trainingStartDate).setDate(
        new Date(trainingStartDate).getDate() + trainingDays - 1
      )).toISOString().split('T')[0]
    : '';

  return (
    <div style={{ padding: '20px' }}>
      <h2>Training Attendance Dashboard</h2>

      {/* Filters */}
        <div>
          <label>Training Batch:</label><br />
          <select
            value={batchId}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedBatch = batchOptions.find(b => b.id.toString() === selectedId);
              setBatchId(selectedId);
              if (selectedBatch) {
                setTrainingStartDate(selectedBatch.trainingStartDate);
                setTrainingDays(selectedBatch.trainingDays);
              }
            }}
          >
            <option value="">Select Batch</option>
            {batchOptions.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.batchCode} - {batch.trainingStartDate}
              </option>
            ))}
          </select>
        </div>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label>Date:</label><br />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={minDate}
            max={maxDate}
          />
        </div>
      </div>

      {/* Employee Attendance Table */}
      {isFormFilled && (
        <>
          {employees.length === 0 ? (
            <p>No employees found for the selected batch.</p>
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
                    <tr key={emp.employeeId || emp.id}>
                      <td>{emp.name}</td>
                      <td>
                        <button
                          onClick={() => handleMarkAttendance(emp.employeeId || emp.id, 'Present')}
                          style={{
                            backgroundColor:
                              attendance[emp.employeeId || emp.id] === 'Present' ? '#4caf50' : '#e0e0e0',
                            marginRight: '10px',
                          }}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(emp.employeeId || emp.id, 'Absent')}
                          style={{
                            backgroundColor:
                              attendance[emp.employeeId || emp.id] === 'Absent' ? '#f44336' : '#e0e0e0',
                            marginRight: '10px',
                          }}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(emp.employeeId || emp.id, 'Half day')}
                          style={{
                            backgroundColor:
                              attendance[emp.employeeId || emp.id] === 'Half day' ? '#ff9800' : '#e0e0e0',
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

export default TrainingAttendance;

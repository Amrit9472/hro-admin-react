import React, { useState, useEffect } from 'react';
import { useAuth } from "../components/AuthProvider";
import {
  getProcesses,
  getCandidatesByProcess,
  submitTrainingBatch,
  getProcessCode,
  getNextBatchSerial,
} from './services/TrainingBatchService.js';
import './css/TrainingBatch.css';

const TrainingBatch = () => {
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);

  const { employeeUser } = useAuth();
  const user = employeeUser;

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    trainingStartDate: '',
    faculty: '',
    maxAttempts: '',
    totalMarks: '',
    passingMarks: '',
    certificateRequired: 'no',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const facultyOptions = ['John Doe', 'Jane Smith', 'Alice Brown', 'Bob White'];

  useEffect(() => {
    getProcesses()
      .then(res => setProcesses(res.data))
      .catch(() => setProcesses([]));
  }, []);

  useEffect(() => {
    if (selectedProcess) {
      getCandidatesByProcess(selectedProcess)
        .then(res => {
          const allCandidates = res.data;
          const trainingCandidates = allCandidates.filter(c => c.type === "TRAINING");

          setCandidates(trainingCandidates);
          setSelectedCandidateIds(trainingCandidates.map(c => c.employeeId));
        })
        .catch(() => {
          setCandidates([]);
          setSelectedCandidateIds([]);
        });
    } else {
      setCandidates([]);
      setSelectedCandidateIds([]);
    }
  }, [selectedProcess]);

  const onProcessChange = (e) => {
    setSelectedProcess(e.target.value);
  };

  const openModal = () => {
    setFormData({
      trainingStartDate: '',
      faculty: '',
      maxAttempts: '',
      totalMarks: '',
      passingMarks: '',
      certificateRequired: 'no',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!formData.trainingStartDate) {
      errors.trainingStartDate = 'Required';
    } else if (formData.trainingStartDate < today) {
      errors.trainingStartDate = 'Date cannot be in the past';
    }

    if (!formData.faculty) errors.faculty = 'Required';

    if (!formData.maxAttempts) {
      errors.maxAttempts = 'Required';
    } else if (isNaN(formData.maxAttempts) || +formData.maxAttempts < 1 || +formData.maxAttempts > 5) {
      errors.maxAttempts = 'Must be a number between 1 and 5';
    }

    if (!formData.totalMarks) {
      errors.totalMarks = 'Required';
    } else if (isNaN(formData.totalMarks) || +formData.totalMarks < 1 || +formData.totalMarks > 200) {
      errors.totalMarks = 'Must be a number between 1 and 200';
    }

    if (!formData.passingMarks) {
      errors.passingMarks = 'Required';
    } else if (
      isNaN(formData.passingMarks) ||
      +formData.passingMarks < 1 ||
      +formData.passingMarks >= +formData.totalMarks
    ) {
      errors.passingMarks = 'Must be less than total marks and greater than 0';
    }

    if (!formData.certificateRequired) errors.certificateRequired = 'Required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    if (!selectedProcess) {
      alert('Please select a process first.');
      return;
    }

    if (!user?.city || user.city.length < 3) {
      alert('User location data not available or invalid for batch ID generation.');
      return;
    }

    if (selectedCandidateIds.length === 0) {
      alert('No candidates available to submit.');
      return;
    }

    setLoading(true);

    try {
      const processCodeRes = await getProcessCode(selectedProcess);
      const processCode = processCodeRes.data.processCode;

      const locationPart = user.city.substring(0, 3).toUpperCase();
      const processInitials = selectedProcess.replace(/\s+/g, '').substring(0, 3).toUpperCase();
      const prefix = `${locationPart}${processInitials}${processCode}`;

      const serialRes = await getNextBatchSerial(prefix);
      let serialNum = serialRes.data.nextSerial;
      const serialStr = String(serialNum).padStart(3, '0');
      const batchId = `${prefix}${serialStr}`;

      const payload = {
        process: selectedProcess,
        city: user?.city,
        trainingStartDate: formData.trainingStartDate,
        faculty: formData.faculty,
        maxAttempts: Number(formData.maxAttempts),
        totalMarks: Number(formData.totalMarks),
        passingMarks: Number(formData.passingMarks),
        certificateRequired: formData.certificateRequired === 'yes',
        candidateIds: selectedCandidateIds,
      };

      await submitTrainingBatch(payload);
      alert(`Details submitted successfully! Batch ID: ${batchId}`);
      closeModal();

      const updatedCandidatesRes = await getCandidatesByProcess(selectedProcess);
      const allUpdatedCandidates = updatedCandidatesRes.data;
      const trainingUpdatedCandidates = allUpdatedCandidates.filter(c => c.type === "TRAINING");

      setCandidates(trainingUpdatedCandidates);
      setSelectedCandidateIds(trainingUpdatedCandidates.map(c => c.employeeId));
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="training-attendance-container">
      <h2>Training Batch ID Creation</h2>
      <div className="filter-section">
        <label htmlFor="processFilter">Filter by Process:</label>
        <select id="processFilter" value={selectedProcess} onChange={onProcessChange}>
          <option value="">-- Select Process --</option>
          {processes.map((proc) => (
            <option key={proc} value={proc}>
              {proc}
            </option>
          ))}
        </select>
      </div>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Process</th>
            <th>Induction Complete Date</th>
          </tr>
        </thead>
        <tbody>
          {candidates.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
                No candidates found.
              </td>
            </tr>
          ) : (
            candidates.map((c, index) => (
              <tr key={`${c.employeeId}-${index}`}>
                <td>{c.fullName}</td>
                <td>{c.process}</td>
                <td>
                  {c.inductionCompleteDate
                    ? new Date(c.inductionCompleteDate).toLocaleDateString()
                    : '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button className="generate-btn" onClick={openModal}>
        Generate Batch ID
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Generate Batch ID</h3>

            <div className="form-group">
              <label>Training Start Date:</label>
              <input
                type="date"
                name="trainingStartDate"
                min={todayStr}
                value={formData.trainingStartDate}
                onChange={onInputChange}
                disabled={loading}
              />
              {formErrors.trainingStartDate && (
                <div className="error-msg">{formErrors.trainingStartDate}</div>
              )}
            </div>

            <div className="form-group">
              <label>Faculty:</label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={onInputChange}
                disabled={loading}
              >
                <option value="">-- Select Faculty --</option>
                {facultyOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              {formErrors.faculty && <div className="error-msg">{formErrors.faculty}</div>}
            </div>

            <div className="form-group">
              <label>Max Attempts:</label>
              <input
                type="number"
                name="maxAttempts"
                min="1"
                max="5"
                value={formData.maxAttempts}
                onChange={onInputChange}
                disabled={loading}
              />
              {formErrors.maxAttempts && (
                <div className="error-msg">{formErrors.maxAttempts}</div>
              )}
            </div>

            <div className="form-group">
              <label>Total Marks:</label>
              <input
                type="number"
                name="totalMarks"
                min="1"
                max="200"
                value={formData.totalMarks}
                onChange={onInputChange}
                disabled={loading}
              />
              {formErrors.totalMarks && (
                <div className="error-msg">{formErrors.totalMarks}</div>
              )}
            </div>

            <div className="form-group">
              <label>Passing Marks:</label>
              <input
                type="number"
                name="passingMarks"
                min="1"
                value={formData.passingMarks}
                onChange={onInputChange}
                disabled={loading}
              />
              {formErrors.passingMarks && (
                <div className="error-msg">{formErrors.passingMarks}</div>
              )}
            </div>

            <div className="form-group">
              <label>Certificate Required:</label>
              <select
                name="certificateRequired"
                value={formData.certificateRequired}
                onChange={onInputChange}
                disabled={loading}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {formErrors.certificateRequired && (
                <div className="error-msg">{formErrors.certificateRequired}</div>
              )}
            </div>

            <div className="form-group">
              <label>All Candidates Included:</label>
              <ul>
                {candidates.map((c) => (
                  <li key={`${c.employeeId}`}>{c.fullName}</li>
                ))}
              </ul>
            </div>

            <button onClick={onSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>

            <button onClick={closeModal} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingBatch;

import React, { useEffect, useState } from 'react';
import {
  getTrainingBatches,
  getCandidatesForBatch,
  getScoreMeta,
  saveMultipleTrainingScores,
} from './services/TrainingScoreService';
import './css/TrainingScore.css';

const TrainingScore = () => {
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [scores, setScores] = useState({});
  const [meta, setMeta] = useState({ maxAttempts: 0, passingMarks: 0 });
  const [result, setResult] = useState({}); // For pass/fail display

  useEffect(() => {
    getTrainingBatches()
      .then(res => setBatches(res.data))
      .catch(console.error);
  }, []);

  const handleBatchChange = (e) => {
    const selectedId = e.target.value;
    setBatchId(selectedId);
    if (selectedId) {
      getScoreMeta(selectedId)
        .then((res) => {
          const { maxAttempts, passingMarks } = res.data;
          setMeta({ maxAttempts, passingMarks });

          getCandidatesForBatch(selectedId).then((res) => {
            setCandidates(res.data);

            // Initialize scores object keyed by employeeId
            const initialScores = {};
            res.data.forEach((c) => {
              initialScores[c.employeeId] = Array(maxAttempts).fill('');
            });
            setScores(initialScores);
            setResult({});
          });
        })
        .catch(console.error);
    } else {
      // Reset all if no batch selected
      setCandidates([]);
      setScores({});
      setMeta({ maxAttempts: 0, passingMarks: 0 });
      setResult({});
    }
  };

  const handleScoreChange = (empId, index, value) => {
    setScores((prev) => {
      const updated = { ...prev };
      const attemptsCopy = [...(updated[empId] || [])];
      attemptsCopy[index] = value;
      updated[empId] = attemptsCopy;
      return updated;
    });
  };

  const calculatePassFail = (attempts) => {
    return attempts.some((s) => parseInt(s, 10) >= meta.passingMarks);
  };

  const handleSubmit = () => {
  // Validation: Check for negative scores
  const hasNegativeScores = Object.entries(scores).some(([_, attempts]) =>
    attempts.some(score => score !== '' && parseInt(score, 10) < 0)
  );

  if (hasNegativeScores) {
    alert('Scores must be greater than or equal to 0. Please correct the negative values.');
    return;
  }

  const payload = Object.entries(scores).map(([employeeId, attempts]) => ({
    employeeId: parseInt(employeeId),
    trainingBatchId: parseInt(batchId),
    scores: attempts.map((s) => (s === '' ? null : parseInt(s, 10))),
    certified: calculatePassFail(attempts),
  }));

  saveMultipleTrainingScores(payload)
    .then(() => {
      const newResults = {};
      payload.forEach((p) => {
        newResults[p.employeeId] = p.certified ? 'Pass' : 'Fail';
      });
      setResult(newResults);
      alert('Scores submitted successfully');
    })
    .catch((err) => {
      console.error('Error submitting scores:', err);
      alert('Error submitting scores');
    });
};


  return (
    <div className="training-score-container">
      <h2>Training Scores</h2>
      <select value={batchId} onChange={handleBatchChange}>
        <option value="">Select Batch</option>
        {batches.map((batch) => (
          <option key={batch.id} value={batch.id}>
            {batch.batchCode}
          </option>
        ))}
      </select>

      {candidates.length > 0 && (
        <>
          <table className="score-table">
            <thead>
              <tr>
                <th>Candidate</th>
                {[...Array(meta.maxAttempts)].map((_, i) => (
                  <th key={i}>Attempt {i + 1}</th>
                ))}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((emp) => (
                <tr key={emp.employeeId}>
                  <td>{emp.name}</td>
                  {[...Array(meta.maxAttempts)].map((_, idx) => (
                    <td key={idx}>
                      <input
                        type="number"
                        min="0"
                        value={scores[emp.employeeId]?.[idx] || ''}
                        onChange={(e) =>
                          handleScoreChange(emp.employeeId, idx, e.target.value)
                        }
                      />
                    </td>
                  ))}
                  <td>
                    {result[emp.employeeId] ? (
                      result[emp.employeeId] === 'Pass' ? (
                        <span className="pass">Pass</span>
                      ) : (
                        <span className="fail">Fail</span>
                      )
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmit}>Submit Scores</button>
        </>
      )}
    </div>
  );
};

export default TrainingScore;


import React, { useEffect, useState } from 'react';
import { getValuesInDropDown, getGridValues, getLoiDetailsByGrid } from '../components/services/LoiService'; // Adjust path as needed

function LoiDropdownForm() {
    const [dropdownData, setDropdownData] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedCompanyType, setSelectedCompanyType] = useState('');
    const [filteredData, setFilteredData] = useState([]); // State for filtered data
    const [showGrid, setShowGrid] = useState(false); // State to control grid visibility
    const [dropdownOptionsFromGrid, setDropdownOptionsFromGrid] = useState([]);
    const [selectedOptionFromGrid, setSelectedOptionFromGrid] = useState('');
    const [loiDetails, setLoiDetails] = useState(null);

    useEffect(() => {
        getValuesInDropDown()
            .then(response => {
                setDropdownData(response.data);
            })
            .catch(error => {
                console.error('Error fetching dropdown data:', error);
            });
    }, []);

    // Extract unique values using Set
    const uniqueProcesses = [...new Set(dropdownData.map(item => item.process))];
    const uniqueGrades = [...new Set(dropdownData.map(item => item.grade))];
    const uniqueCompanyTypes = [...new Set(dropdownData.map(item => item.companyType))];



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await getGridValues(
                selectedProcess.trim(),
                selectedGrade.trim(),
                selectedCompanyType.trim()
            );
            setFilteredData(response.data);
            setDropdownOptionsFromGrid(response.data.map(item => item.grid));
            setShowGrid(true);
        } catch (error) {
            console.error('Error fetching filtered data:', error);
        }
    };

    const handleGridSelection = async (e) => {
        const selectedGrid = e.target.value;
        setSelectedOptionFromGrid(selectedGrid);

        try {
            const response = await getLoiDetailsByGrid(selectedGrid);
            setLoiDetails(response.data);
        } catch (error) {
            console.error('Error fetching LOI details:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h4>LOI Filter Form</h4>
            <form onSubmit={handleSubmit}>
                {/* Process Dropdown */}
                <div className="mb-3">
                    <label className="form-label">Process</label>
                    <select className="form-select" value={selectedProcess} onChange={e => setSelectedProcess(e.target.value)}>
                        <option value="">-- Select Process --</option>
                        {uniqueProcesses.map((process, index) => (
                            <option key={index} value={process}>{process}</option>
                        ))}
                    </select>
                </div>

                {/* Grade Dropdown */}
                <div className="mb-3">
                    <label className="form-label">Grade</label>
                    <select className="form-select" value={selectedGrade} onChange={e => setSelectedGrade(e.target.value)}>
                        <option value="">-- Select Grade --</option>
                        {uniqueGrades.map((grade, index) => (
                            <option key={index} value={grade}>{grade}</option>
                        ))}
                    </select>
                </div>

                {/* Company Type Dropdown */}
                <div className="mb-3">
                    <label className="form-label">Company Type</label>
                    <select className="form-select" value={selectedCompanyType} onChange={e => setSelectedCompanyType(e.target.value)}>
                        <option value="">-- Select Company Type --</option>
                        {uniqueCompanyTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

            {dropdownOptionsFromGrid.length > 0 && (
                <div className="mb-3 mt-3">
                    <label className="form-label">Filtered Grid Values</label>
                    <select
                        className="form-select"
                        value={selectedOptionFromGrid}
                        onChange={handleGridSelection}
                    >
                        <option value="">-- Select Grid --</option>
                        {dropdownOptionsFromGrid.map((gridValue, index) => (
                            <option key={index} value={gridValue}>{gridValue}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* {loiDetails && (
                <div className="mt-4">
                    <h5>LOI Details:</h5>
                    <ul className="list-group">
                        <li className="list-group-item"><strong>Process:</strong> {loiDetails.process}</li>
                        <li className="list-group-item"><strong>Grade:</strong> {loiDetails.grade}</li>
                        <li className="list-group-item"><strong>Company Type:</strong> {loiDetails.companyType}</li>
                        <li className="list-group-item"><strong>CTC:</strong> {loiDetails.ctc}</li>
                        <li className="list-group-item"><strong>Take Home:</strong> {loiDetails.takeHome}</li>
                        <li className="list-group-item"><strong>Training Applicable:</strong> {loiDetails.trainingApplicable}</li>
                        <li className="list-group-item"><strong>Training Days:</strong> {loiDetails.trainingDays}</li>
                        
                    </ul>
                </div>
            )} */}

            {loiDetails && (
                <div className="mt-4">
                    <h5>LOI Details (Editable for PDF):</h5>
                    <form id="loiDetailsForm">
                        <div className="mb-3">
                            <label className="form-label">Process</label>
                            <input
                                type="text"
                                className="form-control"
                                defaultValue={loiDetails.process}
                                name="process"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Grade</label>
                            <input
                                type="text"
                                className="form-control"
                                defaultValue={loiDetails.grade}
                                name="grade"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Company Type</label>
                            <input
                                type="text"
                                className="form-control"
                                defaultValue={loiDetails.companyType}
                                name="companyType"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">CTC</label>
                            <input
                                type="number"
                                className="form-control"
                                defaultValue={loiDetails.ctc}
                                name="ctc"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Take Home</label>
                            <input
                                type="number"
                                className="form-control"
                                defaultValue={loiDetails.takeHome}
                                name="takeHome"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Training Applicable</label>
                            <input
                                type="text"
                                className="form-control"
                                defaultValue={loiDetails.trainingApplicable}
                                name="trainingApplicable"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Training Days</label>
                            <input
                                type="text"
                                className="form-control"
                                defaultValue={loiDetails.trainingDays}
                                name="trainingDays"
                            />
                        </div>

                        {/* Add more fields as needed */}

                        <button type="button" className="btn btn-success mt-3" onClick={() => generatePDF()}>
                            Generate PDF
                        </button>
                    </form>
                </div>
            )}

        </div>
    );
}
export default LoiDropdownForm;
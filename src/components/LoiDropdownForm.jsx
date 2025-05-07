import React, { useEffect, useState } from 'react';
import { getValuesInDropDown, getGridValues, getLoiDetailsByGrid } from '../components/services/LoiService';
import { saveEmployeeLoi } from './services/OurEmployeeService';
import { useAuth } from '../components/AuthProvider';

function LoiDropdownForm({ selectedEmployee, setSelectedEmployee, refreshEmployeeList }) {
    const [dropdownData, setDropdownData] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedCompanyType, setSelectedCompanyType] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [showGrid, setShowGrid] = useState(false);
    const [dropdownOptionsFromGrid, setDropdownOptionsFromGrid] = useState([]);
    const [selectedOptionFromGrid, setSelectedOptionFromGrid] = useState('');
    const [loiDetails, setLoiDetails] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const { user } = useAuth();
    const [joiningDate, setJoiningDate] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');

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

            // Log the response data to understand its structure
            console.log('Response from getGridValues:', response.data);

            // Ensure that the response.data is an array
            if (Array.isArray(response.data)) {
                setFilteredData(response.data);

                const departments = [...new Set(response.data.flatMap(item =>
                    Array.isArray(item.departmentDropdown)
                        ? item.departmentDropdown.map(dep => dep.name)
                        : []
                ))];

                const designations = [...new Set(response.data.flatMap(item =>
                    Array.isArray(item.designationDropdown)
                        ? item.designationDropdown.map(desig => desig.name)
                        : []
                ))];

                setDepartments(departments);
                setDesignations(designations);
                setDropdownOptionsFromGrid(response.data.map(item => item.grid));
                setShowGrid(true);
            } else {
                console.error('Expected response.data to be an array, but got:', response.data);
            }
        } catch (error) {
            console.error('Error fetching filtered data:', error);
        }
    };

    const handleGridSelection = async (e) => {
        const selectedGrid = e.target.value;
        setSelectedOptionFromGrid(selectedGrid);

        try {
            // Fetch LOI details based on the selected grid option
            const response = await getLoiDetailsByGrid(selectedGrid, user.city);
            const loiData = response.data;
            console.log("Response data grid" , response.data)
            // Update loiDetails with the latest data
            setLoiDetails(loiData);

            // Update the respective state fields based on the fetched data
            setSelectedDepartment(loiData.departmentDropdown[0]?.name || ''); // Set to first department or empty
            setSelectedDesignation(loiData.designationDropdown[0]?.name || ''); // Set to first designation or empty
            setJoiningDate(loiData.joiningDate || ''); // Update with joining date if available
        } catch (error) {
            console.error('Error fetching LOI details:', error);
        }
    };

    const handleGeneratePdf = async () => {
        const loiData = {
            process: selectedProcess,
            grade: selectedGrade,
            companyType: selectedCompanyType,
            ctc: loiDetails?.ctc,
            takeHome: loiDetails?.takeHome,
            trainingApplicable: loiDetails?.trainingApplicable,
            trainingDays: loiDetails?.trainingDays,
            joiningDate: joiningDate,
            selectedGrid: selectedOptionFromGrid,
            department: selectedDepartment,
            designation: selectedDesignation,
            appenticeEnrollment:loiDetails?.appenticeEnrollment,
            aitmEnrollment:loiDetails?.aitmEnrollment
        };

        try {
            const response = await saveEmployeeLoi(loiData, selectedEmployee.id, {
                responseType: 'blob' // Important to specify response type
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'employee_details.pdf');

            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            console.log('LOI saved and PDF generated successfully.');
            setSelectedEmployee(null);
            refreshEmployeeList();
        } catch (error) {
            console.error('Error generating LOI:', error);
        }
    };

    return (
        <div className="container mt-6">
            <h4>LOI Generations</h4>
            <form onSubmit={handleSubmit} className='d-flex align-items-center gap-3'>
                <div className="mb-3">
                    <select className="form-select"
                        value={selectedProcess}
                        style={{ width: '172px', height: '50px' }}
                        onChange={e => setSelectedProcess(e.target.value)}>
                        <option value="">- Select Process -</option>
                        {uniqueProcesses.map((process, index) => (
                            <option key={index} value={process}>{process}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <select className="form-select"
                        value={selectedGrade}
                        style={{ width: '172px', height: '50px' }}
                        onChange={e => setSelectedGrade(e.target.value)}
                    >
                        <option value="">- Select Grade -</option>
                        {uniqueGrades.map((grade, index) => (
                            <option key={index} value={grade}>{grade}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <select className="form-select"
                        value={selectedCompanyType}
                        style={{ width: '172px', height: '50px' }}
                        onChange={e => setSelectedCompanyType(e.target.value)}>
                        <option value="">- Select Company -</option>
                        {uniqueCompanyTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <button type="submit"
                        style={{ width: '172px', height: '50px' }}
                        className="btn btn-primary">Search</button>
                </div>
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

            {loiDetails && (
                <div className="mt-6">
                    <h5>LOI Details (Editable for PDF):</h5>
                    <form id="loiDetailsForm" >
                        <div className="row">
                            {/* Left side inputs */}
                            <div className=" col-12 col-md-6">
                                {loiDetails.departmentDropdown && loiDetails.departmentDropdown.length > 0 && (
                                    <div className="mb-3">
                                        <label className="form-label">Departments</label>
                                        <select className="form-select"
                                            value={selectedDepartment}
                                            onChange={(e) => setSelectedDepartment(e.target.value)}>
                                            <option value="">-- Select Department --</option>
                                            {loiDetails.departmentDropdown.map((dep, index) => (
                                                <option key={index} value={dep.name}>{dep.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Designations Dropdown */}
                                {loiDetails.designationDropdown && loiDetails.designationDropdown.length > 0 && (
                                    <div className="mb-3">
                                        <label className="form-label">Designations</label>
                                        <select className="form-select"
                                            value={selectedDesignation}
                                            onChange={(e) => setSelectedDesignation(e.target.value)}>
                                            <option value="">-- Select Designation --</option>
                                            {loiDetails.designationDropdown.map((desig, index) => (
                                                <option key={index} value={desig.name}>{desig.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label className="form-label">Process</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={loiDetails.process || ''}
                                        readOnly // Change to controlled input if editing is required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Grade</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={loiDetails.grade || ''}
                                        readOnly // Change to controlled input if editing is required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Company Type</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={loiDetails.companyType || ''}
                                        readOnly // Change to controlled input if editing is required
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="mb-3">
                                    <label className="form-label">CTC</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={loiDetails.ctc || ''}
                                        readOnly // Change to controlled input if editing is required
                                    />
                                </div>


                                <div className="mb-3">
                                    <label className="form-label">Take Home</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={loiDetails.takeHome || ''}
                                        readOnly // Change to controlled input if editing is required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Appentice Enrollment</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={loiDetails.appenticeEnrollment || ''}
                                        readOnly // Change to controlled input if editing is required
                                    />
                                </div>
                          
                                <div className="mb-3">
                                    <label className="form-label">AITM Enrollment</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={loiDetails.aitmEnrollment || ''}
                                        readOnly // Change to controlled input if editing is required
                                    />
                                </div>
                                {/* <div className="mb-3">
                            <label className="form-label">Training Applicable</label>
                            <input
                                type="text"
                                className="form-control"
                                value={loiDetails.trainingApplicable || ''}
                                readOnly // Change to controlled input if editing is required
                            />
                        </div> */}

                                <div className="mb-3">
                                    <label className="form-label">Training Applicable</label>
                                    <select
                                        className="form-select"
                                        value={loiDetails.trainingApplicable ? 'Yes' : 'No'}
                                        onChange={(e) => {

                                            const isTrainingApplicable = e.target.value === 'Yes';
                                            setLoiDetails(prevDetails => ({ ...prevDetails, trainingApplicable: isTrainingApplicable }));
                                        }}
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Apprentice Enrollment</label>
                                    <select
                                        className="form-select"
                                        value={loiDetails.appenticeEnrollment}
                                        onChange={(e) => setLoiDetails(prev => ({ ...prev, appenticeEnrollment: e.target.value }))}
                                    >
                                        <option value="Applicable">Applicable</option>
                                        <option value="NotApplicable">NotApplicable</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">AITM Enrollment</label>
                                    <select
                                        className="form-select"
                                        value={loiDetails.aitmEnrollment}
                                        onChange={(e) => setLoiDetails(prev => ({ ...prev, aitmEnrollment: e.target.value }))}
                                    >
                                        <option value="Applicable">Applicable</option>
                                        <option value="NotApplicable">NotApplicable</option>
                                    </select>
                                </div>


                                <div className="mb-3">
                                    <label className="form-label">Training Days</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={loiDetails.trainingDays || ''}
                                        readOnly
                                    />
                                </div>

                                <div className='mb-3'>
                                    <label className="form-label">Joining Date</label>
                                    <input
                                        type='date'
                                        className="form-control"
                                        name='joiningDate'
                                        value={joiningDate}
                                        onChange={(e) => setJoiningDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="button" className="btn btn-success mt-3" onClick={handleGeneratePdf}>
                                Generate PDF
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default LoiDropdownForm;
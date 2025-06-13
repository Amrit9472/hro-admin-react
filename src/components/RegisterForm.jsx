import React, { useState, useEffect } from "react";
import UsersService from "../components/services/UserServices";
import { getAllProcessNameCodeRegisterPage } from "../components/services/ProcessService";

UsersService.initialize();

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    officeEmail: "",
    name: "",
    password: "",
    city: "",
    role: "",
    process: "",
    processCode: "",
    branch: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const locationBranchMap = {
    Mumbai: ["Mumbai-Highstreet", "Airoli-Reliable", "Airoli-Empire"],
    Noida: ["Noida", "Noida-TrapezoidPark"],
    Chennai: ["Chennai", "Chennai-TekTower"],
    Bangalore: ["Bangalore", "Bangalore-Alcove"],
    Pune: ["Pune"],
    Telangana: ["Telangana"],
  };

  const [processList, setProcessList] = useState([]);
  useEffect(() => {
    const fetchProcessList = async () => {
      try {
        const response = await getAllProcessNameCodeRegisterPage();
        setProcessList(response.data);
      } catch (error) {
        console.error("Error fetching process list:", error);
      }
    };

    fetchProcessList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await UsersService.register(formData);
      setMessage("Registration successful!");
      console.log("Response:", res);
      setFormData({
        email: "",
        officeEmail: "",
        name: "",
        password: "",
        city: "",
        role: "",
        process: "",
        processCode: "",
      });
    } catch (error) {
      setMessage("Registration failed. Please try again.");
      console.error("Error during registration:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '2000px', // Set maximum width
          padding: '80px',
          boxSizing: 'border-box'
        }}
      >
        <h2 className="text-center mb-3" style={{ color: 'darkgoldenrod' }}>User Access</h2>

        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-2">
            <span class="input-group-text" id="addon-wrapping">Emp ID</span>
            <input
              type="text"
              name="email"
              className="form-control"
              placeholder="ID should be XXXXXX"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group mb-2">
            <span class="input-group-text" id="addon-wrapping">Email</span>
            <input
              type="text"
              name="officeEmail"
              className="form-control"
              // placeholder="ID should be XXXXXX"
              value={formData.officeEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group  mb-2">
            <span class="input-group-text" id="addon-wrapping">Name</span>
            <input
              type="text"
              name="name"
              placeholder="Enter the Full Name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group mb-2">
            <span class="input-group-text" id="addon-wrapping">password</span>
            <input
              type="password"
              name="password"
              placeholder="Should be Strong "
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="input-group mb-2">
            <span class="input-group-text" id="addon-wrapping">city</span>
            {/* <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="form-control"
            /> */}
            <select
              className="form-select"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            >
              <option value="">Select an Applied Location</option>
              {Object.keys(locationBranchMap).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="input-group mb-2">
            <span className="input-group-text" htmlFor="branch">Branch</span>
            <select
              className="form-select"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              disabled={!formData.city}
              required
            >
              <option value="">Select a Branch</option>
              {(locationBranchMap[formData.city] || []).map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>


          <div className="input-group  mb-2">
            <label class="input-group-text" for="inputGroupSelect01">Options</label>
            <select
              class="form-select" id="inputGroupSelect01"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option selected>Select Role</option>
              <option value="ADMIN">ADMIN</option>
              <option value="HR">HR</option>
              <option value="MANAGER">MANAGER</option>
              <option value="USER">USER</option>
              <option value="TRAINER">TRAINER</option>
              <option value="PAYROLL">PAYROLL</option>
              <option value="ER">ER</option>
            </select>
          </div>
          {/* <div className="input-group mb-2">
            <span class="input-group-text" id="addon-wrapping">Process</span>
            <input
              type="text"
              name="process"
              placeholder="Process"
              value={formData.process}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="input-group  mb-2">
            <span class="input-group-text" id="addon-wrapping">code</span>
            <input
              type="text"
              name="processCode"
              placeholder="Process Code"
              value={formData.processCode}
              onChange={handleChange}
              className="form-control"
            />
          </div> */}
          {/* Process Name Dropdown */}
          <div className="input-group mb-2">
            <label className="input-group-text" htmlFor="process">Process</label>
            <select
              className="form-select"
              name="process"
              value={formData.process}
              onChange={handleChange}
              required
            >
              <option value="">Select Process Name</option>
              {processList.map((process) => (
                <option key={process.name} value={process.name}>
                  {process.name}
                </option>
              ))}
            </select>
          </div>

          {/* Process Code Dropdown */}
          <div className="input-group mb-2">
            <label className="input-group-text" htmlFor="processCode">Code</label>
            <select
              className="form-select"
              name="processCode"
              value={formData.processCode}
              onChange={handleChange}
              required
            >
              <option value="">Select Process Code</option>
              {processList.map((process) => (
                <option key={process.code} value={process.code}>
                  {process.code}
                </option>
              ))}
            </select>
          </div>



          <div className="d-flex justify-content-center mt-4">
            <button type="submit" disabled={loading} className="btn btn-primary text-align-center" >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>

    </div>

  );
};

export default RegisterForm;

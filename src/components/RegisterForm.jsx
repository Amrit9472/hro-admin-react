import React, { useState } from "react";
import UsersService from "../components/services/UserServices";
import './css/RegisterForm.css'
// Make sure to call UsersService.initialize() at app start (once)
UsersService.initialize();

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    city: "",
    role: "",
    process: "",
    processCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    <div className="register-container">
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />
       <select
    name="role"
    value={formData.role}
    onChange={handleChange}
    required
  >
    <option value="">Select Role</option>
    <option value="ADMIN">ADMIN</option>
    <option value="HR">HR</option>
    <option value="MANAGER">MANAGER</option>
    <option value="USER">USER</option>
    <option value="TRAINER">TRAINER</option>
    <option value="PAYROLL">PAYROLL</option>
    <option value="ER">ER</option>
  </select>

        <input
          type="text"
          name="process"
          placeholder="Process"
          value={formData.process}
          onChange={handleChange}
        />
        <input
          type="text"
          name="processCode"
          placeholder="Process Code"
          value={formData.processCode}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;

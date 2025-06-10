import React, { useState } from 'react';
import VendorService from './services/VendorService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VendorRegister = () => {
  const [formData, setFormData] = useState({
    address: '',
    email: '',
    name: '',
    password: '',
    role: 'VENDOR', 
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await VendorService.register(formData);
    if (result.statusCode && result.statusCode !== 200) {
      toast.error(result.error || result.message || 'Registration failed.');
    }else {
      toast.success(result.message);
      console.log('User registered:', result);
        setFormData({
        address: '',
        email: '',
        name: '',
        password: '',
        role: 'VENDOR'
      });
    }
    } catch (error) {
      setMessage('Registration failed. Check console for details.');
      console.error('Registration error:', error);
       const backendMessage = error?.response?.data?.error || error?.response?.data?.message;
       toast.error(backendMessage || 'An unexpected error occurred.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <form onSubmit={handleSubmit}>

        <div className="input-group mb-3">
          <span className="input-group-text" id="email-addon">Email</span>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="example@domain.com"
            aria-label="Email"
            aria-describedby="email-addon"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="name-addon">Company</span>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Company Name"
            aria-label="Company Name"
            aria-describedby="name-addon"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="password-addon">Password</span>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter password"
            aria-label="Password"
            aria-describedby="password-addon"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="address-addon">Location</span>
          <input
            type="text"
            name="address"
            className="form-control"
            placeholder="Business Location"
            aria-label="Address"
            aria-describedby="address-addon"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>

    </div>
  );
};

export default VendorRegister;

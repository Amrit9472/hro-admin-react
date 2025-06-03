import React, { useState } from 'react';
import VendorService from './services/VendorService'; // Adjust the path as needed

const VendorRegister = () => {
  const [formData, setFormData] = useState({
    address: '',
    email: '',
    name: '',
    password: '',
    role: 'VENDOR', // Default role
  });

  const [message, setMessage] = useState('');

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
      setMessage('Registration successful!');
      console.log('User registered:', result);
    } catch (error) {
      setMessage('Registration failed. Check console for details.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
      
        <div>
          <label>Email:</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Company Name:</label><br />
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label><br />
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
          <div>
          <label>Location:</label><br />
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default VendorRegister;

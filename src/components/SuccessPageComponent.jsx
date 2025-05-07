import React from 'react';
import { useNavigate } from 'react-router-dom';  // Use useNavigate in v6

const SuccessPageComponent = ({ employeeId , goToHome}) => {
  // const navigate = useNavigate();  

  // const goToHome = () => {
  //   console.log('Navigating to home');
  //   navigate('/');  
  // };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Employee Created Successfully!</h2>
      <p>Your reference number is: <strong>{employeeId}</strong></p>
      <button onClick={goToHome} style={{ backgroundColor: "#D4A373", color: 'black' }}>
        Go to Home Page
      </button>
    </div>
  );
};

export default SuccessPageComponent;

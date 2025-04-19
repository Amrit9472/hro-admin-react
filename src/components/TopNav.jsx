import React from 'react';
import './css/TopNav.css';
import { useAuth } from './AuthProvider';

const TopNav = ({ role, onSelect }) => {
console.log("top nav" ,role);

const auth = useAuth()
const roleItems = {
    ADMIN: ['Interview', 'Settings', 'User Management', 'Reports'], // Admin can access all
    HR: ['Dashboard', 'Employee Management', 'Payroll'],           // HR specific items
    MANAGER: ['Dashboard', 'Interview Schedule', 'Reports'],          // Manager specific items
    USER: ['Profile'],                                             // Regular User sees only Profile
    TRAINER: ['Dashboard', 'Training Programs'],                  // Trainer specific items
    PAYROLL: ['Dashboard', 'Payroll Reports'],                    // Payroll specific items
    ER: ['Dashboard', 'Employee Relations', 'Complaints'],        // ER specific items
  };

  
  // Get navigation items for the specific role
  const items = roleItems[role] || []; // Default to empty if role is unknown
  
const handleSelect = (item) => {
  onSelect(item); // Invoke the onSelect function passed down as prop
};
  return (
    <nav className="top-nav">
      {items.map((item) => (
        <button key={item} onClick={() => handleSelect(item)}>
          {item}
        </button>
      ))}
       <button onClick={ () => auth.logOut() } className = "btn-submit" >
     logout
    </button>
    </nav>
  );
};

export default TopNav;
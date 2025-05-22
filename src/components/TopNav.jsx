import React,{useState} from 'react';
// import './css/TopNav.css';
import { useAuth } from './AuthProvider';

const TopNav = ({ role, onSelect }) => {
console.log("top nav" ,role);

const auth = useAuth();
const [activeItem, setActiveItem] = useState(null);
const roleItems = {
    ADMIN: ['Interview', 'User Management', 'Settings', 'Reports'], 
    HR: ['Dashboard', 'Employee Management', 'Payroll'],           
    MANAGER: ['Interview Schedule', 'Reports','Settings'],         
    USER: ['Profile'],                                             
    TRAINER: ['Dashboard', 'Training Programs'],                  
    PAYROLL: ['Dashboard', 'Payroll Reports'],                    
    ER: ['Dashboard', 'Employee Relations', 'Complaints'],        
  };

  

  const items = roleItems[role] || []; 
  
const handleSelect = (item) => {
  setActiveItem(item); 
  onSelect(item); 
};
  return (

<nav className="navbar navbar-light bg-dark" >
    <div className="container-fluid d-flex justify-content-between">
        <div className="d-flex">
            {items.map((item) => (
                <button 
                 key={item} 
                 type="button" 
                 className={`btn me-2 ${activeItem === item ? 'btn-light' : 'btn-outline-success'}`} 
                  onClick={() => handleSelect(item)}>
                    {item}
                </button>
            ))}
            </div>
            <button className="btn btn-outline-success" type="button" onClick={() => auth.logOut()}>
                Logout
            </button>
        
    </div>
</nav>
);
};

export default TopNav;
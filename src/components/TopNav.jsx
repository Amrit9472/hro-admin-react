import React,{useState} from 'react';
// import './css/TopNav.css';
import { useAuth } from './AuthProvider';

const TopNav = ({onSelect }) => {


const auth = useAuth();
const [activeItem, setActiveItem] = useState(null);

const role = auth?.employeeUser?.role || auth?.vendorUser?.role || "GUEST";
console.log("TopNav role:", role);

const roleItems = {
    ADMIN: ['Interview', 'User Management', 'Settings','Vendor'], 
    HR: ['Dashboard', 'Employee Management', 'Payroll'],           
    MANAGER: ['Interview Schedule', 'Settings'],         
    USER: ['Profile'],                                             
    TRAINER: ['Training attendance','Dashboard', 'Training Programs'],                  
    PAYROLL: ['Dashboard', 'Payroll Reports'],                    
    ER: ['Attendance', 'Employee Relations', 'Complaints'],        
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
            <button className="btn btn-outline-success" type="button" onClick={() => auth.logoutEmployee()}>
                Logout
            </button>
        
    </div>
</nav>
);
};

export default TopNav;
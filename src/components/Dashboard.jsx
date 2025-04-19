import React, { useState } from 'react';
import TopNav from './TopNav';
import SideNav from './SideNav';
import { useAuth } from './AuthProvider';
import '../components/css/DashBoard.css';

const Dashboard = ({ role }) => {
  const [selectedItem, setSelectedItem] = useState('Dashboard');
  const auth = useAuth()
  return (
    <div  className="dashboard-container">
      <TopNav role={auth.user?.role} onSelect={setSelectedItem} />
      <div className="main-content">
        <SideNav selectedItem={selectedItem} />
      </div>
    </div>
  );
};

export default Dashboard;
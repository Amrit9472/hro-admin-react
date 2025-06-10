import { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import EmployeeCreatePageComponent from './components/EmployeeCreatePageComponent';
import VendorLogin from './components/VendorLogin';
import WelcomePage from './components/WelcomePage';
import Attendance from './components/InductionAttendance';
import TrainingAttendance from './components/TrainingAttendance';
import TrainingScore from './components/TrainingScore';

function App() {
  // const [role, setRole] = useState(null);

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/createEmployee" element={<EmployeeCreatePageComponent />} />
          <Route path="/vendorLogin" element={<VendorLogin />} />
          <Route path="/Attendance" element={<Attendance/>} />
          <Route path="trainingattendance" element={<TrainingAttendance/>}/>
          <Route path="trainingscore" element={<TrainingScore/>}/>

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vendor-dashboard" element={<WelcomePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;

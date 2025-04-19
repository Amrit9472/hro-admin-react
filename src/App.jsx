import { useState } from 'react'
import './App.css'
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import {  BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
// import ProfileScreeningPage from './components/ProfileScreeningPage';

function App() {
 const [role , setRole] = useState(null);

 const handleLogin = (userRole) => {
  setRole(userRole);
 }
  return (
    <>
   <div>
   <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path='/profileScreening' element = {<ProfileScreeningPage/>}/> */}
          </Route>
        </Routes>
      </AuthProvider>
    </div> 
    </>
  );
};

export default App

import React, { useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';


import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Layout from './partials/Layout';

import Dashboard from './pages/Dashboard';

import NotFound from './pages/NotFound';
import Users from './pages/Users';

import Authorization from './Authorization';

import Roles from './pages/Roles';

import Profile from './pages/Profile';

import Sites from './pages/Sites';

import LoginPage from "./partials/auth/Login"
import RegisterPage from "./partials/auth/Register"
import ForgotPasswordPage from "./partials/auth/ForgotPassword"
import ResetPassword from './partials/auth/ResetPassword';
import VerifyEmail from './partials/auth/VerifyEmail';

import Patients from './pages/Patients';
import Drugs from './pages/Drugs';
import MedicalRecords from './pages/MedicalRecords';

function App() {
  const location = useLocation();
  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change
 
  return (
    
    <>
    
      <Routes>
      {/* api login */}
      <Route path="/login" element={ <LoginPage /> }  />
      <Route path="/register" element={ <RegisterPage /> }  />
      <Route path="/forgot-password" element={ <ForgotPasswordPage /> }  />
      <Route path="/reset-password" element={ <ResetPassword /> }  />
      <Route path="/verify-email" element={ <VerifyEmail /> }  />
      {/* api login */}
      <Route path='/' element={ <Authorization /> } >
        <Route path="" element={ <Layout /> }>
          {/* dahboard */}
          <Route path="" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* patients */}
          <Route path="data-pasien" element={<Patients />} />
          {/* drugs */}
          <Route path="data-obat" element={<Drugs />} />
          {/* medical records */}
          <Route path="data-rekam-medis" element={<MedicalRecords />} />
          {/* users */}
          <Route path="data-users" element={ <Users />} />
          <Route path="data-roles" element={<Roles />} />
          {/* settings */}
          <Route path="profile/:username" element={<Profile/>} />
          {/* account */}
          <Route path="data-site" element={<Sites />} />
          {/* not found */}
          <Route path='*' element={ <NotFound />} />
        </Route>
      </Route>
      
    </Routes>
    
    </>
  );
}

export default App;

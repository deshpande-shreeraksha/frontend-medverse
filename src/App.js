import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Page Components
import HomePage from './pages/HomePage';
import AppointmentPage from './pages/AppointmentPage';
import FindDoctorPage from './pages/FindDoctorPage';
import MedicationPage from './pages/MedicationPage';
import TestPage from './pages/TestPage';

import ContactPage from './pages/ContactPage';
import ServicePage from './pages/ServicePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function NotFound() {
  return <h2 className="text-center mt-5">404 - Page Not Found</h2>;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode(!darkMode);
  const handleLogin = () => (window.location.href = '/login');

  return (
    <Router>
      <div className={darkMode ? 'bg-dark text-light min-vh-100' : 'bg-light text-dark min-vh-100'}>
        {/* Navbar */}
        <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} shadow`}>
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">🩺 MedVerse</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
  <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
  <li className="nav-item"><Link className="nav-link" to="/appointment">Appointment</Link></li>
  <li className="nav-item"><Link className="nav-link" to="/doctor">Find a Doctor</Link></li>
  <li className="nav-item"><Link className="nav-link" to="/test">Book a Test</Link></li>
  <li className="nav-item"><Link className="nav-link" to="/medication">Medication</Link></li>
  <li className="nav-item"><Link className="nav-link" to="/service">Services</Link></li>
  <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
</ul>

              <button className="btn btn-outline-primary me-2" onClick={toggleTheme}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button className="btn-login" onClick={handleLogin}>Login</button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container py-4">
          <Routes>
       
            <Route path="/" element={<HomePage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/doctor" element={<FindDoctorPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/medication" element={<MedicationPage />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
           
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

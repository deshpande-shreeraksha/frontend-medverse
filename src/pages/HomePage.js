import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../styles/HomePage.css';

function HomePage() {
  const backgroundStyle = {
  backgroundImage: 'url(/images/medverse-bg.jpg)', // ✅ public folder reference
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  padding: '2rem 1rem',
  borderRadius: '12px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};


  return (
    <>
      <div className="homepage-container" style={backgroundStyle}>
        <header className="hero-section text-center">
          <h1>🩺 Welcome to MedVerse</h1>
          <p>Your personal healthcare companion</p>
        </header>

        <div className="row g-4 mt-4">
          <div className="col-md-4">
            <Link to="/doctor" className="card card-hover text-decoration-none">
              <div className="card-body text-center">
                <h5 className="card-title">Find a Doctor</h5>
                <p className="card-text">Search by specialty or mode</p>
              </div>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/medication" className="card card-hover text-decoration-none">
              <div className="card-body text-center">
                <h5 className="card-title">Medication</h5>
                <p className="card-text">Track prescriptions and set reminders</p>
              </div>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/test" className="card card-hover text-decoration-none">
              <div className="card-body text-center">
                <h5 className="card-title">Diagnostics</h5>
                <p className="card-text">Access blood, urine, and COVID test modules</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default HomePage;

import React, { useState, useEffect } from 'react';
import '../styles/FindDoctorPage.css';

const allDoctors = [
  { name: 'Dr. Asha Rao', specialty: 'Cardiology', mode: 'Video & In-Person' },
  { name: 'Dr. Ravi Menon', specialty: 'Cardiology', mode: 'Video & In-Person' },
  { name: 'Dr. Neha Jain', specialty: 'Dermatology', mode: 'Video & In-Person' },
  { name: 'Dr. Arjun Das', specialty: 'Dermatology', mode: 'Video & In-Person' },
  { name: 'Dr. Priya Nair', specialty: 'Pediatrics', mode: 'Video & In-Person' },
  { name: 'Dr. Kiran Shetty', specialty: 'Pediatrics', mode: 'Video & In-Person' },
  { name: 'Dr. Meera Kulkarni', specialty: 'General Physician',  mode: 'Video & In-Person' },
  { name: 'Dr. Sandeep Reddy', specialty: 'General Physician',  mode: 'Video & In-Person' },
];

function FindDoctorPage() {
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    const validPairs = {};

    allDoctors.forEach(doc => {
      const key = `${doc.specialty}-${doc.locality}`;
      validPairs[key] = validPairs[key] ? [...validPairs[key], doc] : [doc];
    });

    const result = Object.values(validPairs).filter(group => group.length >= 2).flat();
    setFilteredDoctors(result);
  }, []);

  return (
    <div className="doctor-container">
      <h2>Find a Doctor</h2>
      <p>Select from verified specialists in your specialization.</p>

      <div className="doctor-grid">
        {filteredDoctors.map((doc, index) => (
          <div key={index} className="doctor-card">
            <h5>{doc.name}</h5>
            <p><strong>Specialty:</strong> {doc.specialty}</p>
            <p><strong>Consultation Mode:</strong> {doc.mode}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FindDoctorPage;

import React, { useState } from 'react';
import axios from 'axios';

const TestPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    testType: '',
    date: '',
    time: '',
    mode: 'Lab Visit'
  });

  const [message, setMessage] = useState('');

  // Tests eligible for home collection
  const homeEligibleTests = [
    'Blood Test',
    'Urine Test',
    'COVID-19 RT-PCR',
    'Cholesterol Test'
  ];

  const isHomeVisitAllowed = homeEligibleTests.includes(formData.testType);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit handler with validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Phone validation: must start with 6–9 and be 10 digits
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      alert('Contact number must be 10 digits and start with 6, 7, 8, or 9.');
      return;
    }

    // ✅ Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      await axios.post('https://your-backend.onrender.com/api/tests', formData);
      setMessage('Test booked successfully!');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        testType: '',
        date: '',
        time: '',
        mode: 'Lab Visit'
      });
    } catch (err) {
      setMessage('Failed to book test. Please try again.');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">🧪 Book a Diagnostic Test</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="form-control mb-2"
        />

        {/* Email */}
        <div className="col-md-6 mb-2">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Contact Number */}
        <div className="col-md-6 mb-2">
          <label className="form-label">Contact Number</label>
          <div className="input-group">
            <span className="input-group-text">+91</span>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              pattern="[6-9]{1}[0-9]{9}"   // ✅ must start with 6–9 and be 10 digits
              required
              placeholder="10-digit mobile number"
            />
          </div>
          <div className="form-text">
            Mobile number must start with 6, 7, 8, or 9 and be 10 digits long.
          </div>
        </div>

        {/* Test Type */}
        <select
          name="testType"
          value={formData.testType}
          onChange={handleChange}
          required
          className="form-control mb-2"
        >
          <option value="">Select a Test</option>
          <option value="Blood Test">Blood Test</option>
          <option value="Urine Test">Urine Test</option>
          <option value="X-Ray">X-Ray</option>
          <option value="MRI">MRI</option>
          <option value="CT Scan">CT Scan</option>
          <option value="ECG">ECG</option>
          <option value="Ultrasound">Ultrasound</option>
          <option value="COVID-19 RT-PCR">COVID-19 RT-PCR</option>
          <option value="Thyroid Panel">Thyroid Panel</option>
          <option value="Liver Function Test">Liver Function Test</option>
          <option value="Kidney Function Test">Kidney Function Test</option>
          <option value="Cholesterol Test">Cholesterol Test</option>
        </select>

        {/* Date & Time */}
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />
        <input
          name="time"
          type="time"
          value={formData.time}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />

        {/* Mode of Test */}
        {isHomeVisitAllowed ? (
          <div className="mb-3">
            <label htmlFor="mode" className="form-label">Mode of Test</label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="Lab Visit">Lab Visit</option>
              <option value="Home Collection">Home Collection</option>
            </select>
          </div>
        ) : formData.testType ? (
          <div className="mb-3">
            <label htmlFor="mode" className="form-label">Mode of Test</label>
            <input
              type="text"
              name="mode"
              value="Lab Visit Required – In-center test"
              readOnly
              className="form-control"
              placeholder="Lab Visit Required – In-center test"
            />
            <small className="text-muted">
              This test requires a visit to the diagnostic center.
            </small>
          </div>
        ) : null}

        {/* Submit */}
        <button type="submit" className="btn btn-primary">Book Test</button>
      </form>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default TestPage;

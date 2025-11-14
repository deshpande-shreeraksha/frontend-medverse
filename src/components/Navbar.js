import React, { useState } from 'react';
import './Navbar.css'; // Make sure this CSS file exists

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

 

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo">MedVerse</h1>
        <button className="menu-btn" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`nav-links ${menuOpen ? 'show' : 'hide'}`}>
          <li><a href="/">Home</a></li>
          <li><a href="/doctors">Doctors</a></li>
          <li><a href="/medications">Medications</a></li>
          <li><a href="/diagnostics">Diagnostics</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

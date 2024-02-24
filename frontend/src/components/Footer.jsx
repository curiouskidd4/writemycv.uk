import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

export default function Footer() {
  return (
    <footer>
      <div className="wrapper">
        <p>&copy; WriteMyCV {new Date().getFullYear()}</p>

        <div className="options">
          <Link to="/terms-service">Terms of Service</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}
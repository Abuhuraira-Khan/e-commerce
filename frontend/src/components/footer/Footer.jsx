import React from "react";
import "./Footer.css"

const Footer = () => {
  return (
    <div>
      <footer>
        <div className="footer-content">
          <div className="quick-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#shop">Shop</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="social-media">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-instagram"></i>
            </div>
          </div>
          <div className="contact-info">
            <h3>Contact Us</h3>
            <p>1234 Street Name, City, Country</p>
            <p>Email: info@example.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

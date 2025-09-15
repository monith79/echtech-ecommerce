import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTiktok, FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4">
      <div className="container">
        <div className="row">
          {/* About Us Section */}
          <div className="col-md-4 mb-3 text-center">
            <h5>About E-Tech</h5>
            <p className="text-white-50">
              Your one-stop shop for the latest and greatest in new and secondhand technology products. We are committed to quality and customer satisfaction.
            </p>
          </div>

          {/* Contact Section */}
          <div className="col-md-4 mb-3 text-center">
            <h5>Contact Us</h5>
            <ul className="list-unstyled text-white-50">
              <li>Address: Phnom Penh, Cambodia</li>
              <li>Email: echtech@gmail.com</li>
              <li>Phone: +855 98 908 890</li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div className="col-md-4 mb-3 text-center">
            <h5>Follow Us</h5>
            <div className="d-flex flex-wrap justify-content-center" style={{ fontSize: '1.5rem' }}>
              <Link href="https://x.com/un_nith" className="text-white me-3"><BsTwitterX /></Link>
              <Link href="https://web.facebook.com/un.monith.5" className="text-white me-3"><FaFacebook /></Link>
              <Link href="https://www.tiktok.com/@ctrlaltdefeatfears?lang=en" className="text-white me-3"><FaTiktok /></Link>
              <Link href="https://www.instagram.com/unmonith?igsh=enpzNG56Z2M0Z3Rv&utm_source=qr" className="text-white me-3"><FaInstagram /></Link>
              <Link href="@Monith_UN" className="text-white me-3"><FaTelegram /></Link>
              <Link href="#" className="text-white"><FaWhatsapp /></Link>
            </div>
          </div>
        </div>
        <div className="text-center text-white-50 border-top border-secondary pt-3 mt-3">
          @2025_echtech product. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

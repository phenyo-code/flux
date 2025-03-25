"use client";
import { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaLinkedin, FaTwitter } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("Form submitted:", formData); // Replace with actual submission logic
    setTimeout(() => setSubmitted(false), 5000); // Reset after 5 seconds
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-24 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            We’re here to assist you. Reach out with any questions, feedback, or collaboration inquiries.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <main className="container mx-auto py-16 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
            {submitted ? (
              <div className="text-green-600 text-lg p-4 bg-green-50 rounded-md flex items-center gap-2">
                <FaEnvelope />
                <span>Thank you! We’ll get back to you soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition-all"
                    rows={5}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all w-full shadow-md hover:shadow-lg"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Reach Out to Us</h2>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <ul className="space-y-8 text-gray-600">
                <li className="flex items-start gap-4">
                  <FaEnvelope className="text-blue-600 text-2xl mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Email</h3>
                    <p>support@flux.com</p>
                    <p className="text-sm text-gray-500">Expect a response within 24 hours.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <FaPhone className="text-blue-600 text-2xl mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Phone</h3>
                    <p>+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 5 PM EST</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-blue-600 text-2xl mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Office</h3>
                    <p>123 Flux Street</p>
                    <p>Tech City, USA 90210</p>
                  </div>
                </li>
              </ul>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Business Hours</h3>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaClock className="text-blue-600" />
                  <span>Monday - Friday: 9:00 AM - 5:00 PM EST</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Closed on weekends and major holidays.</p>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://linkedin.com/company/flux"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FaLinkedin size={24} />
                  </a>
                  <a
                    href="https://twitter.com/flux_team"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FaTwitter size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">How quickly will I get a response?</h3>
              <p className="text-gray-600">We aim to respond to all inquiries within 24 business hours.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Can I schedule a call?</h3>
              <p className="text-gray-600">Yes, please include your availability in the message, and we’ll arrange it.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
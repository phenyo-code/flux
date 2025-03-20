"use client";
import Link from "next/link";
import { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("Form submitted:", formData); // Replace with actual submission logic
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Flux</h1>
          <nav>
            <ul className="flex space-x-6 text-sm font-medium">
              <li><Link href="/" className="hover:underline hover:text-blue-300">Home</Link></li>
              <li><Link href="/features" className="hover:underline hover:text-blue-300">Features</Link></li>
              <li><Link href="/pricing" className="hover:underline hover:text-blue-300">Pricing</Link></li>
              <li><Link href="/projects" className="hover:underline hover:text-blue-300">Projects</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Contact Section */}
      <main className="container mx-auto py-16 px-6">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Contact Us</h3>
            {submitted ? (
              <p className="text-green-600 text-lg">Thank you! We’ll get back to you soon.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all w-full"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Reach Out</h3>
            <ul className="space-y-6 text-gray-600">
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500 text-xl" />
                <span>support@flux.com</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-blue-500 text-xl" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-500 text-xl" />
                <span>123 Flux Street, Tech City, USA</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Flux. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
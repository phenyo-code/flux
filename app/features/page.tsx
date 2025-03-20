"use client";
import Link from "next/link";
import { FaPaintBrush, FaCogs, FaCode, FaMobileAlt } from "react-icons/fa";

export default function Features() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Flux</h1>
          <nav>
            <ul className="flex space-x-6 text-sm font-medium">
              <li><Link href="/" className="hover:underline hover:text-blue-300">Home</Link></li>
              <li><Link href="/pricing" className="hover:underline hover:text-blue-300">Pricing</Link></li>
              <li><Link href="/docs" className="hover:underline hover:text-blue-300">Docs</Link></li>
              <li><Link href="/projects" className="hover:underline hover:text-blue-300">Projects</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Features Section */}
      <main className="container mx-auto py-16 px-6">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Why Choose Flux?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex items-start gap-4">
            <FaPaintBrush className="text-blue-500 text-4xl" />
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Intuitive Drag & Drop</h3>
              <p className="text-gray-600">
                Build layouts effortlessly with a drag-and-drop interface designed for speed and simplicity. No design experience required.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaCogs className="text-green-500 text-4xl" />
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Fully Customizable</h3>
              <p className="text-gray-600">
                Adjust every component’s style, behavior, and functionality to fit your unique needs.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaCode className="text-purple-500 text-4xl" />
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Code Export</h3>
              <p className="text-gray-600">
                Export clean, semantic HTML, CSS, and JavaScript that developers love to work with.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaMobileAlt className="text-orange-500 text-4xl" />
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Responsive Design</h3>
              <p className="text-gray-600">
                Create apps that look great on any device with built-in responsive tools.
              </p>
            </div>
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
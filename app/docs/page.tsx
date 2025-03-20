"use client";
import Link from "next/link";

export default function Docs() {
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

      {/* Docs Section */}
      <main className="container mx-auto py-16 px-6">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Documentation</h2>
        <div className="prose max-w-3xl mx-auto text-gray-700">
          <h3 className="text-2xl font-semibold mb-4">Getting Started</h3>
          <p>
            Welcome to Flux! This guide will help you get up and running with our no-code platform. Start by creating a project from the <Link href="/projects" className="text-blue-500 hover:underline">Projects</Link> page, then dive into the builder to design your app.
          </p>
          <h3 className="text-2xl font-semibold mt-8 mb-4">Key Features</h3>
          <ul className="list-disc pl-6">
            <li>Drag-and-drop interface for rapid prototyping.</li>
            <li>Customizable components with real-time previews.</li>
            <li>Export clean code in HTML, CSS, and JavaScript.</li>
          </ul>
          <h3 className="text-2xl font-semibold mt-8 mb-4">Support</h3>
          <p>
            Need help? Check out our <Link href="/contact" className="text-blue-500 hover:underline">Support</Link> page or email us at support@flux.com.
          </p>
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
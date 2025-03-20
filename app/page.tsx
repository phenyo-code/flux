"use client";
import Link from "next/link";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FaPaintBrush, FaCogs, FaCode, FaRocket } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Flux</h1>
          <nav>
            <ul className="flex space-x-6 text-sm font-medium">
              <li>
                <Link href="/features" className="hover:underline hover:text-blue-300 transition-colors">Features</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:underline hover:text-blue-300 transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="/docs" className="hover:underline hover:text-blue-300 transition-colors">Docs</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:underline hover:text-blue-300 transition-colors">Projects</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline hover:text-blue-300 transition-colors">Contact</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto py-20 text-center px-6 bg-gradient-to-b from-gray-50 to-gray-100">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
          Design & Build Interactively
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
          Create stunning web and mobile applications with our no-code platform. Drag, drop, customize, and export clean, maintainable code in minutes.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/projects"
            className="bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
          >
            Start Designing
          </Link>
          <Link
            href="/builder/demo"
            className="border border-blue-500 text-blue-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all"
          >
            Try Demo
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow">
          <FaPaintBrush className="text-blue-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Drag & Drop Builder</h3>
          <p className="text-gray-600">
            Design your app effortlessly with an intuitive drag-and-drop interface that feels natural and powerful.
          </p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow">
          <FaCogs className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Customizable Components</h3>
          <p className="text-gray-600">
            Choose from pre-built components or tweak every detail to match your vision perfectly.
          </p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow">
          <FaCode className="text-purple-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Export Clean Code</h3>
          <p className="text-gray-600">
            Generate production-ready, maintainable code with a single click—ready for deployment.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto py-16 px-6 bg-gray-100 text-center">
        <h3 className="text-3xl font-bold mb-12 text-gray-900">What Our Users Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">
              &quot;Flux transformed how I build apps. It’s fast, intuitive, and the code quality is top-notch!&quot;
            </p>
            <p className="font-semibold text-gray-800">— Jane Doe, Indie Developer</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">
              &quot;I went from idea to prototype in hours. The customization options are incredible.&quot;
            </p>
            <p className="font-semibold text-gray-800">— John Smith, Designer</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">
              &quot;Perfect for teams who need to iterate quickly without compromising on quality.&quot;
            </p>
            <p className="font-semibold text-gray-800">— Alex Brown, Startup Founder</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Flux</h4>
            <p className="text-gray-400">Empowering creators to build without limits.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/features" className="hover:text-blue-300">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-300">Pricing</Link></li>
              <li><Link href="/projects" className="hover:text-blue-300">Projects</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/docs" className="hover:text-blue-300">Documentation</Link></li>
              <li><Link href="/contact" className="hover:text-blue-300">Support</Link></li>
              <li><Link href="/blog" className="hover:text-blue-300">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://twitter.com" className="hover:text-blue-300">Twitter</a></li>
              <li><a href="https://github.com" className="hover:text-blue-300">GitHub</a></li>
              <li><a href="mailto:support@flux.com" className="hover:text-blue-300">Email Us</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-8 text-sm">
          © {new Date().getFullYear()} Flux. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
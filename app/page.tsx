import Link from "next/link";
import { FaPaintBrush, FaCogs, FaCode } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Flux</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/features" className="hover:underline">Features</Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:underline">Pricing</Link>
            </li>
            <li>
              <Link href="/docs" className="hover:underline">Docs</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto py-16 text-center px-6">
        <h2 className="text-5xl font-bold mb-6 text-gray-900">Design & Build Interactively</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
          Create and customize your web and mobile applications without writing a single line of code. Export clean and maintainable code anytime.
        </p>
        <Link href="/builder/1" className="bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600">
          Start Designing
        </Link>
      </main>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <FaPaintBrush className="text-blue-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Drag & Drop Builder</h3>
          <p className="text-gray-600">Easily design your app with our intuitive drag-and-drop interface.</p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <FaCogs className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Customizable Components</h3>
          <p className="text-gray-600">Use pre-built components or create your own for full flexibility.</p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <FaCode className="text-purple-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Export Clean Code</h3>
          <p className="text-gray-600">Generate high-quality, maintainable code anytime you need it.</p>
        </div>
      </section>
    </div>
  );
}

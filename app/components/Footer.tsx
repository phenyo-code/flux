"use client";
import Link from "next/link";
import Image from "next/image"; // Import Next Image
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: (
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png" // Replace with your actual logo path
            alt="Flux Logo"
            width={60} // Adjust width as needed
            height={20} // Adjust height as needed
            className="hover:opacity-80 transition-opacity"
          />
        </Link>
      ),
      content: (
        <p className="text-gray-400">
          Empowering creators to build without limits since 2023.
        </p>
      ),
    },
    {
      title: "Product",
      content: (
        <ul className="space-y-2 text-gray-400">
          <li>
            <Link href="/features" className="hover:text-blue-300 transition-colors">
              Features
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="hover:text-blue-300 transition-colors">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/projects" className="hover:text-blue-300 transition-colors">
              Projects
            </Link>
          </li>
        </ul>
      ),
    },
    {
      title: "Resources",
      content: (
        <ul className="space-y-2 text-gray-400">
          <li>
            <Link href="/docs" className="hover:text-blue-300 transition-colors">
              Docs
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-blue-300 transition-colors">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/support" className="hover:text-blue-300 transition-colors">
              Support
            </Link>
          </li>
        </ul>
      ),
    },
    {
      title: "Connect",
      content: (
        <div className="flex space-x-4 text-gray-400">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition-colors"
            aria-label="Twitter"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition-colors"
            aria-label="GitHub"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={20} />
          </a>
        </div>
      ),
    },
  ];

  return (
    <footer className="bg-gray-800 text-white py-10 relative z-10">
      <div className="container mx-auto px-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-lg font-semibold mb-4 text-white">
                {section.title}
              </h4>
              {section.content}
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-700" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>
            © {currentYear} Flux. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-blue-300 transition-colors mx-2">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-blue-300 transition-colors mx-2">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
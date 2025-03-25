"use client";
import Link from "next/link";
import Image from "next/image"; // Import Next Image
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/docs", label: "Docs" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
  ];

  // Animation variants for mobile menu
  const menuVariants = {
    closed: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png" // Replace with your actual logo path
            alt="Flux Logo"
            width={30} // Adjust width as needed
            height={15} // Adjust height as needed
            priority // Optional: Loads the logo eagerly for better LCP
            className="hover:opacity-80 transition-opacity" // Optional hover effect
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:underline hover:text-blue-300 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hamburger Button (Mobile) */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden bg-gray-800 absolute top-16 left-0 w-full shadow-md"
          >
            <ul className="flex flex-col items-center space-y-4 py-4 text-sm font-medium">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:underline hover:text-blue-300 transition-colors"
                    onClick={() => setIsOpen(false)} // Close menu on click
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaChevronDown, FaGlobe, FaHistory } from 'react-icons/fa';
import Search from '../ui/Search';
import { useHistory } from '@/context/HistoryContext';
// Keeping standard search for now or replacing? Spec says "Header... Search" is NOT in header, but "Hero Search". But Header spec says "Left: Logo... Right: Login...". Wait, did specs say Search in Header? "Right side: Login button + Language Selector". No search in header mentioned in Section 1. It is in Hero (Section 2).

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { toggleHistory, history } = useHistory();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      setCatDropdownOpen(false); // Close dropdown on scroll
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${isScrolled ? 'shadow-md py-2' : 'shadow-sm py-4'
        }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-1 group">
          <span className="text-red-600 group-hover:scale-105 transition-transform">SAVEMI</span>
          <span className="group-hover:text-gray-700 transition-colors">.IO</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/all-tools" className="text-gray-600 hover:text-red-600 font-medium transition-colors">
            Tools
          </Link>

          {/* Categories Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setCatDropdownOpen(true)}
            onMouseLeave={() => setCatDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 font-medium transition-colors py-2">
              Categories <FaChevronDown size={12} />
            </button>

            {/* Dropdown Menu */}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-3 transition-all duration-200 transform origin-top ${catDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
              }`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-100"></div>
              <div className="relative bg-white z-10 rounded-xl overflow-hidden text-left">
                <DropdownItem href="/categories/pdf-tools">PDF Tools</DropdownItem>
                <DropdownItem href="/categories/image-tools">Image Tools</DropdownItem>
                <div className="h-px bg-gray-100 my-1"></div>
                <DropdownItem href="/categories/finance-money">Finance & Money</DropdownItem>
                <DropdownItem href="/categories/percentage-math">Math & Percentage</DropdownItem>
                <DropdownItem href="/categories/unit-converters">Unit Converters</DropdownItem>
                <DropdownItem href="/categories/time-date">Time & Date</DropdownItem>
                <DropdownItem href="/categories/health-body">Health & Fitness</DropdownItem>
                <DropdownItem href="/categories/student-exam">Student / Exam</DropdownItem>
                <DropdownItem href="/categories/utility">Utility Tools</DropdownItem>
                <div className="h-px bg-gray-100 my-1"></div>
                <DropdownItem href="/all-tools" className="text-red-600 font-semibold">All Tools (View All)</DropdownItem>
              </div>
            </div>
          </div>

          <Link href="/ai-tools" className="text-gray-600 hover:text-purple-600 font-medium transition-colors flex items-center gap-1">
            AI Tools <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">New</span>
          </Link>
          <Link href="/blog" className="text-gray-600 hover:text-red-600 font-medium transition-colors">
            Blog
          </Link>
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          {/* History Toggle */}
          <button
            onClick={toggleHistory}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors p-2 rounded-lg hover:bg-red-50"
            title="View History"
          >
            <div className="relative">
              <FaHistory size={18} />
              {history.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {history.length}
                </span>
              )}
            </div>
          </button>

          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-900 font-medium text-sm">
            <FaGlobe /> EN | HI
          </button>
          <Link href="/login" className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:border-red-600 hover:text-red-600 transition-all text-sm">
            Login
          </Link>
          <Link href="/signup" className="px-5 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm shadow-md shadow-red-200">
            Sign Up
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="md:hidden text-gray-700 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="flex flex-col p-4 gap-4 max-h-[80vh] overflow-y-auto">
            <Link href="/all-tools" className="text-lg font-medium text-gray-700">All Tools</Link>
            <Link href="/categories/pdf-tools" className="text-lg font-medium text-gray-700">PDF Tools</Link>
            <Link href="/categories/finance-money" className="text-lg font-medium text-gray-700">Finance</Link>
            <Link href="/categories/percentage-math" className="text-lg font-medium text-gray-700">Math</Link>
            <Link href="/categories/unit-converters" className="text-lg font-medium text-gray-700">Converters</Link>
            <Link href="/categories/image-tools" className="text-lg font-medium text-gray-700">Image Tools</Link>
            <Link href="/categories/student-exam" className="text-lg font-medium text-gray-700">Student Tools</Link>
            <Link href="/ai-tools" className="text-lg font-medium text-purple-600">AI Tools</Link>
            <div className="h-px bg-gray-100"></div>
            <div className="flex gap-4">
              <Link href="/login" className="flex-1 py-2 text-center border rounded-lg">Login</Link>
              <Link href="/signup" className="flex-1 py-2 text-center bg-red-600 text-white rounded-lg">Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function DropdownItem({ href, children, className = '' }: { href: string, children: React.ReactNode, className?: string }) {
  return (
    <Link href={href} className={`block px-4 py-1.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 hover:pl-5 transition-all ${className}`}>
      {children}
    </Link>
  );
}

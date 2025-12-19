import Link from 'next/link';
import { FaYoutube, FaTwitter, FaInstagram, FaHeart } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-bold tracking-tight text-white mb-4 block">
                            <span className="text-red-500">SAVEMI</span>.IO
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            World's most advanced platform for free online tools. We make PDF, Image, and Calculation tasks simple, fast, and secure.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<FaYoutube />} href="#" color="hover:text-red-500" />
                            <SocialIcon icon={<FaTwitter />} href="#" color="hover:text-blue-400" />
                            <SocialIcon icon={<FaInstagram />} href="#" color="hover:text-pink-500" />
                        </div>
                    </div>

                    {/* Column 2: Tools */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Popular Tools</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <FooterLink href="/tools/merge-pdf">Merge PDF</FooterLink>
                            <FooterLink href="/tools/compress-pdf">Compress PDF</FooterLink>
                            <FooterLink href="/tools/emi-calculator">EMI Calculator</FooterLink>
                            <FooterLink href="/tools/image-resizer">Image Resizer</FooterLink>
                            <FooterLink href="/tools/jpg-to-pdf">JPG to PDF</FooterLink>
                        </ul>
                    </div>

                    {/* Column 3: Categories */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Categories</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <FooterLink href="/categories/pdf-tools">PDF Tools</FooterLink>
                            <FooterLink href="/categories/finance-money">Finance & Money</FooterLink>
                            <FooterLink href="/categories/percentage-math">Math Calculators</FooterLink>
                            <FooterLink href="/categories/unit-converters">Converters</FooterLink>
                            <FooterLink href="/categories/image-tools">Image Tools</FooterLink>
                            <FooterLink href="/categories/student-exam">Student Tools</FooterLink>
                        </ul>
                    </div>

                    {/* Column 4: Company */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                            <FooterLink href="/blog">Blog</FooterLink>
                            <FooterLink href="/privacy">Privacy Policy</FooterLink>
                            <FooterLink href="/terms">Terms of Service</FooterLink>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} SAVEMI.IO — All rights reserved.</p>
                    <p className="flex items-center gap-1 mt-2 md:mt-0">
                        Made with <FaHeart className="text-red-500" /> for creators.
                    </p>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                {children}
            </Link>
        </li>
    );
}

function SocialIcon({ icon, href, color }: { icon: React.ReactNode; href: string; color: string }) {
    return (
        <a
            href={href}
            className={`bg-gray-800 p-2 rounded-lg transition-all ${color} hover:bg-gray-700`}
            target="_blank"
            rel="noopener noreferrer"
        >
            {icon}
        </a>
    );
}

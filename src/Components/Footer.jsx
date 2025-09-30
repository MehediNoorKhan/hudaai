// Footer.jsx
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white mt-10">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Info */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 cursor-pointer hover:text-yellow-300 transition duration-300">
                            Forum Platform
                        </h2>
                        <p className="text-sm text-gray-200">
                            A modern platform to connect, discuss, and share knowledge with a vibrant community.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/"
                                    className="hover:text-yellow-300 transition duration-300 cursor-pointer"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/about"
                                    className="hover:text-yellow-300 transition duration-300 cursor-pointer"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact"
                                    className="hover:text-yellow-300 transition duration-300 cursor-pointer"
                                >
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/faq"
                                    className="hover:text-yellow-300 transition duration-300 cursor-pointer"
                                >
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-2xl hover:text-yellow-300 transition duration-300 cursor-pointer"
                            >
                                <FaFacebook />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-2xl hover:text-yellow-300 transition duration-300 cursor-pointer"
                            >
                                <FaTwitter />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-2xl hover:text-yellow-300 transition duration-300 cursor-pointer"
                            >
                                <FaLinkedin />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-2xl hover:text-yellow-300 transition duration-300 cursor-pointer"
                            >
                                <FaGithub />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Line */}
                <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-gray-200">
                    © {new Date().getFullYear()} Forum Platform. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

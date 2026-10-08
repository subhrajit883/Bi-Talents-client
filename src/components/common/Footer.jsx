import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";
import {
    FiPhone,
    FiMail,
    FiMapPin,
    FiArrowUpRight,
    FiChevronRight,
} from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import logo from "../../assets/bit.png";
import { categoryUrl } from "../../config/config";

const Footer = () => {
    const [categories, setCategories] = useState([]);

    const contactPhone = import.meta.env.VITE_CONTACT_PHONE || "+91 9903400656";
    const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || "subhrajit.sportiqofitness@gmail.com";

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(categoryUrl.getAll);
                setCategories(res.data.categories || []);
            } catch (err) {
                console.error("Footer category fetch error:", err);
            }
        };
        fetchCategories();
    }, []);

    const routes = [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Register as Talent", path: "/talent-enquiry" },
        { name: "Client Login", path: "/login" },
        { name: "Client Register", path: "/register" },
    ];

    return (
        <footer className="relative bg-slate-950 text-slate-300 overflow-hidden border-t border-slate-800">
            {/* Soft Ambient Background Glows */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-5 pt-16 pb-10 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 pb-12 border-b border-slate-800/80">

                    {/* ================= LEFT SECTION: LOGO & BRAND DESCRIPTION ================= */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="inline-block group">
                            <div className="bg-white/95 p-3.5 rounded-2xl border border-slate-700/50 shadow-lg inline-block transition-transform duration-300 group-hover:scale-[1.02]">
                                <img
                                    src={logo}
                                    alt="BIA Talents Logo"
                                    className="h-12 w-auto object-contain"
                                />
                            </div>
                        </Link>

                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                            BIA Talents is a premier talent casting & management agency. We represent top-tier models, actors, content creators, and artists, connecting them with leading global brands and production houses.
                        </p>

                        <div className="pt-2">
                            <Link
                                to="/talent-enquiry"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-blue-600 to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <CiUser size={16} />
                                <span>Register as Talent</span>
                                <FiArrowUpRight size={15} />
                            </Link>
                        </div>
                    </div>

                    {/* ================= MIDDLE SECTION: ROUTES & CATEGORIES ================= */}
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-8">

                        {/* Quick Navigation Routes */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-5 pb-2 ">
                                Quick Links
                            </h3>
                            <ul className="space-y-3 text-sm">
                                {routes.map((route, idx) => (
                                    <li key={idx}>
                                        <NavLink
                                            to={route.path}
                                            className={({ isActive }) =>
                                                `inline-flex items-center gap-2 transition-all duration-200 group ${isActive
                                                    ? "text-blue-400 font-semibold"
                                                    : "text-slate-400 hover:text-white"
                                                }`
                                            }
                                        >
                                            <FiChevronRight size={14} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                            <span>{route.name}</span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Categories List */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-5 pb-2 ">
                                Categories
                            </h3>
                            {categories.length > 0 ? (
                                <ul className="space-y-3 text-sm">
                                    {categories.map((cat) => (
                                        <li key={cat._id}>
                                            <NavLink
                                                to={`/category/${cat.slug}`}
                                                className={({ isActive }) =>
                                                    `inline-flex items-center gap-2 transition-all duration-200 group ${isActive
                                                        ? "text-blue-400 font-semibold"
                                                        : "text-slate-400 hover:text-white"
                                                    }`
                                                }
                                            >
                                                <FiChevronRight size={14} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                                <span>{cat.name}</span>
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-slate-500 italic">Loading categories...</p>
                            )}
                        </div>

                    </div>

                    {/* ================= RIGHT SECTION: CONTACT INFO ================= */}
                    <div className="lg:col-span-3 space-y-5">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-5 pb-2">
                            Contact Info
                        </h3>

                        <div className="space-y-3.5 text-sm">
                            {/* Phone */}
                            {contactPhone && (
                                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                                        <FiPhone size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                            Phone / WhatsApp
                                        </p>
                                        <a
                                            href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                                            className="font-medium text-slate-200 hover:text-blue-400 transition truncate block"
                                        >
                                            {contactPhone}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            {contactEmail && (
                                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                                        <FiMail size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                            Email Address
                                        </p>
                                        <a
                                            href={`mailto:${contactEmail}`}
                                            className="font-medium text-slate-200 hover:text-blue-400 transition truncate block"
                                            title={contactEmail}
                                        >
                                            {contactEmail}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Location */}
                            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                                    <FiMapPin size={16} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                        Location
                                    </p>
                                    <p className="font-medium text-slate-200">
                                        Kolkata, West Bengal, India
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ================= BOTTOM BAR ================= */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} BIA Talents. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link to="/about" className="hover:text-slate-300 transition">About Us</Link>
                        <Link to="/talent-enquiry" className="hover:text-slate-300 transition">Talent Enquiry</Link>
                        <Link to="/login" className="hover:text-slate-300 transition">Client Login</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
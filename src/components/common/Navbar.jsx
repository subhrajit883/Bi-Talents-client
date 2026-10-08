
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    HiOutlineMenuAlt3,
    HiOutlineX,
} from "react-icons/hi";
import {
    FiArrowUpRight,
    FiBriefcase,
} from "react-icons/fi";

import logo from "../../assets/bit.png";
import { categoryUrl } from "../../config/config";
import { CiUser } from "react-icons/ci";

const Navbar = () => {
    const [categories, setCategories] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(categoryUrl.getAll);
            setCategories(res.data.categories || []);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        }
    };

    useEffect(() => {
        fetchCategories();

        const token = localStorage.getItem("clientToken");
        setIsClientLoggedIn(!!token);
    }, []);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const navLinkClass = ({ isActive }) =>
        `group relative flex items-center px-4 py-2.5
        text-sm font-semibold tracking-wide
        transition-all duration-300 rounded-full
        ${isActive
            ? "text-blue-700 bg-blue-50"
            : "text-slate-600 hover:text-blue-700 hover:bg-blue-50/70"
        }`;

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">

            {/* ================= DESKTOP NAVBAR ================= */}

            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

                {/* LOGO */}

                <div className="shrink-0">
                    <NavLink
                        to="/"
                        className="group block"
                        onClick={closeMenu}
                    >
                        <img
                            src={logo}
                            alt="BIA Talents Logo"
                            className="h-14 w-48 object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                    </NavLink>
                </div>

                {/* DESKTOP NAVIGATION */}

                <div className="hidden items-center gap-1 lg:flex">

                    {/* DYNAMIC CATEGORIES */}

                    {categories.map((category) => (
                        <NavLink
                            key={category._id}
                            to={`/category/${category.slug}`}
                            className={navLinkClass}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className="relative z-10 text-gray-800 montserrat-normal text-base">
                                        {category.name}
                                    </span>

                                    <span
                                        className={`absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 ${isActive
                                            ? "w-5"
                                            : "w-0 group-hover:w-5"
                                            }`}
                                    />
                                </>
                            )}
                        </NavLink>
                    ))}

                    {/* SEPARATOR */}

                    <div className="mx-3 h-7 w-px bg-slate-200" />

                    {/* SEPARATE ENQUIRY LINK */}

                    <NavLink
                        to="/talent-enquiry"
                        className={({ isActive }) =>
                            `group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition-all duration-300 ${isActive
                                ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                : "border-blue-200 bg-blue-50/60 text-blue-700 hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/20"
                            }`
                        }
                    >
                        <CiUser
                            size={16}
                            className="transition-transform duration-300 group-hover:-rotate-6"
                        />

                        <span className="montserrat-normal">
                            Register as Talent
                        </span>

                        <FiArrowUpRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </NavLink>

                </div>

                {/* ================= RIGHT SIDE ================= */}

                <div className="flex items-center gap-3">

                    {/* LOGIN / DASHBOARD */}

                    <div className="hidden sm:block">
                        {isClientLoggedIn ? (
                            <NavLink
                                to="/interests"
                                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
                            >
                                <span>Dashboard</span>

                                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </NavLink>
                        ) : (
                            <NavLink
                                to="/login"
                                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
                            >
                                <span>Login</span>

                                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </NavLink>
                        )}
                    </div>

                    {/* MOBILE MENU BUTTON */}

                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl text-slate-700 shadow-sm transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 lg:hidden"
                    >
                        {isMenuOpen ? (
                            <HiOutlineX />
                        ) : (
                            <HiOutlineMenuAlt3 />
                        )}
                    </button>

                </div>
            </div>

            {/* ================= MOBILE MENU ================= */}

            <div
                className={`overflow-hidden border-t border-slate-200/70 bg-white transition-all duration-500 ease-in-out lg:hidden ${isMenuOpen
                    ? "max-h-[650px] opacity-100"
                    : "max-h-0 opacity-0"
                    }`}
            >
                <div className="px-5 py-5">

                    {/* CATEGORIES */}

                    <div className="space-y-1">

                        <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Explore Categories
                        </p>

                        {categories.map((category) => (
                            <NavLink
                                key={category._id}
                                to={`/category/${category.slug}`}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `group flex items-center cormorant-garamond-normal justify-between rounded-xl px-4 py-3.5 text-base font-semibold transition-all duration-300 ${isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-900 hover:bg-blue-50 hover:text-blue-600"
                                    }`
                                }
                            >
                                <span>{category.name}</span>

                                <span className="text-lg text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-500">
                                    →
                                </span>
                            </NavLink>
                        ))}

                    </div>

                    {/* SEPARATE ENQUIRY SECTION */}

                    <div className="mt-4 border-t border-slate-100 pt-4">
                        {/* 
                        <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Get In Touch
                        </p> */}

                        <NavLink
                            to="/talent-enquiry"
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `group flex items-center justify-between rounded-2xl border p-4 transition-all duration-300 ${isActive
                                    ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 hover:border-blue-300 hover:shadow-md"
                                }`
                            }
                        >
                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                                    <CiUser size={19} />
                                </div>

                                <div>
                                    <p className="text-sm font-bold">
                                        Register as Talent
                                    </p>


                                </div>

                            </div>

                            <FiArrowUpRight
                                size={20}
                                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                            />
                        </NavLink>

                    </div>

                    {/* MOBILE LOGIN / DASHBOARD */}

                    <div className="mt-5 border-t border-slate-100 pt-5 sm:hidden">

                        {isClientLoggedIn ? (
                            <NavLink
                                to="/interests"
                                onClick={closeMenu}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-xl"
                            >
                                Dashboard
                                <span>→</span>
                            </NavLink>
                        ) : (
                            <NavLink
                                to="/login"
                                onClick={closeMenu}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-xl"
                            >
                                Login
                                <span>→</span>
                            </NavLink>
                        )}

                    </div>

                </div>
            </div>

        </nav>
    );
};

export default Navbar;


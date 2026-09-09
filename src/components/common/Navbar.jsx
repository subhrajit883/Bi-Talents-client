import { Link, NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import logo from "../../assets/bia.png"
import { categoryUrl } from "../../config/config";

const Navbar = () => {

    const [categories, setCategories] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(categoryUrl.getAll);
            console.log(res.data.categories);
            setCategories(res.data.categories);
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch categories");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

                <div className="shrink-0">
                    <NavLink to="/" className="group block">
                        <img
                            src={logo}
                            alt="Bi Talents Logo"
                            className="h-14 w-48 object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                    </NavLink>
                </div>

                <div className="hidden items-center gap-1 lg:flex">

                    {categories.map((category) => (
                        <NavLink
                            key={category._id}
                            to={`/category/${category.slug}`}
                            className={({ isActive }) =>
                                `group relative rounded-full px-4 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 ${isActive
                                    ? "bg-blue-100 text-blue-600"
                                    : "text-slate-600 hover:bg-blue-100 hover:text-blue-600"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className="relative z-10 montserrat-normal text-blue-900 text-lg">
                                        {category.name} 
                                    </span> 
                             
                                    {/* Active / Hover underline */}
                                    <span
                                        className={`absolute bottom-1.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 ${isActive
                                                ? "w-5"
                                                : "w-0 group-hover:w-5"
                                            }`}
                                    />
                                </>
                            )}
                        </NavLink>
                    ))}
             
                </div>

                {/* ================= RIGHT SIDE ================= */}
                <div className="flex items-center gap-3">

                    {/* Login */}
                    <div className="hidden sm:block">
                        <NavLink
                            to="/login"
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/25"
                        >
                            <span className="relative z-10">
                                Login
                            </span>

                            <span className="relative z-10 text-base transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </NavLink>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
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
                        ? "max-h-150 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
            >
                <div className="px-5 py-5">

                    {/* Mobile Navigation */}
                    <div className="space-y-1">

                        {categories.map((category) => (
                            <NavLink
                                key={category._id}
                                to={`/category/${category.slug}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="group flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold text-slate-700 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
                            >
                                <span>{category.name}</span>

                                <span className="text-lg text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-500">
                                    →
                                </span>
                            </NavLink>
                        ))}

                    </div>

                    {/* Mobile Login */}
                    <div className="mt-5 border-t border-slate-100 pt-5 sm:hidden">
                        <NavLink
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-xl"
                        >
                            Login
                            <span>→</span>
                        </NavLink>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
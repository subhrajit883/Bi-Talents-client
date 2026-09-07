import { Link } from "react-router-dom";
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
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-[2px] text-black">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">

                {/* Logo */}
                <div className="w-60 ">
                    <Link
                        to="/"
                        className="text-2xl font-bold md:text-3xl"
                    >
                        {/* <h2 className="mb-5 text-3xl font-bold tracking-tight playfair-display-regular">
                        Modelling<span className="text-red-600">News</span>
                    </h2> */}
                        <img src={logo} alt="logo image" className="h-16 w-full object-contain" />
                    </Link>
                </div>
                <div className="hidden items-center gap-8 lg:flex  tracking-wider">
                    {categories.map((category) => (
                        <Link
                            key={category._id}
                            to={`/category/${category.slug}`}
                            className="transition hover:text-blue-500"
                        >
                            {category.name}
                        </Link>
                    ))}

                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">

                    {/* Search */}
                    <div className="hidden md:block">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 cursor-pointer">Login</button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-3xl lg:hidden"
                    >
                        {isMenuOpen ? (
                            <HiOutlineX />
                        ) : (
                            <HiOutlineMenuAlt3 />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`overflow-hidden bg-zinc-950 transition-all duration-300 lg:hidden ${isMenuOpen ? "max-h-150" : "max-h-0"
                    }`}
            >
                <div className="border-t border-zinc-800 px-5 py-4">

                    {/* Search */}
                    {/* <div className="mb-5 md:hidden">
                        <SearchBar />
                    </div> */}

                    <div className="flex flex-col">
                        {categories.map((category) => (
                            <Link
                                key={category._id}
                                to={`/category/${category.slug}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="border-b border-zinc-800 py-4 text-lg transition hover:text-red-500 libertinus-serif-regular"
                            >
                                {category.name}
                            </Link>
                        ))}
                        {/* <Link
                            to="/about"
                            className="group relative flex items-center gap-2 rounded-full border border-red-600 px-3 py-1.5 text-sm font-semibold text-red-500 transition-all duration-300 hover:bg-red-600 hover:text-white"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                            </span>

                            Advertise
                        </Link> */}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
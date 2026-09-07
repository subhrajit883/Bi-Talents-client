
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    FiSearch,
    FiMapPin,
    FiArrowRight,
    FiHeart,
    FiPlay,
    FiChevronRight,
    FiChevronLeft,
    FiGrid,
    FiUsers,
    FiBriefcase,
    FiShield,
} from "react-icons/fi";
import { HiCheckBadge } from "react-icons/hi2";
import { categoryUrl, talentUrl } from "../config/config";
import TalentRow from "../components/home/TalentRow";

// ─── Skeleton Card ───────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="shrink-0 w-44 animate-pulse">
        <div className="relative rounded-xl overflow-hidden bg-gray-200 h-52 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
    </div>
);

// ─── Main HomePage ───────────────────────────────────────────────────────────
function HomePage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Hero talents
    const [heroTalents, setHeroTalents] = useState([]);
    const [heroTalentsLoading, setHeroTalentsLoading] = useState(true);

    // Category-wise talents
    const [categoryTalents, setCategoryTalents] = useState([]);

    const fetchCategoryNews = async () => {
        try {
            const catRes = await axios.get(categoryUrl.getAll);
            const activeCategories = (catRes.data.categories || []).filter(c => c.isActive);
            setCategories(activeCategories);
            console.log("categories", activeCategories);

            const categoryNewsPromises = activeCategories.map(async (category) => {
                try {
                    const newsRes = await axios.get(`${talentUrl.catWise}/${category._id}`);
                    console.log("talentRes", newsRes.data);
                    return {
                        categoryId: category._id,
                        categoryName: category.name,
                        categorySlug: category.slug,
                        talents: newsRes.data.talents || []
                    };
                } catch (err) {
                    console.error(`Failed to fetch talents for ${category.name}`, err);
                    return {
                        categoryId: category._id,
                        categoryName: category.name,
                        categorySlug: category.slug,
                        talents: []
                    };
                }
            });

            const results = await Promise.all(categoryNewsPromises);
            setCategoryTalents(results);

            const allTalents = results.flatMap(r => r.talents);
            setHeroTalents(allTalents.slice(0, 3));

            setHeroTalentsLoading(false);
            setCategoriesLoading(false);
        } catch (err) {
            console.log(err);
            setHeroTalentsLoading(false);
            setCategoriesLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryNews();
    }, []);

    // ─── Fetch Hero Talents ──────────────────────────────────────────────────

    return (
        <div className="bg-white min-h-screen">

            {/* ── HERO ───────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-blue-100/30 to-white">

                <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                        {/* ── LEFT CONTENT ────────────────────────────────── */}
                        <div className="space-y-6 z-10 relative">

                            {/* <div className="inline-flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-1.5 shadow-sm">

                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>

                             <span className="text-sm text-gray-600 font-medium">
                                    Connecting Talent with Opportunity
                                </span> 

                            </div> */}

                            <h1 className="text-4xl lg:text-5xl text-gray-900 leading-tight font-bold">
                                Find the Right{" "}
                                <span className="text-blue-600">
                                    Talent for Your
                                </span>{" "}
                                Next Project
                            </h1>

                            <p className="text-gray-500 text-base leading-relaxed max-w-md">
                                Discover, connect, and hire professional talents
                                across modelling, acting, dancing, singing and
                                more.
                            </p>

                            <div className="flex items-center gap-4">

                                <Link
                                    to="/talents"
                                    id="hero-browse-btn"
                                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    Browse Talents
                                    <FiArrowRight size={16} />
                                </Link>

                                {/* <button
                                    id="hero-how-it-works-btn"
                                    className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                                >
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 hover:border-blue-400 transition-colors">
                                        <FiPlay size={12} className="ml-0.5" />
                                    </span>

                                    How It Works
                                </button> */}

                            </div>

                            <div className="flex items-center gap-8 pt-2">

                                <div className="flex items-center gap-2">
                                    <FiUsers
                                        size={20}
                                        className="text-blue-500"
                                    />

                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">
                                            100+
                                        </p>

                                        <p className=" text-gray-400 text-md">
                                            Talents
                                        </p>
                                    </div>
                                </div>

                                {/* <div className="flex items-center gap-2">
                                    <FiBriefcase
                                        size={20}
                                        className="text-blue-500"
                                    />

                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">
                                            50+
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            Happy Clients
                                        </p>
                                    </div>
                                </div> */}

                                <div className="flex items-center gap-2">
                                    <FiShield
                                        size={20}
                                        className="text-blue-500"
                                    />

                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">
                                            Verified
                                        </p>
                                        <p className="text-md text-gray-400">
                                            &amp; Trusted
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* ── RIGHT: THREE TALENT IMAGES ─────────────────── */}
                        <div className="relative flex justify-center items-center min-h-90 lg:min-h-107.5">

                            <div className="relative w-full max-w-[560px] h-[340px] sm:h-[390px] lg:h-[430px]">

                                {/* Loading skeleton */}
                                {heroTalentsLoading ? (
                                    <>
                                        <div className="absolute left-0 sm:left-3 top-1/2 -translate-y-1/2 -rotate-6 w-32 sm:w-40 lg:w-44 h-56 sm:h-64 lg:h-72 rounded-[28px] bg-blue-100 animate-pulse" />

                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-40 sm:w-48 lg:w-56 h-64 sm:h-72 lg:h-80 rounded-[30px] bg-blue-100 animate-pulse" />

                                        <div className="absolute right-0 sm:right-3 top-1/2 -translate-y-1/2 rotate-6 w-32 sm:w-40 lg:w-44 h-56 sm:h-64 lg:h-72 rounded-[28px] bg-blue-100 animate-pulse" />
                                    </>
                                ) : heroTalents.length > 0 ? (

                                    heroTalents.map((talent, index) => {

                                        const positionClasses = [
                                            // Left
                                            "left-0 sm:left-3 top-1/2 -translate-y-1/2 -rotate-6 w-32 sm:w-40 lg:w-44 h-56 sm:h-64 lg:h-72 z-10",

                                            // Center
                                            "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 sm:w-48 lg:w-56 h-64 sm:h-72 lg:h-80 z-20",

                                            // Right
                                            "right-0 sm:right-3 top-1/2 -translate-y-1/2 rotate-6 w-32 sm:w-40 lg:w-44 h-56 sm:h-64 lg:h-72 z-10",
                                        ];

                                        return (
                                            <div
                                                key={talent._id || index}
                                                className={`absolute ${positionClasses[index]} rounded-[28px] overflow-hidden border-4 border-white shadow-2xl bg-blue-50 transition-transform duration-300 hover:scale-[1.03] cursor-pointer`}
                                                onClick={() => navigate(`/talents/${talent._id}`)}
                                            >
                                                <img
                                                    src={
                                                        talent.profileImage?.url
                                                    }
                                                    alt={
                                                        talent.name || "Talent"
                                                    }
                                                    className="w-full h-full object-cover object-top"
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                            talent.name ||
                                                            "Talent"
                                                        )}&background=2C78FF&color=fff&size=500`;
                                                    }}
                                                />
                                            </div>
                                        );
                                    })

                                ) : (

                                    /* No talent data */
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-56 h-72 rounded-[30px] bg-blue-50 flex items-center justify-center text-gray-400 text-sm">
                                            No talents available
                                        </div>
                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

                {/* Decorative blobs */}
                <div className="absolute top-10 right-1/3 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

                <div className="absolute bottom-0 left-10 w-48 h-48 bg-indigo-100/30 rounded-full blur-2xl pointer-events-none"></div>

            </section>

            {/* ── SEARCH BAR ─────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-6">

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex flex-col md:flex-row items-center gap-2">

                    <div className="flex items-center gap-2 flex-1 px-3 py-2 border-b md:border-b-0 md:border-r border-gray-200 w-full">

                        <FiSearch
                            size={18}
                            className="text-gray-400 flex-shrink-0"
                        />

                        <input
                            id="search-talent-input"
                            type="text"
                            placeholder="Search talents..."
                            value={searchQuery}
                            onChange={(e) =>
                                setSearchQuery(e.target.value)
                            }
                            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                        />

                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-52">

                        <FiGrid
                            size={18}
                            className="text-gray-400 flex-shrink-0"
                        />

                        <select
                            id="search-category-select"
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="flex-1 outline-none text-sm text-gray-500 bg-transparent cursor-pointer"
                        >
                            <option value="">
                                All Categories
                            </option>

                            {categories.map((cat) => (
                                <option
                                    key={cat._id}
                                    value={cat._id}
                                >
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                    </div>

                    {/* <div className="flex items-center gap-2 px-3 py-2 border-b md:border-b-0 border-gray-200 w-full md:w-48">

                        <FiMapPin
                            size={18}
                            className="text-gray-400 flex-shrink-0"
                        />

                        <select
                            id="search-location-select"
                            value={selectedLocation}
                            onChange={(e) =>
                                setSelectedLocation(e.target.value)
                            }
                            className="flex-1 outline-none text-sm text-gray-500 bg-transparent cursor-pointer"
                        >
                            <option value="">
                                All Locations
                            </option>

                            <option value="kolkata">
                                Kolkata
                            </option>

                            <option value="mumbai">
                                Mumbai
                            </option>

                            <option value="delhi">
                                Delhi
                            </option>

                            <option value="bangalore">
                                Bangalore
                            </option>
                        </select>

                    </div> */}

                    <Link
                        id="search-submit-btn"
                        to={`/talents${searchQuery || selectedCategory
                            ? `?q=${searchQuery}&cat=${selectedCategory}`
                            : ""
                            }`}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all whitespace-nowrap w-full md:w-auto justify-center"
                    >
                        Search
                        <FiArrowRight size={16} />
                    </Link>

                </div>

            </section>

            {/* ── TALENT SECTIONS ────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-4 pb-12">

                <div className="border-t border-gray-100 my-8"></div>

                {categoriesLoading ? (

                    <div className="space-y-10">

                        {[1, 2, 3].map((i) => (

                            <div key={i} className="mb-10">

                                <div className="flex justify-between mb-4">

                                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>

                                    <div className="h-5 w-28 bg-gray-100 rounded animate-pulse"></div>

                                </div>

                                <div className="flex gap-4">

                                    {Array(5)
                                        .fill(0)
                                        .map((_, j) => (
                                            <SkeletonCard key={j} />
                                        ))}

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    categoryTalents.map((category) => (

                        <TalentRow
                            talents={category.talents}
                            key={category.categoryId}
                            categoryId={category.categoryId}
                            categoryName={category.categoryName}
                            categorySlug={category.categorySlug}
                            loading={false}
                        />

                    ))

                )}

            </section>

        </div>
    );
}

export default HomePage;

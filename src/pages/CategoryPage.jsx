import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FiSearch,
    FiHeart,
    FiGrid,
    FiList,
    FiUsers,
    FiBriefcase,
    FiShield,
    FiMapPin,
    FiArrowRight,
    FiChevronDown,
    FiStar,
} from "react-icons/fi";
import { HiCheckBadge } from "react-icons/hi2";
import { categoryUrl, talentUrl } from "../config/config";
import coverImage from "../assets/cat.jpg";
const CategoryPage = () => {


    const { id: categorySlug } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [categoryTalents, setCategoryTalents] = useState([]);
    const [allCategoryCounts, setAllCategoryCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [ageRange, setAgeRange] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid");

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const catRes = await axios.get(categoryUrl.getAll);
            const allCategories = (catRes.data.categories || []).filter(
                (c) => c.isActive
            );

            const recommendedCategoryObj = {
                _id: "recommended",
                name: "Our Recommendation",
                slug: "recommended",
                isActive: true,
            };

            const fullCategories = [recommendedCategoryObj, ...allCategories];
            setCategories(fullCategories);

            // Fetch recommended talents
            let recTalents = [];
            try {
                const recRes = await axios.get(talentUrl.recommended);
                recTalents = recRes.data?.talents || [];
            } catch (err) {
                console.error("Failed to fetch recommended talents:", err);
            }

            // Fetch counts for all standard categories
            const countPromises = allCategories.map(async (category) => {
                try {
                    const res = await axios.get(
                        `${talentUrl.catWise}/${category._id}`
                    );
                    return {
                        id: category._id,
                        slug: category.slug,
                        count: (res.data.talents || []).length,
                    };
                } catch {
                    return { id: category._id, slug: category.slug, count: 0 };
                }
            });

            const countResults = await Promise.all(countPromises);
            const counts = { recommended: recTalents.length };
            countResults.forEach((r) => {
                counts[r.slug] = r.count;
            });
            setAllCategoryCounts(counts);

            if (categorySlug === "recommended") {
                setActiveCategory(recommendedCategoryObj);
                setCategoryTalents(recTalents);
            } else {
                const matchedCategory =
                    allCategories.find((c) => c.slug === categorySlug) ||
                    allCategories[0] ||
                    recommendedCategoryObj;

                setActiveCategory(matchedCategory);

                if (matchedCategory && matchedCategory._id === "recommended") {
                    setCategoryTalents(recTalents);
                } else if (matchedCategory) {
                    const talentRes = await axios.get(
                        `${talentUrl.catWise}/${matchedCategory._id}`
                    );
                    setCategoryTalents(talentRes.data.talents || []);
                }
            }
        } catch (err) {
            console.error("Failed to fetch category data:", err);
        } finally {
            setLoading(false);
        }
    }, [categorySlug]);

    useEffect(() => {
        const timer = setTimeout(() => fetchData(), 0);
        return () => clearTimeout(timer);
    }, [fetchData]);

    const handleCategoryClick = (slug) => {
        navigate(`/category/${slug}`);
    };

    const filteredTalents = categoryTalents.filter((talent) => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const name = talent.name?.toLowerCase() || "";
            const address = talent.address?.toLowerCase() || "";
            if (!name.includes(q) && !address.includes(q)) return false;
        }
        if (ageRange) {
            const age = talent.age || 0;
            const [min, max] = ageRange.split("-").map(Number);
            if (max) {
                if (age < min || age > max) return false;
            } else if (min) {
                if (age < min) return false;
            }
        }
        if (selectedLocation) {
            const addr = talent.address?.toLowerCase() || "";
            if (!addr.includes(selectedLocation.toLowerCase())) return false;
        }
        return true;
    });

    const sortedTalents = [...filteredTalents].sort((a, b) => {
        if (sortBy === "newest") {
            return (
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );
        }
        if (sortBy === "name") {
            return (a.name || "").localeCompare(b.name || "");
        }
        if (sortBy === "age-asc") {
            return (a.age || 0) - (b.age || 0);
        }
        if (sortBy === "age-desc") {
            return (b.age || 0) - (a.age || 0);
        }
        return 0;
    });

    const talentCount = filteredTalents.length;
    const totalTalents = Object.values(allCategoryCounts).reduce(
        (a, b) => a + b,
        0
    );
    const categoryName = activeCategory?.name || "Category";

    return (
        <div className="bg-white min-h-screen">
            {/* =========================================================
                HERO SECTION
            ========================================================= */}
            <section
                className="relative overflow-hidden min-h-[460px] flex items-center"
                style={{
                    backgroundImage: `url(${coverImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Dark/white gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/55 to-white/35" />

                {/* Blue atmospheric overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-transparent to-[#2C78FF]/10" />

                {/* Decorative blur */}
                <div className="absolute -right-32 -top-32 w-[450px] h-[450px] rounded-full bg-[#2C78FF]/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-14 lg:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                        {/* LEFT CONTENT */}
                        <div className="space-y-6">

                            {/* Category badge */}
                            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-blue-100 rounded-full px-4 py-2 shadow-sm">
                                <FiUsers
                                    size={15}
                                    className="text-[#2C78FF]"
                                />

                                <span className="text-sm font-semibold text-[#2C78FF]">
                                    Talent Category
                                </span>
                            </div>

                            {/* Heading */}
                            <div>
                                <h1 className="text-3xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-slate-950 leading-[1.05]">
                                    {categoryName}
                                </h1>

                                <div className="mt-4 w-16 h-1 rounded-full bg-[#2C78FF]" />
                            </div>

                            {/* Description */}
                            <p className="text-slate-600 text-base lg:text-lg leading-relaxed max-w-xl">
                                Discover talented{" "}
                                {categoryName.toLowerCase()} for your brand,
                                campaign, photoshoot or event. Find the perfect
                                face for your vision.
                            </p>

                            {/* Statistics */}
                            <div className="flex flex-wrap gap-3 pt-2">

                                {/* Talents */}
                                <div className="flex items-center gap-3 bg-white/85 backdrop-blur-md border border-white rounded-2xl px-4 py-3 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2C78FF] flex items-center justify-center">
                                        <FiUsers size={19} />
                                    </div>

                                    <div>
                                        <p className=" text-slate-900 text-lg leading-none font-bold">
                                            {talentCount}+
                                        </p>

                                        <p className="text-slate-400 text-xs mt-1">
                                            Talents Available
                                        </p>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="flex items-center gap-3 bg-white/85 backdrop-blur-md border border-white rounded-2xl px-4 py-3 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2C78FF] flex items-center justify-center">
                                        <FiBriefcase size={19} />
                                    </div>

                                    <div>
                                        <p className=" text-slate-900 text-lg leading-none font-bold">
                                            {categories.length}
                                        </p>

                                        <p className="text-slate-400 text-xs mt-1">
                                            Categories
                                        </p>
                                    </div>
                                </div>

                                {/* Verified */}
                                <div className="flex items-center gap-3 bg-white/85 backdrop-blur-md border border-white rounded-2xl px-4 py-3 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2C78FF] flex items-center justify-center">
                                        <FiShield size={19} />
                                    </div>

                                    <div>
                                        <p className=" text-slate-900 text-lg leading-none font-bold">
                                            100%
                                        </p>

                                        <p className="text-slate-400 text-xs mt-1">
                                            Verified Profiles
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="relative hidden lg:flex justify-center items-center min-h-[340px]">

                            {/* Soft glass panel */}
                            {/* <div className="absolute w-[430px] h-[300px] rounded-[3rem] bg-white/20 backdrop-blur-[2px] border border-white/40 rotate-3" /> */}

                            {/* Main image */}
                            {sortedTalents.length > 0 && (
                                <div
                                    className="relative z-20 w-[220px] h-[300px] rounded-[2rem] overflow-hidden border-[6px] border-white shadow-2xl -rotate-2"
                                >
                                    <img
                                        src={sortedTalents[0]?.profileImage?.url}
                                        alt={sortedTalents[0]?.name || "Talent"}
                                        className="w-full h-full object-cover object-top"
                                        onError={(e) => {
                                            e.target.src =
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                    sortedTalents[0]?.name || "Talent"
                                                )}&background=2C78FF&color=fff&size=500`;
                                        }}
                                    />


                                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />


                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className="text-white text-sm font-bold">
                                            {sortedTalents[0]?.name}
                                        </p>

                                        <p className="text-white/70 text-xs mt-0.5">
                                            {categoryName}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Secondary image 1 */}
                            {sortedTalents[1] && (
                                <div
                                    className="absolute z-10 left-2 top-4 w-[125px] h-[165px] rounded-2xl overflow-hidden border-4 border-white shadow-xl -rotate-8"
                                >
                                    <img
                                        src={sortedTalents[1]?.profileImage?.url}
                                        alt={sortedTalents[1]?.name || "Talent"}
                                        className="w-full h-full object-cover object-top"
                                        onError={(e) => {
                                            e.target.src =
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                    sortedTalents[1]?.name || "Talent"
                                                )}&background=2C78FF&color=fff&size=300`;
                                        }}
                                    />
                                </div>
                            )}


                            {sortedTalents[2] && (
                                <div
                                    className="absolute z-30 right-0 top-0 w-[135px] h-[175px] rounded-2xl overflow-hidden border-4 border-white shadow-xl rotate-6"
                                >
                                    <img
                                        src={sortedTalents[2]?.profileImage?.url}
                                        alt={sortedTalents[2]?.name || "Talent"}
                                        className="w-full h-full object-cover object-top"
                                        onError={(e) => {
                                            e.target.src =
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                    sortedTalents[2]?.name || "Talent"
                                                )}&background=2C78FF&color=fff&size=300`;
                                        }}
                                    />
                                </div>
                            )}

                            {/* 
                {sortedTalents[3] && (
                    <div
                        className="absolute z-30 right-8 bottom-0 w-[120px] h-[155px] rounded-2xl overflow-hidden border-4 border-white shadow-xl rotate-5"
                    >
                        <img
                            src={sortedTalents[3]?.profileImage?.url}
                            alt={sortedTalents[3]?.name || "Talent"}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                                e.target.src =
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        sortedTalents[3]?.name || "Talent"
                                    )}&background=2C78FF&color=fff&size=300`;
                            }}
                        />
                    </div>
                )} */}

                            {/* Floating label */}
                            {/* <div className="absolute z-40 -right-2 bottom-7 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-white">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <FiShield
                                size={15}
                                className="text-[#2C78FF]"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-bold text-slate-900">
                                Trusted Talent
                            </p>

                            <p className="text-[10px] text-slate-400">
                                Verified profiles
                            </p>
                        </div>
                    </div>
                </div> */}

                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                MAIN CONTENT: SIDEBAR + TALENT GRID
            ========================================================= */}
            <section className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                    {/* ================= SIDEBAR ================= */}
                    <aside className="space-y-5">
                        {/* Categories Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                            <div className="flex items-center gap-2 mb-4 px-1">
                                <FiGrid
                                    size={18}
                                    className="text-gray-500"
                                />
                                <h3 className="font-bold text-gray-900 text-sm">
                                    All Categories
                                </h3>
                            </div>

                            <nav className="space-y-1">
                                {categories.map((category) => {
                                    const isActive =
                                        category.slug ===
                                        (activeCategory?.slug || categorySlug);
                                    const count =
                                        allCategoryCounts[category.slug] || 0;
                                    return (
                                        <button
                                            key={category._id}
                                            onClick={() =>
                                                handleCategoryClick(
                                                    category.slug
                                                )
                                            }
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${isActive
                                                ? "bg-blue-50 text-blue-600 font-semibold"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <FiUsers
                                                    size={16}
                                                    className={
                                                        isActive
                                                            ? "text-blue-500"
                                                            : "text-gray-400"
                                                    }
                                                />
                                                <span>{category.name}</span>
                                            </div>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${isActive
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-gray-100 text-gray-500"
                                                    }`}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Need a specific talent? CTA */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl border border-blue-100 p-5">
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-200/40 rounded-full blur-2xl" />

                            <div className="relative">


                                <h4 className="font-bold text-gray-900 mb-1.5">
                                    Need a specific talent?
                                </h4>
                                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                                    Tell us what you're looking for and we'll
                                    help you find the perfect match.
                                </p>

                                <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:-translate-y-0.5">
                                    Contact Us
                                    <FiArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* ================= MAIN CONTENT ================= */}
                    <main className="space-y-5">
                        {/* Search & Filter Bar */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-col md:flex-row items-stretch md:items-center gap-2">
                            {/* Search Input */}
                            <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl bg-gray-50/60 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
                                <FiSearch
                                    size={18}
                                    className="text-gray-400 flex-shrink-0"
                                />
                                <input
                                    type="text"
                                    placeholder="Search talents by name"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                                />
                            </div>

                            {/* Age Range Dropdown */}
                            <div className="relative md:w-44">
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50/60 border border-transparent hover:bg-gray-50 cursor-pointer transition-all">
                                    <FiBriefcase
                                        size={16}
                                        className="text-gray-400 flex-shrink-0"
                                    />
                                    <select
                                        value={ageRange}
                                        onChange={(e) =>
                                            setAgeRange(e.target.value)
                                        }
                                        className="flex-1 outline-none text-sm text-gray-500 bg-transparent cursor-pointer appearance-none pr-4"
                                    >
                                        <option value="">Age Range</option>
                                        <option value="16-20">
                                            16 - 20 Years
                                        </option>
                                        <option value="21-25">
                                            21 - 25 Years
                                        </option>
                                        <option value="26-30">
                                            26 - 30 Years
                                        </option>
                                        <option value="31-40">
                                            31 - 40 Years
                                        </option>
                                        <option value="40">40+ Years</option>
                                    </select>
                                    <FiChevronDown
                                        size={14}
                                        className="text-gray-400 absolute right-3 pointer-events-none"
                                    />
                                </div>
                            </div>

                            {/* Location Dropdown */}
                            {/* <div className="relative md:w-44">
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50/60 border border-transparent hover:bg-gray-50 cursor-pointer transition-all">
                                    <FiMapPin
                                        size={16}
                                        className="text-gray-400 flex-shrink-0"
                                    />
                                    <select
                                        value={selectedLocation}
                                        onChange={(e) =>
                                            setSelectedLocation(
                                                e.target.value
                                            )
                                        }
                                        className="flex-1 outline-none text-sm text-gray-500 bg-transparent cursor-pointer appearance-none pr-4"
                                    >
                                        <option value="">Location</option>
                                        <option value="kolkata">Kolkata</option>
                                        <option value="mumbai">Mumbai</option>
                                        <option value="delhi">Delhi</option>
                                        <option value="bangalore">
                                            Bangalore
                                        </option>
                                        <option value="pune">Pune</option>
                                        <option value="chennai">Chennai</option>
                                        <option value="hyderabad">
                                            Hyderabad
                                        </option>
                                        <option value="jaipur">Jaipur</option>
                                    </select>
                                    <FiChevronDown
                                        size={14}
                                        className="text-gray-400 absolute right-3 pointer-events-none"
                                    />
                                </div>
                            </div> */}

                            {/* Search Button */}
                            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-200 hover:shadow-lg whitespace-nowrap">
                                Search
                                <FiArrowRight size={16} />
                            </button>
                        </div>

                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <h2 className="text-lg font-bold text-gray-900  border-l-4 pl-2 border-blue-600">
                                {categoryName} Talents{" "}
                                <span className="text-gray-400 font-normal">
                                    ({talentCount})
                                </span>
                            </h2>

                            <div className="flex items-center gap-3">
                                {/* Sort By */}
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-100 shadow-sm">
                                    <span className="text-xs font-semibold text-gray-500">
                                        Sort by:
                                    </span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value)
                                        }
                                        className="outline-none text-xs font-medium text-gray-700 bg-transparent cursor-pointer appearance-none pr-4"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="name">Name A-Z</option>
                                        <option value="age-asc">
                                            Age: Youngest
                                        </option>
                                        <option value="age-desc">
                                            Age: Oldest
                                        </option>
                                    </select>
                                </div>

                                {/* View Mode Toggle */}
                                <div className="flex items-center bg-white border border-gray-100 rounded-xl shadow-sm p-0.5">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-1.5 rounded-lg transition-all ${viewMode === "grid"
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "text-gray-400 hover:text-gray-600"
                                            }`}
                                        title="Grid view"
                                    >
                                        <FiGrid size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-1.5 rounded-lg transition-all ${viewMode === "list"
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "text-gray-400 hover:text-gray-600"
                                            }`}
                                        title="List view"
                                    >
                                        <FiList size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Talent Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {Array(8)
                                    .fill(0)
                                    .map((_, i) => (
                                        <div
                                            key={i}
                                            className="animate-pulse"
                                        >
                                            <div className="relative rounded-2xl overflow-hidden bg-gray-200 h-72 mb-3" />
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5" />
                                            <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                                            <div className="h-3 bg-gray-100 rounded w-2/3 mb-3" />
                                            <div className="h-9 bg-gray-200 rounded-xl w-full" />
                                        </div>
                                    ))}
                            </div>
                        ) : sortedTalents.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
                                    <FiUsers
                                        size={28}
                                        className="text-gray-300"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    No talents found
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Try adjusting your search or filter criteria
                                </p>
                            </div>
                        ) : (
                            <div
                                className={`grid gap-5 ${viewMode === "grid"
                                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                    : "grid-cols-1 md:grid-cols-2"
                                    }`}
                            >
                                {sortedTalents.map((talent) => {
                                    const catName =
                                        talent.categories?.[0]?.name ||
                                        categoryName;
                                    return (
                                        <div
                                            key={talent._id}
                                            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                            onClick={() =>
                                                navigate(
                                                    `/talents/${talent._id}`
                                                )
                                            }
                                        >
                                            {/* Image */}
                                            <div className="relative">
                                                <img
                                                    src={
                                                        talent.profileImage?.url
                                                    }
                                                    alt={talent.name}
                                                    className="w-full h-72 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                            talent.name ||
                                                            "Talent"
                                                        )}&background=2C78FF&color=fff&size=500`;
                                                    }}
                                                />

                                                {/* Heart Icon */}
                                                {/* <button
                                                    type="button"
                                                    className="absolute w-8 h-8 top-3 right-3 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <FiHeart
                                                        size={16}
                                                        className="text-gray-500 hover:text-blue-600 transition-colors"
                                                    />
                                                </button> */}

                                                {/* Verified Badge */}
                                                {/* <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-200">
                                                    <HiCheckBadge size={13} />
                                                    Verified
                                                </div> */}
                                            </div>

                                            {/* Info */}
                                            <div className="p-4 pt-3">
                                                <h3 className="font-bold text-gray-900 text-base mb-1 truncate">
                                                    {talent.name}
                                                </h3>

                                                <p className="text-xs text-gray-500 mb-2.5">
                                                    {talent.age} Years
                                                    {/* {talent.works[0] || "Talent"} */}
                                                </p>
                                                {/* 
                                                <div className="flex items-cnter gap-1.5 text-xs text-gray-400 mb-3.5">
                                                    <FiMapPin size={12} />
                                                    <span className="truncate">
                                                        {talent.address}
                                                    </span>
                                                </div> */}

                                                {/* Hire Button */}
                                                <button
                                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200 hover:shadow-md hover:-translate-y-0.5"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(
                                                            `/talents/${talent._id}`
                                                        );
                                                    }}
                                                >
                                                    {/* <FiUsers size={14} /> */}
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </main>
                </div>
            </section>
        </div>
    );
};

export default CategoryPage;

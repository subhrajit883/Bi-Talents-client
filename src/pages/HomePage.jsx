import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    FiSearch,
    FiArrowRight,
    FiGrid,
    FiUsers,
    FiBriefcase,
    FiShield,
} from "react-icons/fi";
import { HiCheckBadge } from "react-icons/hi2";
import { categoryUrl, talentUrl } from "../config/config";
import TalentRow from "../components/home/TalentRow";
import { motion, AnimatePresence } from "framer-motion";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { BiCategory } from "react-icons/bi";

const SkeletonCard = () => (
    <div className="shrink-0 w-44 animate-pulse">
        <div className="relative rounded-xl overflow-hidden bg-gray-200 h-52 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
    </div>
);

function HomePage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Recommended talents
    const [recommendedTalents, setRecommendedTalents] = useState([]);
    const [recommendedLoading, setRecommendedLoading] = useState(true);

    // Category-wise talents
    const [categoryTalents, setCategoryTalents] = useState([]);

    // Hero infinite cycling index
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    const fetchAllData = async () => {
        try {
            setCategoriesLoading(true);
            setRecommendedLoading(true);

            // 1. Fetch recommended talents from /api/talents/recommended
            let recList = [];
            try {
                const recRes = await axios.get(talentUrl.recommended);
                recList = recRes.data?.talents || [];
            } catch (err) {
                console.error("Failed to fetch recommended talents", err);
            }
            setRecommendedTalents(recList);
            setRecommendedLoading(false);

            // 2. Fetch active categories
            const catRes = await axios.get(categoryUrl.getAll);
            const activeCategories = (catRes.data.categories || []).filter(
                (c) => c.isActive
            );
            setCategories(activeCategories);

            // 3. Fetch talents for each category
            const categoryPromises = activeCategories.map(async (category) => {
                try {
                    const newsRes = await axios.get(
                        `${talentUrl.catWise}/${category._id}`
                    );
                    return {
                        categoryId: category._id,
                        categoryName: category.name,
                        categorySlug: category.slug,
                        talents: newsRes.data.talents || [],
                    };
                } catch (err) {
                    console.error(
                        `Failed to fetch talents for ${category.name}`,
                        err
                    );
                    return {
                        categoryId: category._id,
                        categoryName: category.name,
                        categorySlug: category.slug,
                        talents: [],
                    };
                }
            });

            const results = await Promise.all(categoryPromises);
            setCategoryTalents(results);
            setCategoriesLoading(false);
        } catch (err) {
            console.error("Error loading home data:", err);
            setCategoriesLoading(false);
            setRecommendedLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Construct hero sets for infinite animation deck
    const heroSets = useMemo(() => {
        const sets = [];

        // Sets 1..N: Each category with talents
        categoryTalents.forEach((cat) => {
            if (cat.talents && cat.talents.length > 0) {
                sets.push({
                    title: cat.categoryName,
                    badge: cat.categoryName,
                    talents: cat.talents.slice(0, 3),
                });
            }
        });

        // Fallback if no sets
        if (sets.length === 0 && recommendedTalents.length === 0) {
            const allCatTalents = categoryTalents.flatMap((c) => c.talents);
            if (allCatTalents.length > 0) {
                sets.push({
                    title: "Featured Talents",
                    badge: "Featured",
                    talents: allCatTalents.slice(0, 3),
                });
            }
        }

        return sets;
    }, [recommendedTalents, categoryTalents]);

    // Infinite cycling timer for hero right section
    useEffect(() => {
        if (heroSets.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % heroSets.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [heroSets.length]);

    const currentHeroSet = heroSets[currentHeroIndex] || heroSets[0] || {
        title: "Featured Talents",
        badge: "Featured",
        talents: [],
    };

    return (
        <div className="bg-white min-h-screen">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-white">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {/* Blue glow */}
                    <motion.div
                        animate={{
                            scale: [1, 1.08, 1],
                            opacity: [0.5, 0.7, 0.5],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-blue-100/60 blur-3xl"
                    />

                    {/* Indigo glow */}
                    <motion.div
                        animate={{
                            scale: [1, 1.06, 1],
                            x: [0, 20, 0],
                        }}
                        transition={{
                            duration: 9,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute -left-40 top-1/2 h-[420px] w-[420px] rounded-full bg-indigo-100/40 blur-3xl"
                    />

                    {/* Sky glow */}
                    <motion.div
                        animate={{
                            y: [0, -25, 0],
                            opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl"
                    />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-16">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] xl:gap-16">
                        {/* LEFT COLUMN: HERO TEXT & REACTIVE MOTION */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col items-center text-center lg:items-start lg:text-left z-10"
                        >
                            {/* Animated Floating Pill */}
                            <h2 className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-gradient-to-r from-blue-50 via-indigo-50/60 to-sky-50 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-xs backdrop-blur-md">
                                {/* <FaWandMagicSparkles className="text-blue-500" size={14} /> */}
                                <span>India's Best Talent Network</span>
                            </h2>

                            {/* Main Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl playfair-display-medium xl:text-7xl text-slate-900 tracking-[-0.01em] leading-[1.25]">
                                Find Your{" "}
                                <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent">
                                    Best
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent">
                                    Talent{" "}
                                </span>
                                for your
                                <br />
                                <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent">
                                    Next Project
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-base sm:text-lg  text-slate-600 leading-relaxed font-normal">
                                Discover top-tier actors, fashion models, dancers, and creative performers. Verified portfolios, instant bookings, and direct client connection.
                            </p>

                            {/* CTA Buttons with Spring Physics */}
                            <div className="mt-8 flex flex-wrap items-center cormorant-garamond-bold justify-center lg:justify-start gap-4">

                                {/* Browse Talents */}
                                <motion.div
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    <Link
                                        to="/category/recommended"
                                        className="group relative overflow-hidden px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 flex items-center gap-2.5 transition-all duration-300"
                                    >
                                        {/* Moving shine */}
                                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />

                                        <span className="relative z-10 text-lg">
                                            Browse Talents
                                        </span>

                                        <motion.span
                                            className="relative z-10 flex items-center"
                                            whileHover={{ x: 4 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <FiArrowRight size={18} />
                                        </motion.span>
                                    </Link>
                                </motion.div>

                                {/* What We Do */}
                                <motion.div
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    <Link
                                        to="/about"
                                        className="group relative overflow-hidden px-6 py-3.5 bg-white text-slate-900 font-bold rounded-2xl border border-slate-300 shadow-sm flex items-center gap-2 transition-all duration-300 hover:border-blue-400 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10"
                                    >
                                        {/* Animated background */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

                                        <span className="relative z-10 text-lg">
                                            What We Do
                                        </span>

                                        {/* Animated arrow */}
                                        <motion.span
                                            className="relative z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                                        >
                                            <FiArrowRight size={17} />
                                        </motion.span>
                                    </Link>
                                </motion.div>

                            </div>

                            {/* Quick Feature Stats Matching Attached Image Design */}
                            <div className="mt-10 pt-6 sm:hidden hidden border-t border-slate-100 lg:flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-slate-600">
                                {/* Card 1: 500+ Talents */}
                                <div className="flex items-center gap-3 playfair-display-bold leading-1.5">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50/90 text-blue-600 shadow-2xs">
                                        <FiShield size={20} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-slate-900 leading-tight">Verified</p>
                                        <p className="text-xs font-medium text-slate-600">& Trusted</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 playfair-display-bold leading-1.5">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50/90 text-blue-600 shadow-2xs">
                                        <FiUsers size={20} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-slate-900 leading-tight">50+</p>
                                        <p className="text-xs font-medium text-slate-600">Talents</p>
                                    </div>
                                </div>

                                {/* Vertical Divider */}
                                <div className="hidden sm:block h-9 w-px bg-slate-200/80" />

                                {/* Card 2: 100+ Projects Completed */}
                                <div className="flex items-center gap-3 playfair-display-bold leading-1.5">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50/90 text-blue-600 shadow-2xs">
                                        <BiCategory size={20} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-slate-900 leading-tight">Multiple</p>
                                        <p className="text-xs font-medium text-slate-600">Categories</p>
                                    </div>
                                </div>

                                {/* Vertical Divider */}
                                <div className="hidden sm:block h-9 w-px bg-slate-200/80" />



                            </div>
                        </motion.div>

                        {/* RIGHT COLUMN: LARGE AD SHOWCASE CATEGORY NAME & TALENT CARDS */}
                        <div className="relative flex flex-col items-center justify-center">
                            {/* Large Ad Showcase Category Name Header */}
                            {heroSets.length > 0 && (
                                <div className="mb-6 z-20 flex flex-col items-center text-center min-h-[60px] justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentHeroIndex}
                                            initial={{ opacity: 0, y: -12, scale: 0.92 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 12, scale: 0.92 }}
                                            transition={{ duration: 0.45, ease: "easeOut" }}
                                            className="flex flex-col items-center gap-1"
                                        >
                                            <h2 className="text-2xl playfair-display-bold sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500">
                                                {currentHeroSet.title}
                                            </h2>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* TALENT CARDS DECK WITH INFINITE CYCLING ANIMATION */}
                            <div className="relative h-[440px] w-full max-w-[590px] sm:h-[500px]">
                                {recommendedLoading && categoriesLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ y: [0, -8, 0], rotate: [-8, -6, -8] }}
                                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute left-[3%] top-1/2 h-56 w-36 -translate-y-1/2 -rotate-8 rounded-[30px] bg-blue-100 shadow-xl sm:h-72 sm:w-44"
                                        />
                                        <motion.div
                                            animate={{ y: [0, -12, 0], scale: [1, 1.015, 1] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute left-1/2 top-1/2 z-20 h-72 w-44 -translate-x-1/2 -translate-y-1/2 rounded-[34px] bg-blue-100 shadow-2xl sm:h-[360px] sm:w-56"
                                        />
                                        <motion.div
                                            animate={{ y: [0, 8, 0], rotate: [8, 6, 8] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute right-[3%] top-1/2 h-56 w-36 -translate-y-1/2 rotate-8 rounded-[30px] bg-blue-100 shadow-xl sm:h-72 sm:w-44"
                                        />
                                    </>
                                ) : currentHeroSet.talents && currentHeroSet.talents.length > 0 ? (
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentHeroIndex}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.6 }}
                                            className="absolute inset-0"
                                        >
                                            {currentHeroSet.talents.slice(0, 3).map((talent, index) => {
                                                const positionClasses = [
                                                    // LEFT
                                                    "left-[2%] sm:left-[4%] top-1/2 -translate-y-1/2 -rotate-8 w-36 sm:w-44 lg:w-48 h-56 sm:h-72 lg:h-[310px] z-10",
                                                    // CENTER
                                                    "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 sm:w-56 lg:w-[250px] h-72 sm:h-[360px] lg:h-[410px] z-30",
                                                    // RIGHT
                                                    "right-[2%] sm:right-[4%] top-1/2 -translate-y-1/2 rotate-8 w-36 sm:w-44 lg:w-48 h-56 sm:h-72 lg:h-[310px] z-10",
                                                ];

                                                return (
                                                    <motion.div
                                                        key={talent._id || index}
                                                        onClick={() => navigate(`/talents/${talent._id}`)}
                                                        initial={{
                                                            opacity: 0,
                                                            x: index === 0 ? -80 : index === 2 ? 80 : 0,
                                                            y: 40,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                            y: [0, -10, 0],
                                                        }}
                                                        transition={{
                                                            opacity: { duration: 0.6, delay: index * 0.1 },
                                                            x: { duration: 0.7, delay: index * 0.1, ease: "easeOut" },
                                                            y: {
                                                                duration: 3.5 + index * 0.5,
                                                                repeat: Infinity,
                                                                ease: "easeInOut",
                                                                delay: index * 0.2,
                                                            },
                                                        }}
                                                        whileHover={{
                                                            scale: 1.05,
                                                            y: -16,
                                                            zIndex: 50,
                                                        }}
                                                        className={`absolute ${positionClasses[index]} group cursor-pointer overflow-hidden rounded-[30px] border-[5px] border-white bg-slate-100 shadow-[0_25px_60px_-15px_rgba(37,99,235,0.30)]`}
                                                    >
                                                        <img
                                                            src={talent.profileImage?.url}
                                                            alt={talent.name || "Talent"}
                                                            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                                            onError={(e) => {
                                                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                    talent.name || "Talent"
                                                                )}&background=2C78FF&color=fff&size=500`;
                                                            }}
                                                        />

                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

                                                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                                                            <div className="mb-1 flex items-center gap-1.5">
                                                                <HiCheckBadge size={16} className="text-blue-400" />
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                                                                    Verified Talent
                                                                </span>
                                                            </div>
                                                            <h3 className="truncate text-sm font-bold text-white sm:text-base">
                                                                {talent.name || "Talent"}
                                                            </h3>
                                                            <p className="mt-0.5 text-xs text-white/70">
                                                                {talent.categories?.[0]?.name || currentHeroSet.title || "Professional Talent"}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </motion.div>
                                    </AnimatePresence>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex h-72 w-56 flex-col items-center justify-center rounded-[30px] border border-blue-100 bg-blue-50 text-slate-400 shadow-xl">
                                            <FiUsers size={30} className="mb-3 text-blue-300" />
                                            <span className="text-sm">No talents available</span>
                                        </div>
                                    </div>
                                )}

                                {/* FLOATING VERIFIED CARD */}
                                {/* <div className="absolute left-0 top-[8%] z-40 sm:left-2 flex items-center gap-2.5 rounded-2xl border border-white bg-white/95 px-3.5 py-2.5 shadow-xl shadow-blue-900/10 backdrop-blur-md">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <HiCheckBadge size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium text-slate-400">Profiles</p>
                                        <p className="text-xs font-bold text-slate-800">Verified & Trusted</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEARCH BAR SECTION */}
            <section className="max-w-7xl mx-auto px-6">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const query = searchQuery.trim() ? `search=${encodeURIComponent(searchQuery.trim())}` : "";
                        const cat = selectedCategory ? `categories=${selectedCategory}` : "";
                        const queryString = [query, cat].filter(Boolean).join("&");
                        navigate(`/search${queryString ? `?${queryString}` : ""}`);
                    }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex flex-col md:flex-row items-center gap-2"
                >
                    <div className="flex items-center gap-2 flex-1 px-3 py-2 border-b md:border-b-0 md:border-r border-gray-200 w-full">
                        <FiSearch size={18} className="text-gray-400 flex-shrink-0" />
                        <input
                            id="search-talent-input"
                            type="text"
                            placeholder="Search talents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                        />
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-52">
                        <FiGrid size={18} className="text-gray-400 flex-shrink-0" />
                        <select
                            id="search-category-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="flex-1 outline-none text-sm text-gray-500 bg-transparent cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        id="search-submit-btn"
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all whitespace-nowrap w-full md:w-auto justify-center cursor-pointer shadow-md shadow-blue-500/20"
                    >
                        Search
                        <FiArrowRight size={16} />
                    </button>
                </form>
            </section>

            {/* TALENT SECTIONS */}
            <section className="max-w-7xl mx-auto px-6 py-4 pb-12">
                <div className="border-t border-gray-100 my-8"></div>

                {categoriesLoading || recommendedLoading ? (
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
                    <>
                        {/* OUR RECOMMENDATION ROW */}
                        {recommendedTalents.length > 0 && (
                            <TalentRow
                                categoryName="Our Recommendation"
                                categorySlug="recommended"
                                talents={recommendedTalents}
                                loading={false}
                                isHighlighted={true}
                            />
                        )}

                        {/* CATEGORY WISE TALENT ROWS */}
                        {categoryTalents.map((category) => (
                            <TalentRow
                                key={category.categoryId}
                                talents={category.talents}
                                categoryId={category.categoryId}
                                categoryName={category.categoryName}
                                categorySlug={category.categorySlug}
                                loading={false}
                            />
                        ))}
                    </>
                )}
            </section>
        </div>
    );
}

export default HomePage;
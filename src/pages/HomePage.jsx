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
import { BiSolidZap } from "react-icons/bi";
import { motion } from "framer-motion";
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

    return (
        <div className="bg-white min-h-screen">

            <section className="relative overflow-hidden bg-white">
                {/* =========================================================
        BACKGROUND ATMOSPHERE
    ========================================================= */}
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

                {/* =========================================================
        MAIN CONTAINER
    ========================================================= */}
                <div className="relative mx-auto max-w-7xl px-6 py-14 lg:py-20">

                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] xl:gap-16">

                        {/* =====================================================
                LEFT CONTENT
            ===================================================== */}
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: {},
                                show: {
                                    transition: {
                                        staggerChildren: 0.12,
                                    },
                                },
                            }}
                            className="relative z-10 max-w-xl"
                        >
                            {/* Eyebrow */}

                            <motion.div
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    show: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.7,
                                            ease: [0.22, 1, 0.36, 1],
                                        },
                                    },
                                }}
                                className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 shadow-sm"
                            >
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />

                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600" />
                                </span>

                                <span className="text-xs font-semibold text-blue-700 sm:text-sm">
                                    Discover Exceptional Talent
                                </span>
                            </motion.div>

                            {/* =================================================
                    HEADING
                ================================================= */}
                            <motion.h1
                                variants={{
                                    hidden: {},
                                    show: {
                                        transition: {
                                            staggerChildren: 0.14,
                                        },
                                    },
                                }}
                                initial="hidden"
                                animate="show"
                                className="text-[40px] montserrat-bold font-semibold leading-[1.25] text-slate-950 lg:text-[58px] xl:text-[64px]"
                            >

                                {/* Find the Right */}
                                <motion.span
                                    variants={{
                                        hidden: {
                                            opacity: 0,
                                            y: 45,
                                        },
                                        show: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                duration: 0.8,
                                                ease: [0.22, 1, 0.36, 1],
                                            },
                                        },
                                    }}
                                    className="block"
                                >
                                    Find the Right
                                </motion.span>

                                {/* Talent for Your */}
                                <span className="mt-1 block">

                                    <motion.span
                                        variants={{
                                            hidden: {
                                                opacity: 0,
                                                y: 45,
                                            },
                                            show: {
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    duration: 0.8,
                                                    ease: [0.22, 1, 0.36, 1],
                                                },
                                            },
                                        }}
                                        className="relative inline-block"
                                    >
                                        <motion.span
                                            animate={{
                                                backgroundPosition: [
                                                    "0% 50%",
                                                    "100% 50%",
                                                    "0% 50%",
                                                ],
                                            }}
                                            transition={{
                                                duration: 5,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="relative z-10 inline-block bg-linear-to-r from-blue-400 via-blue-600 to-blue-700 bg-[length:200%_200%] bg-clip-text text-transparent"
                                        >
                                            Talent
                                        </motion.span>

                                        {/* Animated underline */}
                                        {/* <motion.span
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{
                                    delay: 1,
                                    duration: 0.8,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="absolute bottom-[-5px] left-0 h-2 rounded-full bg-blue-100/80"
                            />*/}
                                    </motion.span>

                                    <motion.span
                                        variants={{
                                            hidden: {
                                                opacity: 0,
                                                y: 45,
                                            },
                                            show: {
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    duration: 0.8,
                                                    ease: [0.22, 1, 0.36, 1],
                                                },
                                            },
                                        }}
                                        className="text-slate-950"
                                    >
                                        {" "}for Your
                                    </motion.span>
                                </span>

                                {/* Next Project */}
                                <motion.span
                                    variants={{
                                        hidden: {
                                            opacity: 0,
                                            y: 45,
                                        },
                                        show: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                duration: 0.8,
                                                ease: [0.22, 1, 0.36, 1],
                                            },
                                        },
                                    }}
                                    className="mt-1 block"
                                >
                                    Next{" "}

                                    <motion.span
                                        animate={{
                                            backgroundPosition: [
                                                "0% 50%",
                                                "100% 50%",
                                                "0% 50%",
                                            ],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="inline-block bg-linear-to-r from-blue-400 via-blue-600 to-blue-700 bg-[length:200%_200%] bg-clip-text text-transparent"
                                    >
                                        Project
                                    </motion.span>
                                </motion.span>

                            </motion.h1>

                            {/* =================================================
                    DESCRIPTION
                ================================================= */}
                            <motion.p
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                        y: 25,
                                    },
                                    show: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.7,
                                            ease: [0.22, 1, 0.36, 1],
                                        },
                                    },
                                }}
                                className="mt-7 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg"
                            >
                                Discover, connect, and hire exceptional professionals
                                across{" "}
                                <span className="font-semibold text-slate-700">
                                    modelling, acting, dancing, singing
                                </span>{" "}
                                and more — all in one place.
                            </motion.p>

                            {/* =================================================
                    CTA BUTTONS
                ================================================= */}
                            <motion.div
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                        y: 25,
                                    },
                                    show: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.7,
                                        },
                                    },
                                }}
                                className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
                            >

                                {/* Browse */}
                                <Link
                                    to="/talents"
                                    className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-linear-to-r from-blue-500 to-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/30"
                                >
                                    {/* Shine */}
                                    <motion.span
                                        animate={{
                                            x: ["-120%", "120%"],
                                        }}
                                        transition={{
                                            duration: 1.8,
                                            repeat: Infinity,
                                            repeatDelay: 3,
                                            ease: "easeInOut",
                                        }}
                                        className="absolute inset-y-0 left-0 w-1/2 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/20 to-transparent"
                                    />

                                    <span className="relative">
                                        Browse Talents
                                    </span>

                                    <FiArrowRight
                                        size={17}
                                        className="relative transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </Link>

                                {/* About */}
                                <Link
                                    to="/about"
                                    className="group inline-flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-blue-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:text-blue-600 hover:shadow-lg"
                                >
                                    How It Works

                                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </Link>

                            </motion.div>

                            {/* =================================================
                    TRUST / STATS
                ================================================= */}
                            <motion.div
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                        y: 25,
                                    },
                                    show: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.7,
                                        },
                                    },
                                }}
                                className="mt-9 flex flex-nowrap items-center gap-x-4 overflow-x-auto border-t border-slate-100 pt-7 sm:gap-x-8"
                            >

                                {/* Talents */}
                                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:h-10 sm:w-10">
                                        <FiUsers size={17} />
                                    </div>

                                    <div>
                                        <p className="text-base font-bold leading-none text-slate-900 sm:text-lg">
                                            100+
                                        </p>

                                        <p className="mt-1 whitespace-nowrap text-[10px] text-slate-400 sm:text-xs">
                                            Talents
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="hidden h-9 w-px shrink-0 bg-slate-200 sm:block" />

                                {/* Verified */}
                                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:h-10 sm:w-10">
                                        <HiCheckBadge size={19} />
                                    </div>

                                    <div>
                                        <p className="text-base font-bold leading-none text-slate-900 sm:text-lg">
                                            Verified
                                        </p>

                                        <p className="mt-1 whitespace-nowrap text-[10px] text-slate-400 sm:text-xs">
                                            Talents
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="hidden h-9 w-px shrink-0 bg-slate-200 sm:block" />

                                {/* Fast */}
                                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 sm:h-10 sm:w-10">
                                        <BiSolidZap size={19} />
                                    </div>

                                    <div>
                                        <p className="text-base font-bold leading-none text-slate-900 sm:text-lg">
                                            Fast & Easy
                                        </p>

                                        <p className="mt-1 whitespace-nowrap text-[10px] text-slate-400 sm:text-xs">
                                            hiring
                                        </p>
                                    </div>
                                </div>

                            </motion.div>

                        </motion.div>

                        {/* =====================================================
                RIGHT VISUAL
            ===================================================== */}
                        <div className="relative flex min-h-[420px] items-center justify-center sm:min-h-[500px] lg:min-h-[560px]">

                            {/* =================================================
                    OUTER CIRCLE
                ================================================= */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.025, 1],
                                    rotate: [0, 3, 0],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute h-[360px] w-[360px] rounded-full border border-blue-100/60 bg-linear-to-br from-blue-50 via-blue-100/50 to-indigo-100/30 sm:h-[460px] sm:w-[460px] lg:h-[520px] lg:w-[520px]"
                            />

                            {/* =================================================
                    INNER CIRCLE
                ================================================= */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    opacity: [0.4, 0.8, 0.4],
                                    rotate: [0, -5, 0],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute h-[270px] w-[270px] rounded-full border border-blue-200/50 sm:h-[350px] sm:w-[350px] lg:h-[410px] lg:w-[410px]"
                            />

                            {/* =================================================
                    ORBIT DOTS
                ================================================= */}
                            {/* <motion.div
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute h-[390px] w-[390px] rounded-full sm:h-[500px] sm:w-[500px] lg:h-[550px] lg:w-[550px]"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                        className="absolute right-[8%] top-[13%] h-3 w-3 rounded-full bg-blue-500 shadow-lg shadow-blue-400/40"
                    />
                </motion.div> */}

                            {/* =================================================
                    TALENT CARDS
                ================================================= */}
                            <div className="relative h-[440px] w-full max-w-[590px] sm:h-[500px]">

                                {/* Loading State */}
                                {heroTalentsLoading ? (
                                    <>
                                        <motion.div
                                            animate={{
                                                y: [0, -8, 0],
                                                rotate: [-8, -6, -8],
                                            }}
                                            transition={{
                                                duration: 3.5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="absolute left-[3%] top-1/2 h-56 w-36 -translate-y-1/2 -rotate-8 rounded-[30px] bg-blue-100 shadow-xl sm:h-72 sm:w-44"
                                        />

                                        <motion.div
                                            animate={{
                                                y: [0, -12, 0],
                                                scale: [1, 1.015, 1],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="absolute left-1/2 top-1/2 z-20 h-72 w-44 -translate-x-1/2 -translate-y-1/2 rounded-[34px] bg-blue-100 shadow-2xl sm:h-[360px] sm:w-56"
                                        />

                                        <motion.div
                                            animate={{
                                                y: [0, 8, 0],
                                                rotate: [8, 6, 8],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="absolute right-[3%] top-1/2 h-56 w-36 -translate-y-1/2 rotate-8 rounded-[30px] bg-blue-100 shadow-xl sm:h-72 sm:w-44"
                                        />
                                    </>
                                ) : heroTalents.length > 0 ? (

                                    heroTalents.slice(0, 3).map((talent, index) => {

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
                                                onClick={() =>
                                                    navigate(`/talents/${talent._id}`)
                                                }

                                                /* Entrance */
                                                initial={{
                                                    opacity: 0,
                                                    x:
                                                        index === 0
                                                            ? -100
                                                            : index === 2
                                                                ? 100
                                                                : 0,
                                                    y: 80,
                                                    scale:
                                                        index === 1
                                                            ? 0.8
                                                            : 0.88,
                                                }}

                                                animate={{
                                                    opacity: 1,
                                                    x: 0,
                                                    y: [0, -10, 0],
                                                    scale: 1,
                                                }}

                                                transition={{
                                                    opacity: {
                                                        duration: 0.8,
                                                        delay:
                                                            0.45 +
                                                            index * 0.18,
                                                    },

                                                    x: {
                                                        duration: 0.9,
                                                        delay:
                                                            0.45 +
                                                            index * 0.18,
                                                        ease: [
                                                            0.22,
                                                            1,
                                                            0.36,
                                                            1,
                                                        ],
                                                    },

                                                    y: {
                                                        duration:
                                                            4 + index * 0.7,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                        delay:
                                                            1.5 +
                                                            index * 0.3,
                                                    },

                                                    scale: {
                                                        duration: 0.9,
                                                        delay:
                                                            0.45 +
                                                            index * 0.18,
                                                        ease: [
                                                            0.22,
                                                            1,
                                                            0.36,
                                                            1,
                                                        ],
                                                    },
                                                }}

                                                whileHover={{
                                                    scale: 1.05,
                                                    y: -16,
                                                    zIndex: 50,
                                                }}

                                                className={`absolute ${positionClasses[index]} group cursor-pointer overflow-hidden rounded-[30px] border-[5px] border-white bg-slate-100 shadow-[0_25px_60px_-15px_rgba(37,99,235,0.30)]`}
                                            >

                                                {/* Image */}
                                                <img
                                                    src={
                                                        talent.profileImage?.url
                                                    }
                                                    alt={
                                                        talent.name ||
                                                        "Talent"
                                                    }
                                                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                                    onError={(e) => {
                                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                            talent.name ||
                                                            "Talent"
                                                        )}&background=2C78FF&color=fff&size=500`;
                                                    }}
                                                />

                                                {/* Image shine */}
                                                <motion.div
                                                    initial={{
                                                        x: "-120%",
                                                    }}
                                                    animate={{
                                                        x: "120%",
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        repeatDelay:
                                                            4 + index,
                                                        ease: "easeInOut",
                                                    }}
                                                    className="absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/25 to-transparent"
                                                />

                                                {/* Gradient */}
                                                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

                                                {/* Talent Info */}
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        delay:
                                                            1 +
                                                            index * 0.2,
                                                        duration: 0.6,
                                                    }}
                                                    className="absolute bottom-0 left-0 right-0 p-4 sm:p-5"
                                                >
                                                    <div className="mb-1 flex items-center gap-1.5">
                                                        <HiCheckBadge
                                                            size={16}
                                                            className="text-blue-400"
                                                        />

                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                                                            Verified Talent
                                                        </span>
                                                    </div>

                                                    <h3 className="truncate text-sm font-bold text-white sm:text-base">
                                                        {talent.name ||
                                                            "Talent"}
                                                    </h3>

                                                    <p className="mt-0.5 text-xs text-white/70">
                                                        {talent.categories?.[0]
                                                            ?.name ||
                                                            "Professional Talent"}
                                                    </p>
                                                </motion.div>

                                                {/* Hover glow */}
                                                <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-white/0 transition-all duration-500 group-hover:ring-4 group-hover:ring-blue-400/30" />

                                            </motion.div>
                                        );
                                    })

                                ) : (

                                    /* Empty State */
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            animate={{
                                                y: [0, -8, 0],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="flex h-72 w-56 flex-col items-center justify-center rounded-[30px] border border-blue-100 bg-blue-50 text-slate-400 shadow-xl"
                                        >
                                            <FiUsers
                                                size={30}
                                                className="mb-3 text-blue-300"
                                            />

                                            <span className="text-sm">
                                                No talents available
                                            </span>
                                        </motion.div>
                                    </div>
                                )}

                                {/* =================================================
                        FLOATING VERIFIED CARD
                    ================================================= */}
                                {/* <motion.div
                                    initial={{
                                        opacity: 0,
                                        x: -30,
                                        y: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        y: [0, -7, 0],
                                    }}
                                    transition={{
                                        opacity: {
                                            duration: 0.7,
                                            delay: 1.3,
                                        },
                                        x: {
                                            duration: 0.7,
                                            delay: 1.3,
                                        },
                                        y: {
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 2,
                                        },
                                    }}
                                    className="absolute left-0 top-[8%] z-40 sm:left-2"
                                > */}
                                    <div className="absolute left-0 top-[8%] z-40 sm:left-2 flex items-center gap-2.5 rounded-2xl border border-white bg-white/95 px-3.5 py-2.5 shadow-xl shadow-blue-900/10 backdrop-blur-md">

                                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                            <HiCheckBadge size={18} />
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-medium text-slate-400">
                                                Profiles
                                            </p>

                                            <p className="text-xs font-bold text-slate-800">
                                                Verified & Trusted
                                            </p>
                                        </div>

                                    </div>
                                {/* </motion.div> */}

                                {/* =================================================
                        FLOATING TALENT COUNT CARD
                    ================================================= */}
                                {/* <motion.div
                                    initial={{
                                        opacity: 0,
                                        x: 30,
                                        y: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        y: [0, 7, 0],
                                    }}
                                    transition={{
                                        opacity: {
                                            duration: 0.7,
                                            delay: 1.6,
                                        },
                                        x: {
                                            duration: 0.7,
                                            delay: 1.6,
                                        },
                                        y: {
                                            duration: 4.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 2.2,
                                        },
                                    }}
                                    className="absolute bottom-[8%] right-0 z-40 sm:right-1"
                                > */}
                                    <div className="absolute bottom-[8%] right-0 z-40 sm:right-1 flex items-center gap-2.5 rounded-2xl border border-white bg-white/95 px-3.5 py-2.5 shadow-xl shadow-blue-900/10 backdrop-blur-md">

                                        {/* Mini avatars */}
                                        <div className="flex -space-x-2">
                                            {heroTalents
                                                .slice(0, 3)
                                                .map((talent, index) => (
                                                    <motion.div
                                                        key={
                                                            talent._id ||
                                                            index
                                                        }
                                                        whileHover={{
                                                            scale: 1.15,
                                                            zIndex: 20,
                                                        }}
                                                        className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-blue-100"
                                                    >
                                                        <img
                                                            src={
                                                                talent
                                                                    .profileImage
                                                                    ?.url
                                                            }
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </motion.div>
                                                ))}
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-slate-800">
                                                100+ Talents
                                            </p>

                                            <p className="text-[10px] text-slate-400">
                                                Ready to work
                                            </p>
                                        </div>

                                    </div>
                                {/* </motion.div> */}

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6">

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

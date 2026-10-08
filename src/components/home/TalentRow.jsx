import { useRef } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaWandMagicSparkles } from "react-icons/fa6";
import TalentCard, { TalentCardSkeleton } from "./TalentCard";

const TalentRow = ({ categoryName, categorySlug, talents, loading, isHighlighted = false }) => {
    const scrollRef = useRef(null);

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: dir === "left" ? -300 : 300,
                behavior: "smooth",
            });
        }
    };

    // Don't render an empty row
    if (!loading && talents.length === 0) return null;

    if (isHighlighted) {
        return (
            <section className="mb-14 relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-9 border border-blue-200/80 bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-sky-50/80 shadow-xl shadow-blue-900/5 backdrop-blur-sm">
                {/* Decorative glowing ambient background spheres */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-200/60 blur-3xl" />
                <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />

                {/* Header */}
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        {/* <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 tracking-wider uppercase mb-2.5">
                            <FaWandMagicSparkles className="text-amber-300 animate-pulse" size={13} />
                            <span>Handpicked Selection</span>
                        </div> */}
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-slate-900 cormorant-garamond-bold tracking-tight flex items-center gap-2.5">
                            {categoryName}
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                        </h2>
                        {/* <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-2xl font-normal leading-relaxed">
                            Handpicked performers curated by our talent specialists for exceptional quality, verified experience, and high client ratings.
                        </p> */}
                    </div>

                    <Link
                        to={`/category/${categorySlug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all duration-300 hover:gap-3 group shrink-0"
                    >
                        <span>Explore All Recommended</span>
                        <FiArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Scrollable Row */}
                <div className="relative z-10">
                    <button
                        onClick={() => scroll("left")}
                        aria-label="Scroll left"
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-blue-600 hover:text-white text-slate-700 border border-blue-100 shadow-xl rounded-full p-2.5 transition-all hidden md:flex items-center justify-center -translate-x-5 cursor-pointer backdrop-blur-md"
                    >
                        <FiChevronLeft size={20} />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex gap-5 overflow-x-auto pb-3 pt-1 scroll-smooth"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {loading
                            ? Array(5).fill(null).map((_, i) => <TalentCardSkeleton key={i} />)
                            : talents.map((talent) => (
                                <TalentCard key={talent._id} talent={talent} isRecommended={true} />
                            ))}
                    </div>

                    <button
                        onClick={() => scroll("right")}
                        aria-label="Scroll right"
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-blue-600 hover:text-white text-slate-700 border border-blue-100 shadow-xl rounded-full p-2.5 transition-all hidden md:flex items-center justify-center translate-x-5 cursor-pointer backdrop-blur-md"
                    >
                        <FiChevronRight size={20} />
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent cormorant-garamond-bold">
                    {categoryName}
                </h2>
                <Link
                    to={`/category/${categorySlug}`}
                    className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                    View All Talents <FiArrowRight size={14} />
                </Link>
            </div>

            {/* Scrollable Row */}
            <div className="relative">
                <button
                    onClick={() => scroll("left")}
                    aria-label="Scroll left"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-all hidden md:flex items-center justify-center -translate-x-4 cursor-pointer"
                >
                    <FiChevronLeft size={18} className="text-gray-600" />
                </button>

                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {loading
                        ? Array(5).fill(null).map((_, i) => <TalentCardSkeleton key={i} />)
                        : talents.map((talent) => (
                            <TalentCard key={talent._id} talent={talent} />
                        ))}
                </div>

                <button
                    onClick={() => scroll("right")}
                    aria-label="Scroll right"
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-all hidden md:flex items-center justify-center translate-x-4 cursor-pointer"
                >
                    <FiChevronRight size={18} className="text-gray-600" />
                </button>
            </div>
        </section>
    );
};

export default TalentRow;

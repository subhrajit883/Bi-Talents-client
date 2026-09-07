import { useRef } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import TalentCard, { TalentCardSkeleton } from "./TalentCard";

const TalentRow = ({ categoryName, categorySlug, talents, loading }) => {
    const scrollRef = useRef(null);
    console.log("talents", talents);
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

    return (
        <section className="mb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{categoryName}</h2>
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
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-all hidden md:flex items-center justify-center -translate-x-4"
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
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-all hidden md:flex items-center justify-center translate-x-4"
                >
                    <FiChevronRight size={18} className="text-gray-600" />
                </button>
            </div>
        </section>
    );
};

export default TalentRow;

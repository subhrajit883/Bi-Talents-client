
import { FiHeart, FiStar, FiArrowRight } from "react-icons/fi";
import { HiCheckBadge } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const TalentCard = ({ talent, isRecommended = false }) => {
    const categoryName = talent.categories?.[0]?.name || "Talent";
    const navigate = useNavigate();

    if (isRecommended) {
        return (
            <div
                className="shrink-0 w-64 group cursor-pointer bg-white p-2.5 rounded-2xl border border-blue-100/90 shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
                onClick={() => navigate(`/talents/${talent._id}`)}
            >
                <div>
                    {/* Image Container */}
                    <div className="relative rounded-xl overflow-hidden mb-3 shadow-sm">
                        <img
                            src={talent.profileImage?.url}
                            alt={talent.name}
                            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    talent.name
                                )}&background=2C78FF&color=fff&size=200`;
                            }}
                        />

                        {/* Top Badge */}
                        <div className="absolute top-2.5 left-2.5 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 backdrop-blur-md border border-white/20">
                            <FiStar size={11} className="fill-amber-300 text-amber-300" />
                            <span>Top Choice</span>
                        </div>

                        {/* Verified badge */}
                        <div className="absolute bottom-2.5 right-2.5 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                            <HiCheckBadge size={14} className="text-blue-400" />
                            <span>Verified</span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="px-1">
                        <p className="font-bold text-slate-900 text-base truncate group-hover:text-blue-600 transition-colors">
                            {talent.name}
                        </p>
                        <p className="text-xs font-medium text-slate-500 mb-3">
                            {talent.age ? `${talent.age} Years · ` : ""}{categoryName}
                        </p>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    className="w-full py-2 bg-gradient-to-r  from-blue-600 to-blue-500 text-white text-xs font-bold rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/talents/${talent._id}`);
                    }}
                >
                    <span>View Profile</span>
                    <FiArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        );
    }

    return (
        <div
            className="shrink-0 w-64 group cursor-pointer"
            onClick={() => navigate(`/talents/${talent._id}`)}
        >
            {/* Image */}
            <div className="relative rounded-xl overflow-hidden mb-2 shadow-sm">
                <img
                    src={talent.profileImage?.url}
                    alt={talent.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            talent.name
                        )}&background=2C78FF&color=fff&size=200`;
                    }}
                />
            </div>

            {/* Info */}
            <p className="font-semibold text-gray-900 text-sm truncate">
                {talent.name}
            </p>

            <p className="text-xs text-gray-700 mb-2">
                {talent.age ? `${talent.age} Years · ` : ""}{categoryName}
            </p>

            {/* CTA */}
            <button
                className="w-full py-1.5 border cursor-pointer border-blue-500 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/talents/${talent._id}`);
                }}
            >
                View Details
            </button>
        </div>
    );
};


export const TalentCardSkeleton = () => (
    <div className="shrink-0 w-44 animate-pulse">
        <div className="rounded-xl overflow-hidden bg-gray-200 h-52 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
        <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
        <div className="h-8 bg-gray-200 rounded-lg w-full" />
    </div>
);

export default TalentCard;


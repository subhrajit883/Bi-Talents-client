
import { FiHeart } from "react-icons/fi";
import { HiCheckBadge } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
const TalentCard = ({ talent }) => {
    const categoryName = talent.categories?.[0]?.name || "Talent";
    console.log("talent", talent);
    const navigate = useNavigate();
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

                {/* Heart Icon */}
                {/* <button
                    type="button"
                    className="absolute w-6 h-6 top-2 right-2 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
                    aria-label={`Add ${talent.name} to favourites`}
                    onClick={(e) => {
                        e.stopPropagation(); // prevent navigation
                    }}
                >
                    <FiHeart
                        size={16}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                    />
                </button> */}

                {/* Verified badge */}
                {/* <div className="absolute top-2 right-2 bg-white rounded-full p-0.5 shadow-sm">
                    <FiHeart
                        size={18}
                        className="text-blue-500"
                    />
                </div> */}
            </div>

            {/* Info */}
            <p className="font-semibold text-gray-900 text-sm truncate">
                {talent.name}
            </p>

            <p className="text-xs text-gray-700 mb-2">
                {talent.age} Years · {categoryName}
            </p>

            {/* CTA */}
            <button 
                className="w-full py-1.5 border border-blue-500 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200"
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


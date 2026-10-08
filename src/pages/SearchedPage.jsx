import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiGrid,
  FiList,
  FiX,
  FiArrowLeft,
  FiFilter,
  FiUsers,
  FiMapPin,
  FiPhone,
  FiMail,
  FiArrowRight,
  FiCheck,
  FiStar,
} from "react-icons/fi";
import { HiCheckBadge } from "react-icons/hi2";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { talentUrl, categoryUrl } from "../config/config";
import TalentCard, { TalentCardSkeleton } from "../components/home/TalentCard";

const SearchedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract query parameters from URL: search & categories
  const urlSearchParam = searchParams.get("search") || searchParams.get("q") || "";
  const urlCategoryParam = searchParams.get("categories") || searchParams.get("cat") || "";

  const [searchQuery, setSearchQuery] = useState(urlSearchParam);
  const [selectedCategory, setSelectedCategory] = useState(urlCategoryParam);

  const [talents, setTalents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "name" | "age"

  // Synchronize local input state with URL params when URL changes
  useEffect(() => {
    setSearchQuery(urlSearchParam);
    setSelectedCategory(urlCategoryParam);
  }, [urlSearchParam, urlCategoryParam]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(categoryUrl.getAll);
        const list = (res.data?.categories || []).filter((c) => c.isActive);
        setCategories(list);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Talents matching search & category API criteria
  const fetchTalents = useCallback(async () => {
    try {
      setLoading(true);

      // Construct API query params matching endpoint /api/talents?search=...&categories=...
      const params = { limit: 500 };
      if (urlSearchParam) params.search = urlSearchParam;
      if (urlCategoryParam) params.categories = urlCategoryParam;

      const res = await axios.get(talentUrl.getAll, { params });
      const list = res.data?.talents || [];

      // Perform robust client-side fallback filtering if API returns full array
      const filtered = list.filter((t) => {
        if (!t.isActive) return false;

        // Match Search Query (Name, Bio, Works, Phone, Email, Candidate ID)
        if (urlSearchParam.trim()) {
          const q = urlSearchParam.trim().toLowerCase();
          const matchName = (t.name || "").toLowerCase().includes(q);
          const matchCId = (t.c_id || "").toLowerCase().includes(q);
          const matchBio = (t.bio || "").toLowerCase().includes(q);
          const matchAddress = (t.address || "").toLowerCase().includes(q);
          const matchPhone = (t.phone || "").toString().toLowerCase().includes(q);
          const matchEmail = (t.email || "").toLowerCase().includes(q);
          const matchWorks = Array.isArray(t.works) && t.works.some((w) => w.toLowerCase().includes(q));

          if (!matchName && !matchCId && !matchBio && !matchAddress && !matchPhone && !matchEmail && !matchWorks) {
            return false;
          }
        }

        // Match Category
        if (urlCategoryParam && urlCategoryParam !== "all") {
          const matchCat = Array.isArray(t.categories) && t.categories.some(
            (c) => c._id === urlCategoryParam || c.slug === urlCategoryParam
          );
          if (!matchCat) return false;
        }

        return true;
      });

      setTalents(filtered);
    } catch (err) {
      console.error("Failed to fetch search results:", err);
      setTalents([]);
    } finally {
      setLoading(false);
    }
  }, [urlSearchParam, urlCategoryParam]);

  useEffect(() => {
    fetchTalents();
  }, [fetchTalents]);

  // Apply Sorting
  const sortedTalents = useMemo(() => {
    const list = [...talents];
    if (sortBy === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "age") {
      list.sort((a, b) => (a.age || 0) - (b.age || 0));
    } else {
      // Default newest
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return list;
  }, [talents, sortBy]);

  // Handle Form Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (searchQuery.trim()) newParams.search = searchQuery.trim();
    if (selectedCategory) newParams.categories = selectedCategory;

    setSearchParams(newParams);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSearchParams({});
  };

  // Active Category Name
  const activeCategoryObj = categories.find((c) => c._id === urlCategoryParam);

  return (
    <div className=" min-h-screen pb-20">

      {/* Main Search Controls Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 p-3 sm:p-4 flex flex-col md:flex-row items-center gap-3"
        >
          {/* Search Query Input */}
          <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 w-full focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
            <FiSearch size={19} className="text-blue-600 shrink-0" />
            <input
              type="text"
              placeholder="Search by name, role, skill, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Category Select Dropdown */}
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 w-full md:w-64 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
            <FiGrid size={19} className="text-blue-600 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-700 outline-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 text-sm transition cursor-pointer"
          >
            <FiSearch size={16} />
            Search
          </button>
        </form>
      </div>

      {/* Results Filter Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">

          {/* Filter Summary */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-bold text-slate-900">
              {loading ? "Searching..." : `${sortedTalents.length} Talents Found`}
            </span>

            {(urlSearchParam || urlCategoryParam) && (
              <div className="flex flex-wrap items-center gap-2 ml-2">
                {urlSearchParam && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 font-medium text-xs rounded-full border border-blue-100">
                    Searched Term: "{urlSearchParam}"
                    <button
                      onClick={() => {
                        const p = {};
                        if (urlCategoryParam) p.categories = urlCategoryParam;
                        setSearchParams(p);
                      }}
                      className="hover:text-blue-900"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}

                {activeCategoryObj && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 font-medium text-xs rounded-full border border-indigo-100">
                    Category: {activeCategoryObj.name}
                    <button
                      onClick={() => {
                        const p = {};
                        if (urlSearchParam) p.search = urlSearchParam;
                        setSearchParams(p);
                      }}
                      className="hover:text-indigo-900"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}

                <button
                  onClick={handleClearFilters}
                  className="text-xs text-rose-600 font-semibold hover:underline ml-1"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* View Controls & Sort */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-700 outline-none cursor-pointer"
            >
              <option value="newest">Sort by Newest</option>
              <option value="name">Sort by Name</option>
              <option value="age">Sort by Age</option>
            </select>

            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition ${viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
                  }`}
                title="Grid View"
              >
                <FiGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition ${viewMode === "list"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
                  }`}
                title="List View"
              >
                <FiList size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Content */}
        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <TalentCardSkeleton key={i} />
                ))}
            </div>
          ) : sortedTalents.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-2xs max-w-lg mx-auto my-8">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No Talents Match Your Search
              </h3>
              <p className="text-slate-500 text-sm mb-6">
                We couldn't find any profiles matching your search parameters. Try clearing filters or searching another keyword.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedTalents.map((t) => (
                <TalentCard key={t._id} talent={t} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {sortedTalents.map((t) => (
                <div
                  key={t._id}
                  onClick={() => navigate(`/talents/${t._id}`)}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row items-center gap-5 cursor-pointer group"
                >
                  {/* Profile Image */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative">
                    <img
                      src={t.profileImage?.url}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          t.name || "Talent"
                        )}&background=2C78FF&color=fff&size=200`;
                      }}
                    />
                    {t.c_id && (
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-slate-900/90 text-white text-[10px] font-bold rounded">
                        ID: {t.c_id}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      {t.recommendTalent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-full border border-amber-200">
                          <FaWandMagicSparkles size={11} className="text-amber-500" />
                          Recommended
                        </span>
                      )}
                      {t.categories?.map((cat) => (
                        <span
                          key={cat._id || cat.name}
                          className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded-full border border-blue-100"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {t.name}
                      </h3>
                      <HiCheckBadge className="text-blue-500 shrink-0" size={20} />
                    </div>

                    <p className="text-xs text-slate-500">
                      {t.age ? `${t.age} Years Old` : ""}
                      {t.height ? ` • Height: ${t.height}` : ""}
                    </p>

                    {t.works?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {t.works.map((w, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-md"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action CTA */}
                  <div className="shrink-0 w-full sm:w-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/talents/${t._id}`);
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      View Profile
                      <FiArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchedPage;
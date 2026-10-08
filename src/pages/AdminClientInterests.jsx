
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
    FiSearch,
    FiFilter,
    FiX,
    FiUsers,
    FiMail,
    FiPhone,
    FiBriefcase,
    FiStar,
    FiCalendar,
    FiUser,
} from "react-icons/fi";
import { clientInterestUrl, apiClient } from "../config/config";
import { FaUser } from "react-icons/fa";

const AdminClientInterest = () => {
    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    /* -------- Fetch Interests -------- */
    const fetchInterests = async () => {
        try {
            setLoading(true);

            const res = await apiClient.get(
                clientInterestUrl.getAll
            );

            const list = res.data.interests || [];
            setInterests(list);
        } catch (err) {
            console.error(
                "Failed to fetch client interests:",
                err
            );

            toast.error(
                err?.response?.data?.message ||
                    "Failed to load client interests"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterests();
    }, []);

    const totalInterests = interests.length;

    const filteredInterests = useMemo(() => {
        const q = search.trim().toLowerCase();

        if (!q) return interests;

        return interests.filter((interest) => {
            const client = interest.client || {};
            const talent = interest.talent || {};
            const category =
                talent.categories?.[0]?.name || "";

            return (
                (client.name || "")
                    .toLowerCase()
                    .includes(q) ||
                (client.companyName || "")
                    .toLowerCase()
                    .includes(q) ||
                (client.email || "")
                    .toLowerCase()
                    .includes(q) ||
                (client.phone || "")
                    .toString()
                    .toLowerCase()
                    .includes(q) ||
                (talent.name || "")
                    .toLowerCase()
                    .includes(q) ||
                (talent.email || "")
                    .toLowerCase()
                    .includes(q) ||
                (talent.phone || "")
                    .toString()
                    .toLowerCase()
                    .includes(q) ||
                category
                    .toLowerCase()
                    .includes(q) ||
                (interest.status || "")
                    .toLowerCase()
                    .includes(q)
            );
        });
    }, [interests, search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const totalFiltered = filteredInterests.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / itemsPerPage));
    const validCurrentPage = Math.min(currentPage, totalPages);

    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalFiltered);
    const paginatedInterests = useMemo(() => {
        return filteredInterests.slice(startIndex, endIndex);
    }, [filteredInterests, startIndex, endIndex]);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-blue-50/40 px-6 py-8 lg:px-10 lg:py-10">
            <div className="max-w-[1400px] mx-auto">

                {/* ---------- HEADER ---------- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">
                            Client Interests
                        </h1>
                    </div>
                </div>

                {/* ---------- FILTERS ---------- */}
                <div className="bg-white/80 backdrop-blur rounded-3xl border border-white shadow-xl shadow-slate-200/60 p-5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">

                        {/* Search */}
                        <div className="relative">
                            <FiSearch
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search client interests..."
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                            />
                        </div>

                        {/* Items per page dropdown */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="items-per-page-interest" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                                Show:
                            </label>
                            <select
                                id="items-per-page-interest"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="px-3.5 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all cursor-pointer font-medium"
                            >
                                <option value={10}>10 per page</option>
                                <option value={25}>25 per page</option>
                                <option value={50}>50 per page</option>
                                <option value={100}>100 per page</option>
                            </select>
                        </div>
                    </div>

                    {/* Result strip */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {totalFiltered === 0 ? 0 : startIndex + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold text-slate-700">
                                {endIndex}
                            </span>{" "}
                            of {totalFiltered} interest
                            {totalFiltered === 1
                                ? ""
                                : "s"}
                        </span>

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                            >
                                <FiX size={11} />
                                Clear search
                            </button>
                        )}
                    </div>
                </div>

                {/* ---------- TABLE CARD ---------- */}
                <div className="bg-white/80 backdrop-blur rounded-[28px] border border-white shadow-2xl shadow-slate-200/60 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-center text-xs uppercase tracking-wider">

                                    <th className="text-left pl-8 pr-6 py-5 font-semibold">
                                        #
                                    </th>

                                    <th className="text-left px-6 py-5 font-semibold">
                                        Client
                                    </th>

                                    <th className="text-left px-6 py-5 font-semibold">
                                        Talent
                                    </th>

                                    <th className="text-left px-6 py-5 font-semibold">
                                        Contact
                                    </th>

                                    <th className="text-left px-6 py-5 font-semibold">
                                        Category
                                    </th>

                                    <th className="text-left px-6 py-5 font-semibold">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    Array.from({ length: 5 }).map(
                                        (_, i) => (
                                            <SkeletonRow key={i} />
                                        )
                                    )
                                ) : paginatedInterests.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-8 py-20 text-center"
                                        >
                                            <div className="mx-auto w-20 h-20 rounded-3xl bg-linear-to-br from-slate-100 to-blue-50 flex items-center justify-center text-slate-400 mb-4">
                                                <FiStar size={30} />
                                            </div>

                                            <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                                No client interests found
                                            </h3>

                                            <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                                {search
                                                    ? "Try adjusting your search."
                                                    : "No client interests have been recorded yet."}
                                            </p>

                                            {search && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSearch("")
                                                    }
                                                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-400 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all cursor-pointer"
                                                >
                                                    <FiX size={14} />
                                                    Clear Search
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedInterests.map(
                                        (interest, index) => (
                                            <InterestRow
                                                key={interest._id}
                                                index={startIndex + index}
                                                interest={interest}
                                            />
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ---------- PAGINATION FOOTER ---------- */}
                    {totalFiltered > 0 && (
                        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-xs text-slate-500">
                                Page <span className="font-semibold text-slate-700">{validCurrentPage}</span> of{" "}
                                <span className="font-semibold text-slate-700">{totalPages}</span> ({totalFiltered} total items)
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={validCurrentPage === 1}
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
                                >
                                    Previous
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - validCurrentPage) <= 1)
                                        .map((p, i, arr) => (
                                            <div key={p} className="flex items-center">
                                                {i > 0 && arr[i - 1] !== p - 1 && (
                                                    <span className="px-1 text-slate-400 text-xs">...</span>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentPage(p)}
                                                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${validCurrentPage === p
                                                        ? "bg-blue-600 text-white shadow-sm"
                                                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            </div>
                                        ))}
                                </div>

                                <button
                                    type="button"
                                    disabled={validCurrentPage >= totalPages}
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ============ Interest Row ============ */

const InterestRow = ({ index, interest }) => {
    const client = interest.client || {};
    const talent = interest.talent || {};

    const category =
        talent.categories?.[0]?.name || "Talent";

    const createdDate = interest.createdAt
        ? new Date(
              interest.createdAt
          ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "—";

    return (
        <tr className="group hover:bg-indigo-50/30 transition-colors">

            {/* Number */}
            <td className="pl-8 pr-6 py-5">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
                    {String(index + 1).padStart(2, "0")}
                </span>
            </td>

            {/* Client */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 shrink-0">
                        <FaUser  size={16} />
                    </div>

                    <div className="min-w-0">
                        <p className="font-semibold text-slate-800 leading-tight truncate max-w-[190px]">
                            {client.name || "—"}
                        </p>

                        <div className="flex items-center gap-1.5 mt-1">
                            <FiBriefcase
                                size={11}
                                className="text-slate-400 shrink-0"
                            />

                            <span className="text-xs text-slate-400 truncate max-w-[180px]">
                                {client.companyName || "—"}
                            </span>
                        </div>
                    </div>
                </div>
            </td>

            {/* Talent */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-3">

                    {talent.profileImage?.url ? (
                        <img
                            src={talent.profileImage.url}
                            alt={talent.name || "Talent"}
                            className="w-10 h-10 rounded-xl object-cover shadow-md border border-slate-100"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-400 to-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                            <FiUser size={16} />
                        </div>
                    )}

                    <div className="min-w-0">
                        <p className="font-semibold text-slate-800 leading-tight truncate max-w-[180px]">
                            {talent.name || "—"}
                        </p>

                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs text-slate-400">
                                {talent.c_id || "—"}
                            </span>
                        </div>
                    </div>
                </div>
            </td>

            {/* Contact */}
            <td className="px-6 py-5">
                <div className="space-y-1.5">

                    <div className="flex items-center gap-2">
                        <FiMail
                            size={12}
                            className="text-slate-400 shrink-0"
                        />

                        <span className="text-xs text-slate-600 truncate max-w-[180px]">
                            {client.email || "—"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <FiPhone
                            size={12}
                            className="text-slate-400 shrink-0"
                        />

                        <span className="text-xs text-slate-600">
                            {client.phone || "—"}
                        </span>
                    </div>
                </div>
            </td>

            {/* Category */}
            <td className="px-6 py-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 font-medium text-xs">
                    <FiStar size={11} />
                    {category}
                </span>
            </td>


            {/* Date */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <FiCalendar
                        size={13}
                        className="text-slate-400"
                    />

                    <span className="whitespace-nowrap">
                        {createdDate}
                    </span>
                </div>
            </td>
        </tr>
    );
};

/* ============ Skeleton Row ============ */

const SkeletonRow = () => (
    <tr className="animate-pulse">

        {/* Number */}
        <td className="pl-8 pr-6 py-5">
            <div className="h-5 w-10 bg-slate-200 rounded-lg" />
        </td>

        {/* Client */}
        <td className="px-6 py-5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />

                <div>
                    <div className="h-4 w-32 bg-slate-200 rounded mb-1.5" />
                    <div className="h-3 w-36 bg-slate-100 rounded" />
                </div>
            </div>
        </td>

        {/* Talent */}
        <td className="px-6 py-5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />

                <div>
                    <div className="h-4 w-28 bg-slate-200 rounded mb-1.5" />
                    <div className="h-3 w-12 bg-slate-100 rounded" />
                </div>
            </div>
        </td>

        {/* Contact */}
        <td className="px-6 py-5">
            <div className="space-y-1.5">
                <div className="h-3 w-36 bg-slate-200 rounded" />
                <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
        </td>

        {/* Category */}
        <td className="px-6 py-5">
            <div className="h-6 w-24 bg-slate-200 rounded-lg" />
        </td>

        {/* Status */}
        <td className="px-6 py-5">
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
        </td>

        {/* Date */}
        <td className="px-6 py-5">
            <div className="h-5 w-24 bg-slate-200 rounded-lg" />
        </td>
    </tr>
);

export default AdminClientInterest;
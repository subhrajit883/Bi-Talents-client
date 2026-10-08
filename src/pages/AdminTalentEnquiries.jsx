import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
    FiSearch,
    FiX,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiGrid,
    FiMessageCircle,
    FiEye,
    FiTrash2,
    FiCheckCircle,
    FiTag,
} from "react-icons/fi";
import { talentEnquiryUrl, apiClient } from "../config/config";
import DeleteModal from "../components/common/DeleteModal";

const AdminTalentEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [enquiryToDelete, setEnquiryToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    /* -------- Fetch Enquiries -------- */
    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(talentEnquiryUrl.getAll);
            const list = res.data?.enquiries || res.data?.data || [];
            setEnquiries(list);
        } catch (err) {
            console.error("Failed to fetch talent enquiries:", err);
            const message = err?.response?.data?.message || "Failed to load talent enquiries";
            toast.error(message);

            // Check for invalid or expired token
            if (
                err?.response?.status === 401 ||
                err?.response?.status === 403 ||
                message.toLowerCase().includes("invalid or expired token")
            ) {
                localStorage.removeItem("token");
                window.location.href = "/adminlogin";
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const totalEnquiries = enquiries.length;

    const filteredEnquiries = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return enquiries;

        return enquiries.filter((item) => {
            const catName = typeof item.interestedInCategory === "object"
                ? item.interestedInCategory?.name || ""
                : "";
            const worksStr = Array.isArray(item.works) ? item.works.join(" ") : "";

            return (
                (item.fullName || "").toLowerCase().includes(q) ||
                (item.emailAddress || "").toLowerCase().includes(q) ||
                (item.contactNumber || "").toLowerCase().includes(q) ||
                (item.address || "").toLowerCase().includes(q) ||
                (item.gender || "").toLowerCase().includes(q) ||
                catName.toLowerCase().includes(q) ||
                worksStr.toLowerCase().includes(q)
            );
        });
    }, [enquiries, search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const totalFiltered = filteredEnquiries.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / itemsPerPage));
    const validCurrentPage = Math.min(currentPage, totalPages);

    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalFiltered);
    const paginatedEnquiries = useMemo(() => {
        return filteredEnquiries.slice(startIndex, endIndex);
    }, [filteredEnquiries, startIndex, endIndex]);

    /* -------- Delete Handler -------- */
    const handleDeleteClick = (enquiry) => {
        setEnquiryToDelete(enquiry);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!enquiryToDelete?._id) return;
        try {
            setDeleting(true);
            await apiClient.delete(`${talentEnquiryUrl.delete}${enquiryToDelete._id}`);
            toast.success("Enquiry deleted successfully");
            setEnquiries((prev) => prev.filter((e) => e._id !== enquiryToDelete._id));
            setDeleteModalOpen(false);
            setEnquiryToDelete(null);
            if (selectedEnquiry?._id === enquiryToDelete._id) {
                setSelectedEnquiry(null);
            }
        } catch (err) {
            console.error("Failed to delete enquiry:", err);
            toast.error(err?.response?.data?.message || "Failed to delete enquiry");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-blue-50/40 px-6 py-8 lg:px-10 lg:py-10">
            <div className="max-w-[1400px] mx-auto">

                {/* ---------- HEADER ---------- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                            Talent Enquiries
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Review and manage talent submission enquiries from prospective candidates.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                <FiMessageCircle size={18} />
                            </div>
                            <div>
                                <span className="block text-xs font-semibold text-slate-400 uppercase">Total Enquiries</span>
                                <span className="text-lg font-bold text-slate-800">{totalEnquiries}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------- SEARCH & FILTERS ---------- */}
                <div className="bg-white/80 backdrop-blur rounded-3xl border border-white shadow-xl shadow-slate-200/60 p-5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
                        <div className="relative">
                            <FiSearch
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search candidate name, email, contact, category, works..."
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                            />
                        </div>

                        {/* Items per page dropdown */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="items-per-page-enquiry" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                                Show:
                            </label>
                            <select
                                id="items-per-page-enquiry"
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

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>
                            Showing <span className="font-semibold text-slate-700">{totalFiltered === 0 ? 0 : startIndex + 1}</span> to{" "}
                            <span className="font-semibold text-slate-700">{endIndex}</span> of{" "}
                            <span className="font-semibold text-slate-700">{totalFiltered}</span> enquiry{totalFiltered === 1 ? "" : "ies"}
                        </span>
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                            >
                                <FiX size={12} />
                                Clear search
                            </button>
                        )}
                    </div>
                </div>

                {/* ---------- TABLE CONTAINER ---------- */}
                <div className="bg-white/80 backdrop-blur rounded-[28px] border border-white shadow-2xl shadow-slate-200/60 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50 border-b border-slate-100">
                                    <th className="pl-8 pr-4 py-5 font-semibold">#</th>
                                    <th className="px-6 py-5 font-semibold">Candidate Name</th>
                                    <th className="px-6 py-5 font-semibold">Contact Info</th>
                                    <th className="px-6 py-5 font-semibold">Gender & DOB</th>
                                    <th className="px-6 py-5 font-semibold">Interested Category</th>
                                    <th className="px-6 py-5 font-semibold">Works / Portfolio</th>
                                    <th className="px-6 py-5 font-semibold">Date</th>
                                    <th className="px-6 py-5 font-semibold text-right pr-8">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <SkeletonRow key={i} />
                                    ))
                                ) : paginatedEnquiries.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-8 py-20 text-center">
                                            <div className="mx-auto w-20 h-20 rounded-3xl bg-linear-to-br from-slate-100 to-blue-50 flex items-center justify-center text-slate-400 mb-4">
                                                <FiMessageCircle size={30} />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                                No enquiries found
                                            </h3>
                                            <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                                {search
                                                    ? "Try adjusting your search query."
                                                    : "No talent enquiries have been submitted yet."}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedEnquiries.map((enquiry, index) => (
                                        <EnquiryRow
                                            key={enquiry._id || index}
                                            index={startIndex + index}
                                            enquiry={enquiry}
                                            onViewDetail={() => setSelectedEnquiry(enquiry)}
                                            onDelete={() => handleDeleteClick(enquiry)}
                                        />
                                    ))
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

            {/* ---------- DETAILS MODAL ---------- */}
            {selectedEnquiry && (
                <DetailsModal
                    enquiry={selectedEnquiry}
                    onClose={() => setSelectedEnquiry(null)}
                />
            )}

            {/* ---------- DELETE MODAL ---------- */}
            {deleteModalOpen && (
                <DeleteModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    loading={deleting}
                    title="Delete Talent Enquiry"
                    description={`Are you sure you want to delete the enquiry from "${enquiryToDelete?.fullName}"? This action cannot be undone.`}
                />
            )}
        </div>
    );
};

/* ============ Enquiry Row Component ============ */
const EnquiryRow = ({ index, enquiry, onViewDetail, onDelete }) => {
    const categoryName =
        typeof enquiry.interestedInCategory === "object"
            ? enquiry.interestedInCategory?.name || "N/A"
            : "N/A";

    const formattedDob = enquiry.dateOfBirth
        ? new Date(enquiry.dateOfBirth).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "—";

    const createdDate = enquiry.createdAt
        ? new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "—";

    const worksList = Array.isArray(enquiry.works) ? enquiry.works : [];

    return (
        <tr className="group hover:bg-blue-50/30 transition-colors">
            {/* Index */}
            <td className="pl-8 pr-4 py-5">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
                    {String(index + 1).padStart(2, "0")}
                </span>
            </td>

            {/* Candidate Name */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                    {/* <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 shrink-0">
                        {enquiry.fullName?.charAt(0).toUpperCase() || <FiUser />}
                    </div> */}
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 leading-tight truncate max-w-[180px]">
                            {enquiry.fullName || "—"}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-[180px] mt-0.5">
                            {enquiry.address || "—"}
                        </p>
                    </div>
                </div>
            </td>

            {/* Contact Info */}
            <td className="px-6 py-5">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <FiMail size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{enquiry.emailAddress || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <FiPhone size={13} className="text-slate-400 shrink-0" />
                        <span>{enquiry.contactNumber || "—"}</span>
                    </div>
                </div>
            </td>

            {/* Gender & DOB */}
            <td className="px-6 py-5">
                <div className="space-y-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {enquiry.gender || "Not specified"}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <FiCalendar size={12} className="text-slate-400" />
                        <span>DOB: {formattedDob}</span>
                    </div>
                </div>
            </td>

            {/* Interested Category */}
            <td className="px-6 py-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-100">
                    <FiGrid size={12} />
                    {categoryName}
                </span>
            </td>

            {/* Works */}
            <td className="px-6 py-5">
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {worksList.slice(0, 2).map((w, i) => (
                        <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200 truncate max-w-[120px]"
                        >
                            {w}
                        </span>
                    ))}
                    {worksList.length > 2 && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-semibold">
                            +{worksList.length - 2} more
                        </span>
                    )}
                </div>
            </td>

            {/* Date */}
            <td className="px-6 py-5 text-xs text-slate-600 whitespace-nowrap">
                {createdDate}
            </td>

            {/* Actions */}
            <td className="px-6 py-5 text-right pr-8">
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onViewDetail}
                        className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all"
                        title="View Enquiry Details"
                    >
                        <FiEye size={17} />
                    </button>
                    {/* <button
                        type="button"
                        onClick={onDelete}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                        title="Delete Enquiry"
                    >
                        <FiTrash2 size={17} />
                    </button> */}
                </div>
            </td>
        </tr>
    );
};

/* ============ Details Modal Component ============ */
const DetailsModal = ({ enquiry, onClose }) => {
    const categoryName =
        typeof enquiry.interestedInCategory === "object"
            ? enquiry.interestedInCategory?.name || "N/A"
            : "N/A";

    const formattedDob = enquiry.dateOfBirth
        ? new Date(enquiry.dateOfBirth).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
        : "—";

    const createdDate = enquiry.createdAt
        ? new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "—";

    const worksList = Array.isArray(enquiry.works) ? enquiry.works : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">

                {/* Header */}
                <div className="px-8 py-6 bg-linear-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-xl border border-white/20">
                            {enquiry.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{enquiry.fullName}</h2>
                            <p className="text-xs text-blue-100">Talent Enquiry Submission</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">

                    {/* Primary Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                Interested Category
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600">
                                <FiGrid size={15} />
                                {categoryName}
                            </span>
                        </div>

                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                Gender & DOB
                            </span>
                            <p className="text-sm font-semibold text-slate-800">
                                {enquiry.gender || "—"} ({formattedDob})
                            </p>
                        </div>

                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                Email Address
                            </span>
                            <a href={`mailto:${enquiry.emailAddress}`} className="text-sm font-semibold text-blue-600 hover:underline">
                                {enquiry.emailAddress}
                            </a>
                        </div>

                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                Contact Number
                            </span>
                            <a href={`tel:${enquiry.contactNumber}`} className="text-sm font-semibold text-slate-800 hover:text-blue-600">
                                {enquiry.contactNumber}
                            </a>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                            Address / Location
                        </span>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                            <FiMapPin className="text-blue-500 shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                {enquiry.address || "No address provided."}
                            </p>
                        </div>
                    </div>

                    {/* Works List */}
                    <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                            Works & Portfolio Interests ({worksList.length})
                        </span>

                        <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            {worksList.length > 0 ? (
                                worksList.map((w, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-semibold shadow-xs border border-slate-200"
                                    >
                                        <FiTag className="text-blue-500" size={12} />
                                        {w}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-slate-400">
                                    No works specified.
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Portfolio Links */}
                    {(enquiry.driveLink || enquiry.youtubeLink) && (
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                                Portfolio Links
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Google Drive */}
                                {enquiry.driveLink && (
                                    <a
                                        href={enquiry.driveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <path
                                                    d="M8.5 3L3 12.5L8.5 22H15L20.5 12.5L15 3H8.5Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M8.5 3L12 9H20.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M3 12.5H10L15 22"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-slate-800">
                                                Google Drive
                                            </p>
                                            <p className="text-[11px] text-slate-500 truncate">
                                                Open portfolio folder
                                            </p>
                                        </div>

                                        <span className="text-blue-500 text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                                            ↗
                                        </span>
                                    </a>
                                )}

                                {/* YouTube */}
                                {enquiry.youtubeLink && (
                                    <a
                                        href={enquiry.youtubeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 hover:bg-red-50/50 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.8 31.8 0 0 0 0 12a31.8 31.8 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.8 31.8 0 0 0 24 12a31.8 31.8 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.8 3.9-6.8 3.9Z" />
                                            </svg>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-slate-800">
                                                YouTube
                                            </p>
                                            <p className="text-[11px] text-slate-500 truncate">
                                                Watch portfolio video
                                            </p>
                                        </div>

                                        <span className="text-red-500 text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                                            ↗
                                        </span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}



                    {/* Submission Meta */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>Submitted on: <strong className="text-slate-600">{createdDate}</strong></span>
                        {/* <span>Enquiry ID: <strong className="font-mono text-slate-600">{enquiry._id}</strong></span> */}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl cursor-pointer bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ============ Skeleton Row Component ============ */
const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="pl-8 pr-4 py-5"><div className="h-5 w-8 bg-slate-200 rounded" /></td>
        <td className="px-6 py-5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div>
                    <div className="h-4 w-32 bg-slate-200 rounded mb-1.5" />
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                </div>
            </div>
        </td>
        <td className="px-6 py-5">
            <div className="h-4 w-36 bg-slate-200 rounded mb-1.5" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
        </td>
        <td className="px-6 py-5"><div className="h-5 w-20 bg-slate-200 rounded-full" /></td>
        <td className="px-6 py-5"><div className="h-6 w-24 bg-slate-200 rounded-xl" /></td>
        <td className="px-6 py-5"><div className="h-5 w-32 bg-slate-200 rounded" /></td>
        <td className="px-6 py-5"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
        <td className="px-6 py-5 text-right pr-8"><div className="h-8 w-16 bg-slate-200 rounded-xl inline-block" /></td>
    </tr>
);

export default AdminTalentEnquiries;

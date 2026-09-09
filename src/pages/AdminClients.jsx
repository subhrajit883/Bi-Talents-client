
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
    FiSearch,
    FiFilter,
    FiX,
    FiUsers,
    FiMail,
    FiPhone,
    FiMapPin,
    FiBriefcase,
} from "react-icons/fi";
import { clientUrl, apiClient } from "../config/config";
import { FaUserAlt } from "react-icons/fa";

const AdminClient = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    /* -------- Fetch Clients -------- */
    const fetchClients = async () => {
        try {
            setLoading(true);

            const res = await apiClient.get(clientUrl.getAll);

            const list = res.data.clients || [];
            setClients(list);
        } catch (err) {
            console.error("Failed to fetch clients:", err);

            toast.error(
                err?.response?.data?.message ||
                    "Failed to load clients"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    /* -------- Derived -------- */
    const totalClients = clients.length;

    const filteredClients = useMemo(() => {
        const q = search.trim().toLowerCase();

        if (!q) return clients;

        return clients.filter((client) => {
            return (
                (client.companyName || "")
                    .toLowerCase()
                    .includes(q) ||
                (client.name || "")
                    .toLowerCase()
                    .includes(q) ||
                (client.email || "")
                    .toLowerCase()
                    .includes(q) ||
                (client.phone || "")
                    .toLowerCase()
                    .includes(q) ||
                (client.address || "")
                    .toLowerCase()
                    .includes(q)
            );
        });
    }, [clients, search]);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-blue-50/40 px-6 py-8 lg:px-10 lg:py-10">
            <div className="max-w-[1400px] mx-auto">

                {/* ---------- HEADER ---------- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        {/* <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-700 text-xs font-semibold border border-blue-200/50">
                                <FaUserAlt size={12} />
                                Client Manager
                            </span>
                        </div> */}

                         <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">
                            All Clients
                        </h1>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur rounded-3xl border border-white shadow-xl shadow-slate-200/60 p-5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">

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
                                placeholder="Search clients..."
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                            />
                        </div>

                        {/* Refresh */}
                        {/* <button
                            type="button"
                            onClick={fetchClients}
                            className="h-[50px] px-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 text-slate-500 hover:text-blue-600 flex items-center justify-center transition-all shadow-sm"
                            title="Refresh"
                        >
                            <FiFilter size={17} />
                        </button> */}
                    </div>

                    {/* Result strip */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {filteredClients.length}
                            </span>{" "}
                            of {totalClients} client
                            {totalClients === 1 ? "" : "s"}
                        </span>

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
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
                                        Company
                                    </th>

                                    <th className="text-left px-6 py-5 font-semibold">
                                        Contact
                                    </th>

                                    <th className="text-left px-6 py-5 font-semibold">
                                        Address
                                    </th>

                                    <th className="text-left px-6 py-5 font-semibold">
                                        Status
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
                                ) : filteredClients.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-8 py-20 text-center"
                                        >
                                            <div className="mx-auto w-20 h-20 rounded-3xl bg-linear-to-br from-slate-100 to-blue-50 flex items-center justify-center text-slate-400 mb-4">
                                                <FaUserAlt size={30} />
                                            </div>

                                            <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                                No clients found
                                            </h3>

                                            <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                                {search
                                                    ? "Try adjusting your search."
                                                    : "No clients have been registered yet."}
                                            </p>

                                            {search && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSearch("")
                                                    }
                                                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-400 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
                                                >
                                                    <FiX size={14} />
                                                    Clear Search
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredClients.map(
                                        (client, index) => (
                                            <ClientRow
                                                key={client._id}
                                                index={index}
                                                client={client}
                                            />
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ============ Client Row ============ */

const ClientRow = ({ index, client }) => {
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

                    <div>
                        <p className="font-semibold text-slate-800 leading-tight">
                            {client.name || "—"}
                        </p>

                        <div className="flex items-center gap-1.5 mt-1">
                            <FiMail
                                size={11}
                                className="text-slate-400"
                            />

                            <span className="text-xs text-slate-400">
                                {client.email || "—"}
                            </span>
                        </div>
                    </div>
                </div>
            </td>

            {/* Company */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FiBriefcase size={14} />
                    </div>

                    <span className="font-medium text-slate-700">
                        {client.companyName || "—"}
                    </span>
                </div>
            </td>

            {/* Contact */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                    <FiPhone
                        size={13}
                        className="text-slate-400"
                    />

                    <span className="text-sm text-slate-600">
                        {client.phone || "—"}
                    </span>
                </div>
            </td>

            {/* Address */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-2 max-w-[220px]">
                    <FiMapPin
                        size={13}
                        className="text-slate-400 shrink-0"
                    />

                    <span className="text-sm text-slate-600 truncate">
                        {client.address || "—"}
                    </span>
                </div>
            </td>

            {/* Status */}
            <td className="px-6 py-5">
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium text-xs ${
                        client.isActive
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                            : "bg-slate-50 border-slate-100 text-slate-500"
                    }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            client.isActive
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                        }`}
                    />

                    {client.isActive
                        ? "Active"
                        : "Inactive"}
                </span>
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
                    <div className="h-3 w-40 bg-slate-100 rounded" />
                </div>
            </div>
        </td>

        {/* Company */}
        <td className="px-6 py-5">
            <div className="h-5 w-36 bg-slate-200 rounded-lg" />
        </td>

        {/* Contact */}
        <td className="px-6 py-5">
            <div className="h-5 w-28 bg-slate-200 rounded-lg" />
        </td>

        {/* Address */}
        <td className="px-6 py-5">
            <div className="h-5 w-32 bg-slate-200 rounded-lg" />
        </td>

        {/* Status */}
        <td className="px-6 py-5">
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
        </td>
    </tr>
);

export default AdminClient;
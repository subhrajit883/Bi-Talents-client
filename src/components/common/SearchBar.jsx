import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex w-full items-center">
            <input
                type="text"
                placeholder="Search News..."
                className="w-full rounded-lg border border-r-0 p-3 outline-none focus:ring-1 focus:ring-red-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
                type="submit"
                className="cursor-pointer rounded-r bg-blue-600 px-3 py-3 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                <IoSearch />
            </button>
        </form>
    );
};

export default SearchBar;
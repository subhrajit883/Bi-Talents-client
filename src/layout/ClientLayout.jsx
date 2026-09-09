import { Outlet } from "react-router-dom";
import ClientSidebar from "../components/client/ClientSidebar";

const ClientLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <ClientSidebar />
            <main className="flex-1 min-h-screen overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default ClientLayout;

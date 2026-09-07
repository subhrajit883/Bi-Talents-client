import { Outlet } from "react-router-dom";

// import Topbar from "../components/common/Topbar";
import Navbar from "../components/common/Navbar";
// import Footer from "../components/common/Footer";

const MainLayout = () => {
    return (
        <>
            {/* <Topbar />*/}
            <Navbar />

            <main className="mb-0">
                <Outlet />
            </main>

            {/* <Footer /> */}
        </>
    );
};

export default MainLayout;
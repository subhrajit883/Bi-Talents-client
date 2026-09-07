import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import HomePage from "../pages/HomePage";
import MainLayout from "../layout/MainLayout";
import TalentDetails from "../pages/TalentDetails";
import CategoryPage from "../pages/CategoryPage";
import AdminLayout from "../layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/AdminDashboard";
import AdminTalent from "../pages/AdminTalent";
import AdminLogin from "../pages/AdminLogin";
import AdminAllTalents from "../pages/AdminAllTalents";


const AppRoute = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/talents/:id" element={<TalentDetails />} />
                    <Route path="/category/:id" element={<CategoryPage />} />
                </Route>
                <Route path="/login" element={<AdminLogin />} />

                <Route element={<AdminLayout />}>
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/candidates"
                        element={
                            <ProtectedRoute>
                                <AdminTalent />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/allcandidates"
                        element={
                            <ProtectedRoute>
                                <AdminAllTalents />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* <Route
                    path="/admin/news"
                    element={
                        <ProtectedRoute>
                            <NewsPost />
                        </ProtectedRoute>
                    }
                /> */}


                {/* <Route path="*" element={<NotFound />} /> */}

            </Routes>

        </BrowserRouter>
    );
};

export default AppRoute;
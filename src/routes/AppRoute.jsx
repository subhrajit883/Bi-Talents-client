import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
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
import AdminCategory from "../pages/AdminCategory";
import AdminClients from "../pages/AdminClients";
import AdminClientInterests from "../pages/AdminClientInterests";
import ClientLayout from "../layout/ClientLayout";
import ClientDashboard from "../pages/ClientDashboard";
import NotFound from "../pages/NotFound";
import ClientProtectedRoute from "./ClientProtectedRoute";
import ClientInterests from "../pages/ClientInterests";
import SearchedPage from "../pages/SearchedPage";


const AppRoute = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/talents/:id" element={<TalentDetails />} />
                    <Route path="/category/:id" element={<CategoryPage />} />
                    <Route path="/search" element={<SearchedPage />} />
                </Route>
                <Route path="/adminlogin" element={<AdminLogin />} />

                <Route element={<AdminLayout />}>
                    <Route
                        path="/admin"
                        element={<Navigate to="/admin/dashboard" replace />}
                    />
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
                    <Route
                        path="/admin/categories"
                        element={
                            <ProtectedRoute>
                                <AdminCategory />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/clients"
                        element={
                            <ProtectedRoute>
                                <AdminClients />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/client-interests"
                        element={
                            <ProtectedRoute>
                                <AdminClientInterests />
                            </ProtectedRoute>
                        }
                    />
                </Route>

       <Route path="/login" element={<AdminLogin />} />
                <Route element={<ClientLayout />}>
                    <Route path="/client/dashboard" element={
                        <ClientProtectedRoute>
                            <ClientDashboard />
                        </ClientProtectedRoute>
                    } />
                    <Route path="/client/interests" element={
                        <ClientProtectedRoute>
                            <ClientInterests />
                        </ClientProtectedRoute>
                    } />
                </Route>

                {/* <Route path="/*" element={<NotFound />} /> */}
                {/* <Route
                    path="/admin/news"
                    element={
                        <ProtectedRoute>
                            <NewsPost />
                        </ProtectedRoute>
                    } /> */}

                <Route path="*" element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoute;
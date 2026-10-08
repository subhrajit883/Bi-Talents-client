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
import ClientRegister from "../pages/ClientRegister";
import ClientLogin from "../pages/ClientLogin";
import AboutPage from "../pages/AboutPage";
import TalentEnquiryForm from "../pages/TalentEnquiryForm";
import AdminTalentEnquiries from "../pages/AdminTalentEnquiries";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";


const AppRoute = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/talents/:id" element={<TalentDetails />} />
                    <Route path="/category/:id" element={<CategoryPage />} />
                    <Route path="/search" element={<SearchedPage />} />
                    <Route path="/register" element={<ClientRegister />} />
                    <Route path="/login" element={<ClientLogin />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/talent-enquiry" element={<TalentEnquiryForm />} />
                </Route>
                <Route path="/adminlogin" element={<AdminLogin />} />


                <Route element={<AdminLayout />}>
                    <Route
                        path="/admin"
                        element={<Navigate to="/admin/allcandidates" replace />}
                    />
                    {/* <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    /> */}
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
                    <Route
                        path="/admin/talent-enquiries"
                        element={
                            <ProtectedRoute>
                                <AdminTalentEnquiries />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* <Route path="/login" element={<AdminLogin />} /> */}
                <Route element={<ClientLayout />}>
                    <Route path="/dashboard" element={
                        <ClientProtectedRoute>
                            <ClientDashboard />
                        </ClientProtectedRoute>
                    } />
                    <Route path="/interests" element={
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
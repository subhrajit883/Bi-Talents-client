import { Navigate } from "react-router-dom";

const ClientProtectedRoute = ({ children }) => {

    const token = localStorage.getItem("authToken");

    return token ? children : <Navigate to="/login" replace />;
};

export default ClientProtectedRoute;

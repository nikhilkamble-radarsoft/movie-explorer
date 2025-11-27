import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { localStorageTokenKey } from "../utils/constants";

export default function PrivateRoute({ children, allowedRoles }) {
  const location = useLocation();
  const token = localStorage.getItem(localStorageTokenKey);
  const dispatch = useDispatch();
  const isAuthenticated = !!token;
  const { user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    dispatch(logout());
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length) {
    const userRole = user?.role;
    const isAllowed = userRole && allowedRoles.includes(userRole);
    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}

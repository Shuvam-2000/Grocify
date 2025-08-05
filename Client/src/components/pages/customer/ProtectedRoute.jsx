import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);

  if (!user) {
    toast.error("You need to login first", { id: "protected-route" });
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

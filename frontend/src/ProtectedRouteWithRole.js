import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import PropTypes from "prop-types";

const ProtectedRouteWithRole = ({ element: Component, requiredRole }) => {
  const navigate = useNavigate();
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      navigate("/authentication/sign-in");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem("jwt");
        navigate("/authentication/sign-in");
        return;
      }

      axios
        .get("/api/auth/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("User role:", res.data.role);
          if (res.data.role === requiredRole) {
            setIsAllowed(true);
          } else {
            setIsAllowed(false);
          }
        });
    } catch (err) {
      console.error("Token error:", err);
      navigate("/authentication/sign-in");
    }
  }, []);

  if (isAllowed === null) return <div>Loading...</div>;
  if (!isAllowed) return <div>Access denied</div>;

  return <Component />;
};

ProtectedRouteWithRole.propTypes = {
  element: PropTypes.elementType.isRequired,
  requiredRole: PropTypes.string.isRequired,
};

export default ProtectedRouteWithRole;

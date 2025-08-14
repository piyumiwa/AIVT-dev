import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // optional but useful

const ProtectedRouteReporter = ({ element: Component }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          navigate("/authentication/sign-in");
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/authentication/sign-in");
      }
    } else {
      setIsAuthenticated(false);
      navigate("/authentication/sign-in");
    }
  }, [navigate]);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? <Component /> : null;
};

ProtectedRouteReporter.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default ProtectedRouteReporter;

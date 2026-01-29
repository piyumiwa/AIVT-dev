import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";

const ProtectedRouteReporter = ({ element: Component }) => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    if (token) {
      // If accessing via unique token, allow access
      setIsAuthenticated(true);
      return;
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

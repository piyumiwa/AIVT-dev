import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import PropTypes from "prop-types";

const ProtectedRouteReporter = ({ element: Component }) => {
  const { isLoading, user, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !user) {
      loginWithRedirect();
    }
  }, [isLoading, user, loginWithRedirect]);

  if (isLoading) return <div>Loading...</div>;

  // Render the protected component if the user is authenticated
  return user ? <Component /> : null;
};

ProtectedRouteReporter.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default ProtectedRouteReporter;

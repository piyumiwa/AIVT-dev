import { useAuth0 } from "@auth0/auth0-react";
import Container from "@mui/material/Container";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import NavbarDark from "layouts/sections/navigation/navbars/components/NavbarDark";
import DefaultFooter from "examples/Footers/DefaultFooter";
import footerRoutes from "footer.routes";

function Licenses() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin });
    } else {
      loginWithRedirect();
    }
  };
  return (
    <>
      <NavbarDark
        transparent
        light
        onAuthClick={handleAuthClick}
        isAuthenticated={isAuthenticated}
      />
      <Container sx={{ mt: { xs: 8, md: 8 }, mb: 4 }}>
        <MKTypography variant="h3" my={1}>
          Licenses
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          Effective Date: 01.06.2025
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          This page provides information about the licenses under which the AIVT (Artificial
          Intelligence Vulnerability Taxonomy) platform operates. By using this platform, you agree
          to comply with the terms of these licenses.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          1. Open Source License
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          AIVT is released under an open-source license that allows users to access, modify, and
          distribute the source code. The specific license details can be found in the repository.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          2. Data Usage License
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          Users may submit and share vulnerability data under a data usage license that permits
          academic and research use while ensuring proper attribution and compliance with privacy
          standards.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          3. Third-Party Libraries
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          AIVT may utilize third-party libraries and tools, each governed by its own license. Users
          are responsible for reviewing and complying with these licenses when using the platform.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          4. Attribution and Credits
        </MKTypography>
      </Container>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}
export default Licenses;

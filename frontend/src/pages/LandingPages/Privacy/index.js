import { useAuth0 } from "@auth0/auth0-react";
import Container from "@mui/material/Container";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import NavbarDark from "layouts/sections/navigation/navbars/components/NavbarDark";
import DefaultFooter from "examples/Footers/DefaultFooter";
import footerRoutes from "footer.routes";

function Privacy() {
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
          Privacy Policy
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          Effective Date: 01.06.2025
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          This Privacy Policy outlines how AIVT (Artificial Intelligence Vulnerability Taxonomy)
          collects, uses, and protects your personal information when you use our platform. By
          accessing or using AIVT, you agree to the collection and use of information in accordance
          with this policy.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          1. Information Collection
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          We collect personal information that you provide directly to us when you register for an
          account, submit vulnerability data, or contact us. This may include your name, email
          address, and any other information you choose to provide.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          2. Use of Information
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          We use the collected information to operate and improve our platform, communicate with
          you, and provide support. We may also use your information for research and analysis
          purposes.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          3. Data Security
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          We implement reasonable security measures to protect your personal information from
          unauthorized access, disclosure, alteration, or destruction. However, no method of
          transmission over the internet or electronic storage is completely secure.
        </MKTypography>
      </Container>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}
export default Privacy;

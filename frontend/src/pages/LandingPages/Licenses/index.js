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
          Welcome to the Licenses and End User License Agreement (EULA) page for the Artificial
          Intelligence Vulnerability Taxonomy (AIVT) platform. By using this website or its
          services, you agree to the terms and conditions outlined here and any applicable
          third-party licenses referenced.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          1. General Terms of Use
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          AIVT is an academic and research-oriented platform. All users must agree to:
          <br />- Use the platform for lawful and ethical purposes only.
          <br />- Not misuse, redistribute, or republish any portion of the platform or its data
          without appropriate permission or citation.
          <br />- Abide by applicable copyright and intellectual property laws.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          2. Open Source License
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          AIVT is released under an open-source license that allows users to access, modify, and
          distribute the source code. The specific license details can be found in the repository.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          3. Data Usage License
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          Users may submit and share vulnerability data under a data usage license that permits
          academic and research use while ensuring proper attribution and compliance with privacy
          standards.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          4. Third-Party Libraries
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          AIVT may utilize third-party libraries and tools, each governed by its own licenses. Users
          are responsible for reviewing and complying with these licenses when using the platform. A
          list of major third-party libraries includes:
          <br />- React (MIT License): https://reactjs.org/
          <br />- Material-UI (MIT License): https://mui.com/
          <br />- Auth0 (Commercial License): https://auth0.com/
          <br />
          The design template used in this project is adapted from Creative Tim’s open-source
          templates:
          <br />- Certain visual and UI components were adapted from Creative Tim’s open-source
          templates.
          <br />- Used under the Freelancer License, which permits personal and academic use.
          <br />- Source: https://www.creative-tim.com
          <br />
          You may not redistribute or resell the template or claim Creative Tim components as your
          own design.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          4. Restrictions
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          Users are prohibited from:
          <br />- Attempt to reverse-engineer, tamper with, or disrupt the platform infrastructure.
          <br />- Use the platform or any of its content for commercial services without prior
          written approval.
          <br />- Represent AIVT or its authors in a misleading or unauthorized manner.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          5. Contact
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          For licensing questions, academic use requests, or permission inquiries, please contact:
          <br />
          Email: weebadu.arachchige@oulu.fi
          <br />
          Organization: Oulu University Secure Programming Group (OUSPG), University of Oulu,
          Finland.
        </MKTypography>
      </Container>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}
export default Licenses;

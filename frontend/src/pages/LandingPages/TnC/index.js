import { useAuth0 } from "@auth0/auth0-react";
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import NavbarDark from "layouts/sections/navigation/navbars/components/NavbarDark";
import DefaultFooter from "examples/Footers/DefaultFooter";
import footerRoutes from "footer.routes";

function Tnc() {
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
          Terms and Conditions
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          Effective Date: 01.06.2025
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          Welcome to AIVT (Artificial Intelligence Vulnerability Taxonomy), a platform designed to
          support the structured sharing, classification, and reporting of AI-specific
          vulnerabilities. By accessing or using this website, you agree to comply with and be bound
          by the following Terms and Conditions. If you do not agree with these terms, please do not
          use the platform.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          1. Use of the Platform{" "}
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          AIVT is intended for academic, research, and responsible professional use. You agree to
          use the platform only for lawful purposes and in a way that does not infringe on the
          rights of others or restrict their use of the platform.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          2. User-Submitted Content
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          Users may submit AI-related vulnerability data, descriptions, or incident reports. You
          retain ownership of your submitted content but grant AIVT a non-exclusive, royalty-free,
          worldwide license to use, store, publish, and share the content for the purposes of
          research, analysis, and public awareness. Submitted content must not contain false
          information, confidential data, or violate any third-party rights.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          3. Data Accuracy and Liability
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          While we aim to provide accurate and up-to-date information, AIVT does not guarantee the
          completeness or correctness of any data. The information on this platform is provided
          &quot;as is&quot; without warranties of any kind, either express or implied. AIVT and its
          maintainers are not liable for any direct or indirect damages resulting from the use or
          misuse of the platform or its data.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          4. Account Registration{" "}
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          Certain features may require user registration or authentication. You are responsible for
          maintaining the confidentiality of your login credentials and for all activities that
          occur under your account. AIVT reserves the right to suspend or terminate accounts found
          to be misused.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          5. Intellectual Property
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          All content on this site, including the AIVT taxonomy, logos, text, and source code,
          unless otherwise stated, is the intellectual property of the AIVT team or its contributors
          and is protected under applicable copyright laws. External libraries or UI components
          (e.g., frontend templates) are used in accordance with their respective licenses (e.g.,
          Creative Tim&apos;s open-source license).
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          6. Third-Party Links
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          The platform may contain links to third-party sites or APIs (e.g., MITRE, NVD). AIVT is
          not responsible for the content or privacy practices of those external sites.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          7. Privacy and Data Collection
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          AIVT may collect limited user data (such as email addresses or submission metadata) for
          platform functionality and research purposes. We do not sell or share personal information
          with third parties without consent. For more information, refer to our here.
          <MKTypography
            component="a"
            href="/privacy-policy"
            // target="_blank"
            rel="noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",

              "& .material-icons-round": {
                fontSize: "1.125rem",
                transform: `translateX(3px)`,
                transition: "transform 0.2s cubic-bezier(0.34, 1.61, 0.7, 1.3)",
              },

              "&:hover .material-icons-round, &:focus .material-icons-round": {
                transform: `translateX(6px)`,
              },
            }}
          >
            Privacy Policy <Icon sx={{ fontWeight: "bold" }}>arrow_forward</Icon>
          </MKTypography>
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          8. Modifications and Updates
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          AIVT reserves the right to modify these Terms at any time. Changes will be posted on this
          page with an updated effective date. Continued use of the platform after changes are made
          constitutes acceptance of the revised terms.
        </MKTypography>
        <MKTypography variant="h5" mt={2} mb={1}>
          9. Contact
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          If you have any questions about these Terms, please contact us at:{" "}
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
          Email: weebadu.arachchige@oulu.fi{" "}
        </MKTypography>
        <MKTypography variant="body2" mb={2}>
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
export default Tnc;

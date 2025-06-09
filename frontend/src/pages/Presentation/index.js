// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// import Icon from "@mui/material/Icon";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
// import MKSocialButton from "components/MKSocialButton";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
// import FilledInfoCard from "examples/Cards/InfoCards/FilledInfoCard";

// Presentation page sections
import Counters from "pages/Presentation/sections/Counters";
import Information from "pages/Presentation/sections/Information";

// Presentation page components
import LinkToDatabse from "pages/Presentation/components/LinkToDatabse";

// Routes
// import routes from "routes";
import footerRoutes from "footer.routes";

// Images
import bgImage from "assets/images/bg-presentation.jpg";

function Presentation() {
  return (
    <>
      <DefaultNavbar transparent relative />
      <MKBox
        minHeight="110vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container sx={{ mt: { xs: 8, md: 8 } }}>
          <Grid container item xs={12} lg={7} justifyContent="center" mx="auto">
            <MKTypography
              variant="h2"
              color="white"
              textAlign="center"
              mt={-6}
              mb={1}
              sx={({ breakpoints, typography: { size } }) => ({
                [breakpoints.down("md")]: {
                  fontSize: size["3xl"],
                },
              })}
            >
              AI Vulnerability Taxonomy
            </MKTypography>
            <MKTypography
              variant="body1"
              color="white"
              textAlign="center"
              // px={{ xs: 6, lg: 6 }}
              mt={1}
            >
              AIVT is a collaborative platform designed to support the structured reporting,
              classification, and sharing of vulnerabilities specific to AI systems. This platform
              enables developers, researchers, security analysts, and policymakers to identify,
              document, and analyze AI-related risks across the entire system lifecycle, from
              development to deployment. Together, we aim to bridge the gap between traditional
              cybersecurity and the rapidly evolving AI landscape, making AI systems safer, more
              trustworthy, and resilient for everyone.
            </MKTypography>
          </Grid>
        </Container>
      </MKBox>
      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -8,
          mb: 4,
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <Counters />
        <Information />
        <LinkToDatabse />
      </Card>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;

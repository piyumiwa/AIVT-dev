// import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// import Icon from "@mui/material/Icon";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
// import MKButton from "components/MKButton";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// About Us page sections

import Team from "pages/LandingPages/AboutUs/sections/Team";
import Information from "pages/LandingPages/AboutUs/sections/Information";
// import ReportData from "layouts/pages/landing-pages/report-data";

// Routes
import footerRoutes from "footer.routes";
// Images
import bgImage from "assets/images/bg-about-us.jpg";
import routes from "routes";

function AboutUs() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const handleAuthClick = () => {
  //   if (isAuthenticated) {
  //     logout({ returnTo: window.location.origin });
  //   } else {
  //     loginWithRedirect();
  //   }
  // };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  return (
    <>
      <DefaultNavbar routes={routes} isAuthenticated={isAuthenticated} transparent light />
      <MKBox
        minHeight="75vh"
        width="100%"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container>
          <Grid
            container
            item
            xs={12}
            lg={8}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            sx={{ mx: "auto", textAlign: "center" }}
          >
            <MKTypography
              variant="h1"
              color="white"
              sx={({ breakpoints, typography: { size } }) => ({
                [breakpoints.down("md")]: {
                  fontSize: size["3xl"],
                },
              })}
            >
              AIVT by OUSPG
            </MKTypography>
            <MKTypography variant="body1" color="white" opacity={0.8} mt={1} mb={3}>
              At AIVT, we provide a comprehensive, accessible, and reliable platform dedicated to
              the identification, classification, and mitigation of vulnerabilities within
              Artificial Intelligence (AI) and Machine Learning (ML) systems. As AI continues to
              play an increasingly vital role in our daily lives and industries, ensuring the
              security and trustworthiness of these systems is more crucial than ever.
            </MKTypography>

            {/* <MKButton color="default" sx={{ color: ({ palette: { dark } }) => dark.main }}>
              create account
            </MKButton> */}
            {/* <MKTypography variant="h6" color="white" mt={8} mb={1}>
              Find us on
            </MKTypography> */}
            <MKBox display="flex" justifyContent="center" alignItems="center">
              <MKTypography component="a" variant="body1" color="white" href="#" mr={3}>
                <i className="fab fa-facebook" />
              </MKTypography>
              <MKTypography component="a" variant="body1" color="white" href="#" mr={3}>
                <i className="fab fa-instagram" />
              </MKTypography>
              <MKTypography component="a" variant="body1" color="white" href="#" mr={3}>
                <i className="fab fa-twitter" />
              </MKTypography>
              <MKTypography component="a" variant="body1" color="white" href="#">
                <i className="fab fa-google-plus" />
              </MKTypography>
            </MKBox>
          </Grid>
        </Container>
      </MKBox>
      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -8,
          mb: 4,
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <Information />
        <Team />
        {/* <Featuring /> */}
        {/* <Newsletter /> */}
      </Card>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default AboutUs;

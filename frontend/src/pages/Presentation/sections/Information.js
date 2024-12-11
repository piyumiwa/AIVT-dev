// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";

// Material Kit 2 React examples
import RotatingCard from "examples/Cards/RotatingCard";
import RotatingCardFront from "examples/Cards/RotatingCard/RotatingCardFront";
import RotatingCardBack from "examples/Cards/RotatingCard/RotatingCardBack";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Images
import bgFront from "assets/images/rotating-card-bg-front.jpeg";
import bgBack from "assets/images/rotating-card-bg-back.jpeg";

// import routes from "routes";

// const reportRoute = routes
//   .find((route) => route.name === "pages")
//   ?.collapse.find((collapse) => collapse.name === "report")
//   ?.collapse.find((item) => item.name === "new report")?.route;

function Information() {
  return (
    <MKBox component="section" py={6} my={6}>
      <Container>
        <Grid container item xs={11} spacing={3} alignItems="center" sx={{ mx: "auto" }}>
          <Grid item xs={12} lg={4} sx={{ mx: "auto" }}>
            <RotatingCard>
              <RotatingCardFront
                image={bgFront}
                icon="touch_app"
                title={
                  <>
                    Start reporting
                    <br />
                    here
                  </>
                }
                description="Share AI vulnerabilities and make an impact!"
              />
              <RotatingCardBack
                image={bgBack}
                title="You're One Step Away!"
                description="Complete your report to help improve AI safety. Click below to begin."
                action={{
                  type: "internal",
                  route: "/report-data",
                  label: "start reporting",
                }}
              />
            </RotatingCard>
          </Grid>
          <Grid item xs={12} lg={7} sx={{ ml: "auto" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="content_copy"
                  title="Comprehensive guide"
                  description="Redefining AI Security: A Comprehensive Guide to Understanding and Mitigating AI Vulnerabilities!"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="privacy_tip"
                  title="Transform AI Security"
                  description="Dive into the Most Detailed AI Vulnerability Taxonomy Yet!"
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: { xs: 0, md: 6 } }}>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="price_change"
                  title="Save Time & Money"
                  description="Discover a centralized hub for all AI/ML vulnerabilities—quickly diagnose and secure your system with ease and speed."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="verified"
                  title="Verified Content"
                  description="Our certified materials are vetted by experts to ensure you get reliable, top-notch information for all your tech needs."
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Information;

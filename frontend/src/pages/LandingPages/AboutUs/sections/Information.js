// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";

// Material Kit 2 React examples
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import CenteredBlogCard from "examples/Cards/BlogCards/CenteredBlogCard";

import bgBlog from "assets/images/bg-blog.JPG";

function Information() {
  return (
    <MKBox component="section" py={12}>
      <Container>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Grid container justifyContent="flex-start">
              <Grid item xs={12} md={6}>
                <MKBox mb={5}>
                  <DefaultInfoCard
                    icon="public"
                    title="Our Vision"
                    description="Our vision is to foster a collaborative community where developers, researchers, and users can share information, report vulnerabilities, and contribute to the ongoing improvement of AI security. By providing a structured framework for AI vulnerabilities, we aim to enhance the resilience, safety, and fairness of AI systems across various applications."
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MKBox mb={5}>
                  <DefaultInfoCard
                    icon="diversity_2"
                    title="Our Commitment"
                    description="We are committed to advancing the field of AI security by providing a robust and practical framework that can be used by organizations and individuals alike. Our research is ongoing, and we continue to refine our taxonomy to keep pace with the rapidly evolving AI landscape."
                  />
                </MKBox>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image={bgBlog}
              title="Check out other projects"
              description="OUSPG focuses on implementation level security issues and software security testing. OUSPG is active as an academic research group in the University of Oulu since summer 1996."
              action={{
                type: "external",
                route: "https://ouspg.org/",
                color: "info",
                label: "find out more",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Information;

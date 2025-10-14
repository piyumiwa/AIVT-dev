import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
import HorizontalTeamCard from "examples/Cards/TeamCards/HorizontalTeamCard";

// Images
import team1 from "assets/images/kimmo-profile.png";
import team2 from "assets/images/arttu-profile.png";
import team3 from "assets/images/piyumi-profile.png";
// import team4 from "assets/images/team-5.jpg";

function Team() {
  return (
    <MKBox
      component="section"
      variant="gradient"
      bgColor="dark"
      position="relative"
      py={6}
      px={{ xs: 2, lg: 0 }}
      mx={-2}
    >
      <Container>
        <Grid container>
          <Grid item xs={12} md={8} sx={{ mb: 6 }}>
            <MKTypography variant="h3" color="white">
              The Executive Team
            </MKTypography>
            <MKTypography variant="body2" color="white" opacity={0.8}>
              We are a team of dedicated researchers and cybersecurity experts from the University
              of Oulu and National Defense University in Helsinki, Finland, led by Kimmo Halunen and
              Arttu Leinonen. Our work focuses on developing a thorough taxonomy that addresses the
              unique challenges and vulnerabilities inherent to AI and ML technologies.
            </MKTypography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <MKBox mb={{ xs: 1, lg: 0 }}>
              <HorizontalTeamCard
                image={team3}
                name="Piyumi Weeraarachchi"
                position={{ color: "info", label: "Researcher" }}
                description="Piyumi is a cybersecurity researcher and a project researcher at the University of Oulu. Her research focuses on the security and privacy of machine learning systems, and AI systems. She has a strong background in network engineering, software development and has worked in various roles in the IT industry before pursuing her research career."
              />
            </MKBox>
          </Grid>
          <Grid item xs={12} lg={6}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={team1}
                name="Prof. Kimmo Halunen"
                position={{ color: "info", label: "Professor" }}
                description="D. Sc. (Tech.), Professor of Cybersecurity at the University of Oulu and the National Defence University in Finland, Kimmo Halunen obtained his D. Sc (Tech.) in computer engineering on hash function security in 2012. He has over 50 publications related to security, cryptography, cyberwar and blockchain technology in refereed conferences and journals. "
              />
            </MKBox>
          </Grid>
          <Grid item xs={12} lg={6}>
            <MKBox mb={1}>
              <HorizontalTeamCard
                image={team2}
                name="Arttu P. Leinonen"
                position={{ color: "info", label: "Docoral Reseacher" }}
                description="Arttu has several years of practical experience in building industrial embedded systems and ensuring their security. He currently works as a cyber security specialist at Energiavirasto (Energy Authority), focusing on NIS2, CER and related national regulation around energy sector cyber security and conducting his doctoral research on a side. "
              />
            </MKBox>
          </Grid>
          {/* <Grid item xs={12} lg={6}>
            <MKBox mb={{ xs: 1, lg: 0 }}>
              <HorizontalTeamCard
                image={team4}
                name="Marquez Garcia"
                position={{ color: "info", label: "JS Developer" }}
                description="Artist is a term applied to a person who engages in an activity deemed to be an art."
              />
            </MKBox>
          </Grid> */}
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Team;

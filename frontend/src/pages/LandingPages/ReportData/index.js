import { useState } from "react";
import * as React from "react";

// @mui material components
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// // Material Kit 2 React components
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";

import NavbarDark from "layouts/sections/navigation/navbars/components/NavbarDark";
import DefaultFooter from "examples/Footers/DefaultFooter";
import SignIn from "layouts/pages/authentication/sign-in";

// import routes from "routes";
import footerRoutes from "footer.routes";
// import { Height } from "@mui/icons-material";
const routes = [
  {
    name: "pages",
    icon: <Icon>dashboard</Icon>,
    columns: 1,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "account",
        collapse: [
          {
            name: "sign in",
            route: "/authentication/sign-in",
            component: <SignIn />,
          },
        ],
      },
    ],
  },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const signInRoute = routes
  .find((route) => route.name === "pages")
  ?.collapse.find((collapse) => collapse.name === "account")
  ?.collapse.find((item) => item.name === "sign in")?.route;

// const attributes = [
//   "0: Correct functioning",
//   "1: Reduced functioning",
//   "2: No actions",
//   "3: Chaotic",
//   "4: Directed actions",
//   "5: Random actions OoB",
//   "6: Directed actions OoB",
// ];

const attributes = [
  "Accuracy",
  "Fairness",
  "Privacy",
  "Reliability",
  "Resiliency",
  "Robustness",
  "Safety",
];

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function ReportData() {
  const [checked, setChecked] = useState(false);
  const [artifact, setArtifact] = React.useState("");
  const [phase, setPhase] = React.useState("");
  const [vulAttribute, setVulAttribute] = React.useState([]);
  const [effect, setEffect] = React.useState("");

  const handleAttributeChange = (event) => {
    const {
      target: { value },
    } = event;
    setVulAttribute(
      typeof value === "string" ? value.split(",") : value //autofill
    );
  };

  const handlePhaseChange = (event) => {
    setPhase(event.target.value);
  };

  const handleEffectChange = (event) => {
    setEffect(event.target.value);
  };

  const handleArtifactChange = (event) => {
    setArtifact(event.target.value);
  };

  const handleChecked = () => setChecked(!checked);
  return (
    <>
      <NavbarDark
        routes={routes}
        action={{
          type: "internal",
          route: signInRoute,
          label: "Sign in",
          color: "default",
        }}
        transparent
        light
      />
      <Container>
        <Grid
          container
          item
          justifyContent="center"
          xs={10}
          lg={7}
          mx="auto"
          my={5}
          textAlign="center"
        >
          <MKTypography variant="h3" mb={1}>
            Report New vulnerability
          </MKTypography>
        </Grid>
        <Grid container item xs={12} lg={7} sx={{ mx: "auto" }}>
          <MKBox width="100%" component="form" method="post" autoComplete="off">
            <MKBox p={3}>
              <Grid container spacing={3}>
                <Grid container spacing={3}>
                  {/* <MKTypography variant="h4" mb={1} p={3} my={4}>
                    Reporter Details
                  </MKTypography> */}
                  <Grid item xs={12} md={6}>
                    <MKInput variant="standard" label="First Name" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MKInput variant="standard" label="Last Name" fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput variant="standard" type="email" label="Email Address" fullWidth />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <MKTypography variant="h4" mb={1} p={3} my={4}>
                    Report Details
                  </MKTypography>
                  {/* <Grid item xs={12}>
                  <MKInput variant="standard" label="Your Message" multiline fullWidth rows={6} />
                </Grid> */}
                  <Grid item xs={12}>
                    <MKInput variant="standard" label="Report Title" multiline fullWidth rows={2} />
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      variant="standard"
                      label="Report Description"
                      multiline
                      fullWidth
                      rows={6}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="demo-simple-select-standard-label">Artifact</InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={artifact}
                        label="Artifact"
                        onChange={handleArtifactChange}
                      >
                        <MenuItem value={"web"}>Web</MenuItem>
                        <MenuItem value={"api"}>API</MenuItem>
                        <MenuItem value={"mobile"}>Mobile</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput variant="standard" label="Developer" fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput variant="standard" label="Deployer" fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="demo-simple-select-standard-label">
                        Vulnerability Phase in Lifecycle
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={phase}
                        label="Phase"
                        onChange={handlePhaseChange}
                      >
                        <MenuItem value={"Development"}>Development</MenuItem>
                        <MenuItem value={"Training"}>Training</MenuItem>
                        <MenuItem value={"Deployment and Use"}>Deployment and Use</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      variant="standard"
                      label="Phase Description"
                      multiline
                      fullWidth
                      rows={4}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="demo-multiple-checkbox-label">
                        Potentially Compromised Attributes
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={vulAttribute}
                        onChange={handleAttributeChange}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {attributes.map((attribute) => (
                          <MenuItem key={attribute} value={attribute}>
                            <Checkbox checked={vulAttribute.indexOf(attribute) > -1} />
                            <ListItemText primary={attribute} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      variant="standard"
                      label="Attribute Description"
                      multiline
                      fullWidth
                      rows={4}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="demo-simple-select-standard-label">
                        Possible Effect of Exploitation
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={effect}
                        label="Effect"
                        onChange={handleEffectChange}
                      >
                        <MenuItem value={"0: Correct functioning"}>0: Correct functioning</MenuItem>
                        <MenuItem value={"1: Reduced functioning"}>1: Reduced functioning</MenuItem>
                        <MenuItem value={"2: No actions"}>2: No actions</MenuItem>
                        <MenuItem value={"3: Chaotic"}>3: Chaotic</MenuItem>
                        <MenuItem value={"4: Directed actions"}>4: Directed actions</MenuItem>
                        <MenuItem value={"5: Random actions OoB"}>5: Random actions OoB</MenuItem>
                        <MenuItem value={"6: Directed actions OoB"}>
                          6: Directed actions OoB
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      variant="standard"
                      label="Effect Description"
                      multiline
                      fullWidth
                      rows={4}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} textAlign="left">
                  <MKTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    mb={1}
                    p={1}
                    my={4}
                    mx={-4}
                  >
                    Please attach any relevant documents or evidence that support the details
                    provided above.
                  </MKTypography>
                </Grid>
                <Grid>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload files
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event) => console.log(event.target.files)}
                      multiple
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} alignItems="center" ml={-1}>
                  <Switch checked={checked} onChange={handleChecked} />
                  <MKTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    ml={-1}
                    sx={{ cursor: "pointer", userSelect: "none" }}
                    onClick={handleChecked}
                  >
                    &nbsp;&nbsp;I agree the&nbsp;
                  </MKTypography>
                  <MKTypography
                    component="a"
                    href="#"
                    variant="button"
                    fontWeight="regular"
                    color="dark"
                  >
                    Terms and Conditions
                  </MKTypography>
                </Grid>
              </Grid>
              <Grid container item justifyContent="center" xs={12} my={2}>
                <MKButton type="submit" variant="gradient" color="dark" fullWidth>
                  Send Message
                </MKButton>
              </Grid>
            </MKBox>
          </MKBox>
        </Grid>
      </Container>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default ReportData;

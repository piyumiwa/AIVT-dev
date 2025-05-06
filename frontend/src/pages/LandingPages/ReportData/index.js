import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import axios from "axios";

// @mui material components
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
// import Icon from "@mui/material/Icon";
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
import TextField from "@mui/material/TextField";

// // Material Kit 2 React components
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";

import NavbarDark from "layouts/sections/navigation/navbars/components/NavbarDark";
import DefaultFooter from "examples/Footers/DefaultFooter";
import footerRoutes from "footer.routes";

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function ReportData() {
  const [checked, setChecked] = useState(false);
  // const [artifact, setArtifact] = React.useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [phase, setPhase] = useState("");
  const [attributeName, setAttributeName] = useState([]);
  const [effectName, setEffectName] = useState("");
  const [title, setTitle] = useState("");
  const [report_description, setReport_description] = useState("");
  const [artifactType, setArtifactType] = useState("");
  const [developer, setDeveloper] = useState("");
  const [deployer, setDeployer] = useState("");
  const [phase_description, setPhase_description] = useState("");
  const [attr_description, setAttr_description] = useState("");
  const [eff_description, setEff_description] = useState("");
  const [attachments, setAttachments] = useState([]);

  const { isAuthenticated, user } = useAuth0();
  const [isEditable, setIsEditable] = useState({ name: true, organization: true });
  const [reportCreated, setReportCreated] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setAttachments((prevAttachments) => [...prevAttachments, ...newFiles]);
  };

  const handleDeleteFile = (index) => {
    setAttachments((prevAttachments) => prevAttachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    if (!checked) {
      alert("You must agree to the Terms and Conditions before submitting.");
      return;
    }

    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("organization", organization);
    formData.append("title", title);
    formData.append("report_description", report_description);
    formData.append("artifactType", artifactType);
    formData.append("developer", developer);
    formData.append("deployer", deployer);
    formData.append("phase", phase);
    formData.append("phase_description", phase_description);
    formData.append("attributeName", attributeName);
    formData.append("attr_description", attr_description);
    formData.append("effectName", effectName);
    formData.append("eff_description", eff_description);
    formData.append("sub", user.sub);
    formData.append("email", user.email);

    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    console.log("Form data: ", formData);

    axios
      .post(`https://86.50.228.33/api/report-data`, formData, {
        termsAgreed: checked,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Report created successfully:", response.data);
        setReportCreated(true);
        if (reportCreated) {
          handleClose();
          navigate("/vulnerability-db");
        }
        handleClose();
        navigate("/vulnerability-db");
      })
      .catch((error) => {
        console.error("Error creating report:", error);
      });
  };

  const handleAttributeChange = (event) => {
    const {
      target: { value },
    } = event;
    setAttributeName(
      typeof value === "string" ? value.split(",") : value //autofill
    );
  };

  const handlePhaseChange = (event) => {
    setPhase(event.target.value);
  };

  const handleEffectChange = (event) => {
    setEffectName(event.target.value);
  };

  const handleArtifactChange = (event) => {
    setArtifactType(event.target.value);
  };

  const handleChecked = () => setChecked(!checked);

  useEffect(() => {
    if (!user.sub) return;

    axios
      .get(`https://86.50.228.33/api/auth/current-user`, {
        params: { sub: user.sub },
      })
      .then((response) => {
        const { name, organization } = response.data;
        console.log("Fetched user data: ", response.data);

        setName(name || "");
        setOrganization(organization || "");

        setIsEditable({
          name: !name,
          organization: !organization,
        });
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [user]);

  return (
    <>
      <NavbarDark transparent light />
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
                    <TextField
                      // disabled
                      variant="standard"
                      label="Name"
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      readOnly={!isEditable.name}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      // disabled
                      variant="standard"
                      label="Organization"
                      value={organization}
                      fullWidth
                      onChange={(e) => setOrganization(e.target.value)}
                      readOnly={!isEditable.organization}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {isAuthenticated && user && (
                      <TextField
                        disabled
                        id="filled-disabled"
                        label="Email"
                        defaultValue={user.email}
                        variant="standard"
                        fullWidth
                      />
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <MKTypography variant="h4" mb={1} p={3} my={4}>
                    Report Details
                  </MKTypography>
                  <Grid item xs={12}>
                    <MKInput
                      variant="standard"
                      label="Report Title"
                      multiline
                      fullWidth
                      rows={2}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      variant="standard"
                      label="Report Description"
                      multiline
                      fullWidth
                      rows={6}
                      value={report_description}
                      onChange={(e) => setReport_description(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="demo-simple-select-standard-label">Artifact</InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={artifactType}
                        label=" Type"
                        onChange={handleArtifactChange}
                      >
                        <MenuItem value={"web"}>Web Application</MenuItem>
                        <MenuItem value={"api"}>API</MenuItem>
                        <MenuItem value={"mobile"}>Mobile Application</MenuItem>
                        <MenuItem value={"ai_model"}>AI Model (Standalone)</MenuItem>
                        <MenuItem value={"dataset"}>Dataset</MenuItem>
                        <MenuItem value={"inference_service"}>Inference Service</MenuItem>
                        <MenuItem value={"edge_device"}>Edge Device</MenuItem>
                        <MenuItem value={"chatbot"}>Chatbot</MenuItem>
                        <MenuItem value={"llm_plugin"}>LLM Plugin / Extension</MenuItem>
                        <MenuItem value={"ml_pipeline"}>ML Pipeline</MenuItem>
                        <MenuItem value={"automl_system"}>AutoML System</MenuItem>
                        <MenuItem value={"recommendation_system"}>Recommendation System</MenuItem>
                        <MenuItem value={"autonomous_vehicle_software"}>
                          Autonomous Vehicle Software
                        </MenuItem>
                        <MenuItem value={"smart_contract"}>Smart Contract (AI-integrated)</MenuItem>
                        <MenuItem value={"virtual_assistant"}>Virtual Assistant</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      variant="standard"
                      label="Developer"
                      fullWidth
                      value={developer}
                      onChange={(e) => setDeveloper(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      variant="standard"
                      label="Deployer"
                      fullWidth
                      value={deployer}
                      onChange={(e) => setDeployer(e.target.value)}
                    />
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
                      value={phase_description}
                      onChange={(e) => setPhase_description(e.target.value)}
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
                        value={attributeName}
                        onChange={handleAttributeChange}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {attributes.map((attribute) => (
                          <MenuItem key={attribute} value={attribute}>
                            <Checkbox checked={attributeName.indexOf(attribute) > -1} />
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
                      value={attr_description}
                      onChange={(e) => setAttr_description(e.target.value)}
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
                        value={effectName}
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
                      value={eff_description}
                      onChange={(e) => setEff_description(e.target.value)}
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
                <Grid item xs={12}>
                  <Button variant="contained" startIcon={<CloudUploadIcon />} component="label">
                    Upload files
                    <VisuallyHiddenInput type="file" multiple onChange={handleFileChange} />
                  </Button>
                  {attachments.map((file, index) => (
                    <div key={index}>
                      <span>{file.name}</span>
                      <Button onClick={() => handleDeleteFile(index)}>Remove</Button>
                    </div>
                  ))}
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
                <form>
                  <MKButton onClick={handleOpen} variant="gradient" color="dark" fullWidth>
                    Submit Vulnerability
                  </MKButton>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Grid item xs={12}>
                        <MKTypography variant="h5" mb={1}>
                          Confirm Submission
                        </MKTypography>
                        <MKTypography variant="body2" gutterBottom>
                          Are you sure you want to submit this report?
                        </MKTypography>
                      </Grid>
                      <Grid container item xs={12} justifyContent="center" spacing={2}>
                        <Grid item>
                          <MKButton variant="gradient" color="dark" onClick={handleSubmit}>
                            Submit Report
                          </MKButton>
                        </Grid>
                        <Grid item>
                          <MKButton variant="outlined" color="dark" onClick={handleClose}>
                            Cancel
                          </MKButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </Modal>
                </form>
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

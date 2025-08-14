import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

function UpdateData() {
  const [checked, setChecked] = useState(false);
  const { id } = useParams();
  const { token } = useParams();
  // const [name, setName] = useState("");
  // const [organization, setOrganization] = useState("");
  const [occupation, setOccupation] = useState("");
  const [report_base, setReport_base] = useState("");
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
  const [existingAttachments, setExistingAttachments] = useState([]);

  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const [loading, setLoading] = useState(true);
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

  console.log("Rendering UpdateData");
  useEffect(() => {
    const fetchVulnerabilityDetails = async () => {
      if (!isAuthenticated || !user) {
        console.error("User is not authenticated or user object is unavailable.");
        await loginWithRedirect();
        return;
      }

      try {
        let response;
        console.log("Fetching vulnerability details for ID:", id, "and token:", token);
        if (token) {
          response = await axios.get(`/api/vulnerability-db/token/${token}`);
        } else {
          response = await axios.get(`/api/vulnerability-db/id/${id}`);
        }

        const vulnerability = response.data;
        const userresponse = await axios.get(`/api/auth/current-user`, {
          params: { sub: user.sub },
        });
        const { role } = userresponse.data;
        console.log("User role:", role);

        if (vulnerability.reporterEmail === user.email || role === "admin") {
          setOccupation(vulnerability.occupation || "");
          setReport_base(vulnerability.report_base || "");
          setTitle(vulnerability.title || "");
          setReport_description(vulnerability.report_description || "");
          setArtifactType(vulnerability.artifactType || "");
          setDeveloper(vulnerability.developer || "");
          setDeployer(vulnerability.deployer || "");
          setPhase(vulnerability.phase || "");
          setPhase_description(vulnerability.phaseDescription || "");
          setAttributeName(
            vulnerability.attributeName
              ? vulnerability.attributeName.split(",").map((attr) => attr.trim())
              : []
          );
          setAttr_description(vulnerability.attr_Description || "");
          setEffectName(vulnerability.effectName || "");
          setEff_description(vulnerability.eff_Description || "");
          setExistingAttachments(vulnerability.attachments || []);
        } else {
          alert("Unauthorized attempt to edit vulnerability. Please try again.");
          navigate(`/vulnerability-db/id/${id}`);
        }
      } catch (error) {
        console.error("Error fetching vulnerability details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVulnerabilityDetails();
  }, [id, token, isAuthenticated, user, loginWithRedirect, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleSubmit = (event) => {
    if (!checked) {
      alert("You must agree to the Terms and Conditions before submitting.");
      return;
    }

    event.preventDefault();

    const formData = new FormData();
    // formData.append("name", name);
    // formData.append("organization", organization);
    formData.append("occupation", occupation);
    formData.append("report_base", report_base);
    formData.append("title", title);
    formData.append("report_description", report_description);
    formData.append("artifactType", artifactType);
    formData.append("developer", developer);
    formData.append("deployer", deployer);
    formData.append("phase", phase);
    formData.append("phase_description", phase_description);
    // formData.append("attributeName", attributeName);
    attributeName.forEach((attr) => formData.append("attributeName", attr));
    formData.append("attr_description", attr_description);
    formData.append("effectName", effectName);
    formData.append("eff_description", eff_description);
    // formData.append("sub", user.sub);
    // formData.append("email", user.email);

    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    console.log("Form data: ", formData);

    axios
      .put(`/api/vulnerability-db/editid/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // console.log("Report created successfully:", response.data);
        console.log("Report updated successfully:", response.data);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error updating report:", error);
      });
  };

  const handleOccupChange = (event) => {
    setOccupation(event.target.value);
  };

  const handleBaseChange = (event) => {
    setReport_base(event.target.value);
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
            Update the vulnerability
          </MKTypography>
        </Grid>
        <Grid container item xs={12} lg={7} sx={{ mx: "auto" }}>
          <MKBox width="100%" component="form" method="put" autoComplete="off">
            <MKBox p={3}>
              <Grid container spacing={3}>
                <Grid container spacing={3}>
                  <MKTypography variant="h4" mb={1} p={3} my={4}>
                    Reporter Details
                  </MKTypography>
                  <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="demo-simple-select-standard-label">Occupation</InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={occupation}
                        label="Occupation"
                        onChange={handleOccupChange}
                      >
                        <MenuItem value={"AI Developer/ML Engineer"}>
                          AI Developer / ML Engineer
                        </MenuItem>
                        <MenuItem value={"Cybersecurity Researcher"}>
                          Cybersecurity Researcher
                        </MenuItem>
                        <MenuItem value={"Security Analyst/Red Teamer"}>
                          Security Analyst / Red Teamer
                        </MenuItem>
                        <MenuItem value={"Software Engineer"}>Software Engineer</MenuItem>
                        <MenuItem value={"Data Scientist"}>Data Scientist</MenuItem>
                        <MenuItem value={"Academic Researcher/Professor"}>
                          Academic Researcher / Professor
                        </MenuItem>
                        <MenuItem value={"System Administrator"}>System Administrator</MenuItem>
                        <MenuItem value={"Penetration Tester/Ethical Hacker"}>
                          Penetration Tester / Ethical Hacker
                        </MenuItem>

                        <MenuItem value={"Independent Researcher"}>Independent Researcher</MenuItem>
                        <MenuItem value={"Open-Source Contributor"}>
                          Open-Source Contributor
                        </MenuItem>
                        <MenuItem value={"Bug Bounty Hunter"}>Bug Bounty Hunter</MenuItem>
                        <MenuItem value={"Policy Analyst/Ethics Researcher"}>
                          Policy Analyst / Ethics Researcher
                        </MenuItem>

                        <MenuItem value={"Healthcare IT Professional"}>
                          Healthcare IT Professional
                        </MenuItem>
                        <MenuItem value={"Critical Infrastructure Engineer"}>
                          Critical Infrastructure Engineer
                        </MenuItem>
                        <MenuItem value={"Defense/Military Technologist"}>
                          Defense / Military Technologist
                        </MenuItem>
                        <MenuItem value={"Financial Services Security Specialist"}>
                          Financial Services Security Specialist
                        </MenuItem>

                        <MenuItem value={"Masters/PhD Student"}>Master’s / PhD Student</MenuItem>
                        <MenuItem value={"Undergraduate Student"}>
                          Undergraduate Student in Relevant Field
                        </MenuItem>
                        <MenuItem value={"AI/ML Enthusiast"}>AI/ML Enthusiast or Hobbyist</MenuItem>

                        <MenuItem value={"Vulnerability Reporter"}>Vulnerability Reporter</MenuItem>
                        <MenuItem value={"CVE Contributor"}>CVE Contributor</MenuItem>
                        <MenuItem value={"CTI Platform/CERT Member"}>
                          Member of a CTI Platform or CERT Team
                        </MenuItem>

                        <MenuItem value={"Other"}>Other (please specify)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="demo-simple-select-standard-label">
                        The report is based on...
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={report_base}
                        label="Report Base"
                        onChange={handleBaseChange}
                      >
                        <MenuItem value={"Original research"}>Original research</MenuItem>
                        <MenuItem value={"Personal experience"}>Personal experience</MenuItem>
                        <MenuItem value={"Public dataset / article"}>
                          Public dataset / article
                        </MenuItem>
                        <MenuItem value={"News or incident report"}>
                          News or incident report
                        </MenuItem>
                        <MenuItem value={"Other"}>Other</MenuItem>
                      </Select>
                    </FormControl>
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
                        label="artifactType"
                        onChange={handleArtifactChange}
                      >
                        <MenuItem value={"Web Application"}>Web Application</MenuItem>
                        <MenuItem value={"Desktop Application"}>Desktop Application</MenuItem>
                        <MenuItem value={"Mobile Application"}>Mobile Application</MenuItem>
                        <MenuItem value={"API"}>API</MenuItem>
                        <MenuItem value={"AI Model (Standalone)"}>AI Model (Standalone)</MenuItem>
                        <MenuItem value={"Dataset"}>Dataset</MenuItem>
                        <MenuItem value={"Inference Service"}>Inference Service</MenuItem>
                        <MenuItem value={"Edge Device"}>Edge Device</MenuItem>
                        <MenuItem value={"Chatbot"}>Chatbot</MenuItem>
                        <MenuItem value={"LLM Plugin / Extension"}>LLM Plugin / Extension</MenuItem>
                        <MenuItem value={"ML Pipeline"}>ML Pipeline</MenuItem>
                        <MenuItem value={"AutoML System"}>AutoML System</MenuItem>
                        <MenuItem value={"Recommendation System"}>Recommendation System</MenuItem>
                        <MenuItem value={"Autonomous Vehicle Software"}>
                          Autonomous Vehicle Software
                        </MenuItem>
                        <MenuItem value={"Smart Contract (AI-integrated)"}>
                          Smart Contract (AI-integrated)
                        </MenuItem>
                        <MenuItem value={"Virtual Assistant"}>Virtual Assistant</MenuItem>
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
                    Here are the existing attachments. Please attach if there is new documents.
                  </MKTypography>
                </Grid>
                <Grid item xs={12}>
                  {existingAttachments.map((file, index) => (
                    <div key={index}>
                      <span>{file.name}</span>
                      <Button onClick={() => handleDeleteFile(index)}>Remove</Button>
                    </div>
                  ))}
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
                    Update Vulnerability
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
                          Are you sure you want to update this report?
                        </MKTypography>
                      </Grid>
                      <Grid container item xs={12} justifyContent="center" spacing={2}>
                        <Grid item>
                          <MKButton variant="gradient" color="dark" onClick={handleSubmit}>
                            Update Report
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

export default UpdateData;

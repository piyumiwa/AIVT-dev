import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import DownloadIcon from "@mui/icons-material/Download";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

import NavbarDark from "layouts/sections/navigation/navbars/components/NavbarDark";
import DefaultFooter from "examples/Footers/DefaultFooter";
// import SignIn from "layouts/pages/authentication/sign-in";
import FilledInfoCard from "examples/Cards/InfoCards/FilledInfoCard";

import footerRoutes from "footer.routes";

function ReviewData() {
  const [review_comments, setReview_comments] = useState("");
  // const [approval_status, setApproval_status] = useState("");
  const [comments, setComments] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [vulnerability, setVulnerability] = useState([]);
  // const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const MAX_LINES = 2;
  const MAX_CHARACTERS_PER_LINE = 50;

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchVulnerability = async () => {
      try {
        const response = await axios.get(`/api/vulnerability-db/id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVulnerability(response.data);
        setReview_comments(response.data.review_comments || "");
      } catch (error) {
        console.error("Error fetching vulnerability:", error);
      }
    };

    fetchVulnerability();
  }, [id, token]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/vulnerability-db/id/${id}/comments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComments(response.data); // Store comments in state
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id, token]);

  const getTruncatedDescription = (description) => {
    if (description) {
      const maxCharacters = MAX_LINES * MAX_CHARACTERS_PER_LINE;
      if (description.length > maxCharacters) {
        return description.slice(0, maxCharacters) + "...";
      }
    }
    return description;
  };

  const handleDelete = async (vulnid) => {
    try {
      await axios.delete(`/api/vulnerability-db/${vulnid}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Deleted successfully");
      navigate("/vulnerability-db/pending");
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  const handleApprove = async (vulnid) => {
    console.log("vulnid:", vulnid);

    const data = { approval_status: "approved", review_comments };

    try {
      await axios.put(`/api/vulnerability-db/${vulnid}/review`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Report approved successfully!");
      setReview_comments("");
      navigate("/vulnerability-db/pending");
    } catch (error) {
      console.error("Error approving report: ", error);
      alert("Failed to approve the report.");
    }
  };

  const handleReject = async (vulnid) => {
    const data = { approval_status: "rejected", review_comments };

    try {
      await axios.put(`/api/vulnerability-db/${vulnid}/review`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Report rejected successfully!");
      setReview_comments("");
      navigate("/vulnerability-db/rejected");
    } catch (error) {
      console.error("Error rejecting report: ", error);
      alert("Failed to reject the report.");
    }
  };

  const toggleExpandText = () => {
    setIsExpanded((prev) => !prev);
  };

  const downloadAttachment = (vulnid, filename) => {
    fetch(`/api/vulnerability-db/attachments/${vulnid}/${filename}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Download failed");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Error downloading the file:", error));
  };

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  return (
    <>
      <NavbarDark transparent light />
      <Container sx={{ mt: 4, maxWidth: "100%" }}>
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={12}>
            <MKTypography variant="h3" my={1}>
              {vulnerability.title}
            </MKTypography>
            <MKTypography variant="body2" color="text" mb={2}>
              {/* Conditionally show either truncated or full description */}
              {isExpanded
                ? vulnerability.report_description
                : getTruncatedDescription(vulnerability.report_description)}
            </MKTypography>
            {/* Show "See more" link only if description has more than MAX_LINES */}
            {vulnerability.report_description &&
              vulnerability.report_description.length > MAX_LINES * MAX_CHARACTERS_PER_LINE && (
                <MKTypography
                  component="a"
                  href="#"
                  variant="body2"
                  color="info"
                  fontWeight="regular"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleExpandText();
                  }}
                  sx={{
                    width: "max-content",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    "& .material-icons-round": {
                      fontSize: "1.125rem",
                      transform: "translateX(3px)",
                      transition: "transform 0.2s cubic-bezier(0.34, 1.61, 0.7, 1.3)",
                    },
                    "&:hover .material-icons-round, &:focus .material-icons-round": {
                      transform: "translateX(6px)",
                    },
                  }}
                >
                  {isExpanded ? "See less..." : "See more..."}
                  <Icon sx={{ fontWeight: "bold" }}>
                    {isExpanded ? "arrow_upward" : "arrow_forward"}
                  </Icon>
                </MKTypography>
              )}
          </Grid>
        </Grid>
        <Grid
          item
          spacing={0}
          xs={12}
          lg={6}
          sx={{ ml: { xs: -2, lg: "auto" }, mt: { xs: 6, lg: 0 } }}
        >
          <Stack>
            <MKBox display="flex" alignItems="flex-start" p={2}>
              <MKBox
                width="3rem"
                height="3rem"
                minWidth="3rem"
                minHeight="3rem"
                variant="gradient"
                bgColor="info"
                color="white"
                coloredShadow="info"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="xl"
              >
                <Icon fontSize="small">mediation</Icon>
              </MKBox>
              <MKBox pl={2}>
                <MKTypography variant="body1" color="text">
                  Vulnerability location in lifecycle
                </MKTypography>
                <MKTypography variant="body2" color="bold">
                  {vulnerability.phase}
                </MKTypography>
                <MKTypography variant="body2" color="text">
                  {vulnerability.phaseDescription}
                </MKTypography>
              </MKBox>
            </MKBox>

            <MKBox display="flex" alignItems="flex-start" p={2}>
              <MKBox
                width="3rem"
                height="3rem"
                minWidth="3rem"
                minHeight="3rem"
                variant="gradient"
                bgColor="info"
                color="white"
                coloredShadow="info"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="xl"
              >
                <Icon fontSize="small">settings_overscan</Icon>
              </MKBox>
              <MKBox pl={2}>
                <MKTypography variant="body1" color="text">
                  Potentially compromised attributes
                </MKTypography>
                <MKTypography variant="body2" color="bold">
                  {vulnerability.attributeName}
                </MKTypography>
                <MKTypography variant="body2" color="text">
                  {vulnerability.attr_Description}
                </MKTypography>
              </MKBox>
            </MKBox>

            <MKBox display="flex" alignItems="flex-start" p={2}>
              <MKBox
                width="3rem"
                height="3rem"
                minWidth="3rem"
                minHeight="3rem"
                variant="gradient"
                bgColor="info"
                color="white"
                coloredShadow="info"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="xl"
              >
                <Icon fontSize="small">token</Icon>
              </MKBox>
              <MKBox pl={2}>
                <MKTypography variant="body1" color="text">
                  Possible effect of exploitation
                </MKTypography>
                <MKTypography variant="body2" color="bold">
                  {vulnerability.effectName}
                </MKTypography>
                <MKTypography variant="body2" color="text">
                  {vulnerability.eff_Description}
                </MKTypography>
              </MKBox>
            </MKBox>
          </Stack>
        </Grid>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={4}>
            <FilledInfoCard
              color="info"
              icon="apps"
              title="Artifact Type"
              description={vulnerability.artifactType}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FilledInfoCard
              color="info"
              icon="apps"
              title="Recorded date"
              description={vulnerability.date_added?.slice(0, 10)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FilledInfoCard
              color="info"
              icon="apps"
              title="Last updated date"
              description={vulnerability.last_updated?.slice(0, 10)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="left">
          <Grid item xs={12} sm={6} md={4}>
            {vulnerability.reporterOrganization && (
              <MKBox
                p={2}
                sx={{
                  textAlign: "left",
                }}
              >
                <MKTypography variant="body1">Report submitted by:</MKTypography>
                <MKTypography variant="body2">{vulnerability.reporterOrganization}</MKTypography>
              </MKBox>
            )}
            {vulnerability.source && (
              <MKBox
                p={2}
                sx={{
                  textAlign: "left",
                }}
              >
                <MKTypography variant="body1">Report source:</MKTypography>
                <MKTypography variant="body2">{vulnerability.source}</MKTypography>
              </MKBox>
            )}
            {vulnerability.developer && (
              <MKBox
                p={2}
                sx={{
                  textAlign: "left",
                }}
              >
                <MKTypography variant="body1">Developer of the system: </MKTypography>
                <MKTypography variant="body2">{vulnerability.developer}</MKTypography>
              </MKBox>
            )}
            {vulnerability.deployer && (
              <MKBox
                p={2}
                sx={{
                  textAlign: "left",
                }}
              >
                <MKTypography variant="body1">Deployer of the system: </MKTypography>
                <MKTypography variant="body2">{vulnerability.deployer}</MKTypography>
              </MKBox>
            )}
            {vulnerability.cve_link && (
              <MKBox
                p={2}
                sx={{
                  textAlign: "left",
                }}
              >
                <MKTypography variant="body1">CVE Link: </MKTypography>
                <MKTypography variant="body2">
                  Access the CVE details{" "}
                  <a href={vulnerability.cve_link} target="_blank" rel="noopener noreferrer">
                    here..
                  </a>
                </MKTypography>
              </MKBox>
            )}
            <MKBox
              p={2}
              sx={{
                textAlign: "left",
              }}
            >
              <MKTypography variant="body1">Attachments with proof:</MKTypography>
              {vulnerability.attachments && vulnerability.attachments.length > 0 ? (
                <MKBox component="table" width="100%" sx={{ mt: 2 }}>
                  <tbody>
                    {vulnerability.attachments.map((attachment, index) => (
                      <tr key={index}>
                        <td>
                          <MKButton
                            variant="text"
                            color="info"
                            startIcon={<DownloadIcon />}
                            onClick={() =>
                              downloadAttachment(vulnerability.id, attachment.filename)
                            }
                            sx={{
                              textTransform: "none",
                              fontWeight: "normal",
                              justifyContent: "flex-start",
                              minWidth: 200,
                              "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.04)",
                              },
                            }}
                          >
                            {attachment.filename}
                          </MKButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </MKBox>
              ) : (
                <MKTypography variant="body2" color="textSecondary" mt={1}>
                  No attachments available.
                </MKTypography>
              )}
            </MKBox>
          </Grid>
        </Grid>
        <Grid sx={{ mt: 2 }}>
          <MKTypography variant="h6">Previous Comments:</MKTypography>
          {comments.length > 0 ? (
            <MKBox>
              {comments.map((comment, index) => (
                <MKBox key={index} sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 4 }}>
                  <MKTypography variant="body1">{comment.review_comments}</MKTypography>
                  <MKTypography variant="caption" color="textSecondary">
                    By Admin {comment.adminId} on {new Date(comment.review_date).toLocaleString()}
                  </MKTypography>
                </MKBox>
              ))}
            </MKBox>
          ) : (
            <MKTypography variant="body2" color="textSecondary">
              No comments yet.
            </MKTypography>
          )}
        </Grid>
        <Grid sx={{ mt: 2 }}>
          <MKInput
            fullWidth
            label="Review comments"
            id="review_comments"
            multiline
            rows={5}
            value={review_comments}
            onChange={(e) => setReview_comments(e.target.value)}
          />
        </Grid>
        <Grid
          container
          spacing={2}
          justifyContent="flex-end"
          alignItems="center"
          sx={{ textAlign: "center", mt: 3 }}
        >
          <Grid item>
            <MKButton
              onClick={() => handleApprove(id)}
              sx={{
                padding: 2,
                textAlign: "center",
              }}
            >
              Approve
            </MKButton>
          </Grid>
          <Grid item>
            <MKButton
              onClick={() => handleReject(id)}
              sx={{
                padding: 2,
                textAlign: "center",
              }}
            >
              Reject
            </MKButton>
          </Grid>
          <Grid item>
            <MKButton
              component={Link}
              to={`/vulnerability-db/editid/${id}`}
              sx={{
                padding: 2,
                textAlign: "center",
              }}
            >
              Edit
            </MKButton>
          </Grid>
          <Grid item>
            <MKButton
              onClick={() => handleDelete(id)}
              sx={{
                padding: 2,
                textAlign: "center",
              }}
            >
              Delete
            </MKButton>
          </Grid>
        </Grid>
      </Container>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default ReviewData;

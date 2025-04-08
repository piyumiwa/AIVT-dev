import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
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
  const { user, loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const [review_comments, setReview_comments] = useState("");
  // const [approval_status, setApproval_status] = useState("");
  const [comments, setComments] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [vulnerability, setVulnerability] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const MAX_LINES = 2;
  const MAX_CHARACTERS_PER_LINE = 50;

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin });
    } else {
      loginWithRedirect();
    }
  };

  const handleDelete = (reportId) => {
    axios
      .delete(`https://86.50.228.33/api/vulnerability-db/${reportId}/delete`)
      .then((response) => {
        console.log("Deleted successfully:", response.data);
      })
      .catch((error) => console.error("Error deleting report:", error));
  };

  const handleApprove = (reportId) => {
    const approval_status = "approved";

    const data = { approval_status, review_comments, sub: user.sub };

    axios
      .put(`https://86.50.228.33/api/vulnerability-db/${reportId}/review`, data, {
        params: { sub: user.sub },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data.message);
        alert("Report approved successfully!");
        setReview_comments("");
        // window.location.reload();
        navigate(`/vulnerability-db/pending`);
      })
      .catch((error) => {
        console.error("Error approving report: ", error);
        alert("Failed to approve the report.");
      });
  };

  const handleReject = (reportId) => {
    const approval_status = "rejected";

    const data = { approval_status, review_comments, sub: user.sub };

    axios
      .put(`https://86.50.228.33/api/vulnerability-db/${reportId}/review`, data, {
        params: { sub: user.sub },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data.message);
        alert("Report rejected successfully!");
        setReview_comments("");
        // window.location.reload();
        navigate(`/vulnerability-db/rejected`);
      })
      .catch((error) => {
        console.error("Error approving report: ", error);
        alert("Failed to reject the report.");
      });
  };

  const toggleExpandText = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Replace with the endpoint that fetches the user's role
        const response = await axios.get(`https://86.50.228.33/api/auth/current-user`, {
          params: { sub: user.sub },
          // headers: {
          //   Authorization: `Bearer ${user.sub}`, // Replace with the actual token if needed
          // },
        });
        console.log("User role response:", response.data);
        const { role } = response.data;

        setUserRole(role);

        if (role !== "admin") {
          alert("You are not authorized to access this page.");
          navigate(`/vulnerability-db`);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        navigate(`/vulnerability-db`);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchUserRole();
    } else {
      loginWithRedirect();
    }
  }, [id, isAuthenticated, user, navigate, loginWithRedirect]);

  useEffect(() => {
    if (userRole === "admin") {
      const url = `https://86.50.228.33/api/vulnerability-db/${id}`;

      axios
        .get(url)
        .then((response) => response.data)
        .then((data) => {
          console.log("JSON response:", data);
          setVulnerability(data);
          setReview_comments(data.review_comments || "");
        })
        .catch((error) => {
          console.error("Error fetching vulnerability:", error);
        });
    }
  }, [id, userRole]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://86.50.228.33/api/vulnerability-db/${id}/comments`
        );
        setComments(response.data); // Store comments in state
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  const getTruncatedDescription = (description) => {
    if (description) {
      const maxCharacters = MAX_LINES * MAX_CHARACTERS_PER_LINE;
      if (description.length > maxCharacters) {
        return description.slice(0, maxCharacters) + "...";
      }
    }
    return description;
  };

  const downloadAttachment = (reportId, filename) => {
    fetch(`https://86.50.228.33/api/vulnerability-db/attachments/${reportId}/${filename}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated || userRole !== "admin") {
    return <p>You are not authorized to view this page.</p>;
  }

  return (
    <>
      <NavbarDark
        transparent
        light
        onAuthClick={handleAuthClick}
        isAuthenticated={isAuthenticated}
      />
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
            <MKBox display="flex" alignItems="center" p={2}>
              <MKBox
                width="3rem"
                height="3rem"
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

            <MKBox display="flex" alignItems="center" p={2}>
              <MKBox
                width="3rem"
                height="3rem"
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

            <MKBox display="flex" alignItems="center" p={2}>
              <MKBox
                width="3rem"
                height="3rem"
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
              description={vulnerability.date_added}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FilledInfoCard
              color="info"
              icon="apps"
              title="Last updated date"
              description={vulnerability.last_updated}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="left">
          <Grid item xs={12} sm={6} md={4}>
            <MKBox
              p={2}
              sx={{
                textAlign: "left",
              }}
            >
              <MKTypography variant="body1">Report submitted by:</MKTypography>
              <MKTypography variant="body2">{vulnerability.reporterOrganization}</MKTypography>
            </MKBox>
            <MKBox
              p={2}
              sx={{
                textAlign: "left",
              }}
            >
              <MKTypography variant="body1">Developer of the system: </MKTypography>
              <MKTypography variant="body2">{vulnerability.developer}</MKTypography>
            </MKBox>
            <MKBox
              p={2}
              sx={{
                textAlign: "left",
              }}
            >
              <MKTypography variant="body1">Deployer of the system: </MKTypography>
              <MKTypography variant="body2">{vulnerability.deployer}</MKTypography>
            </MKBox>
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
              to={`/vulnerability-db/${id}/edit`}
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

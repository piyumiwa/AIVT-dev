import { useAuth0 } from "@auth0/auth0-react";
// import * as React from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
// import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

import DefaultFooter from "examples/Footers/DefaultFooter";
// import SignIn from "layouts/pages/authentication/sign-in";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import footerRoutes from "footer.routes";
import bgImage from "assets/images/bg-db.jpg";

const paginationModel = { page: 0, pageSize: 5 };

function SearchResults() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [phase, setPhase] = useState("");
  const [attribute, setAttribute] = useState("");
  const [effect, setEffect] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("query");

  useEffect(() => {
    if (!searchQuery) return;

    const url = `https://86.50.228.33/api/vulnerability-db/search?query=${encodeURIComponent(
      searchQuery
    )}&phase=${phase}&attribute=${attribute}&effect=${effect}&startDate=${startDate}&endDate=${endDate}`;

    axios
      .get(url)
      .then((response) => {
        console.log("Response: ", response.data);
        return response.data;
      })
      .then((data) => {
        console.log("JSON response:", data);
        if (Array.isArray(data)) {
          const formattedRows = data.map((vul) => ({
            id: vul.id,
            date_added: vul.date_added,
            title: vul.title,
            phase: vul.phase,
            effect: vul.effect,
            attributes: vul.attributes,
          }));
          setVulnerabilities(formattedRows);
        } else {
          console.error("Fetched data is not an array:", data);
          setVulnerabilities([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching vulnerabilities:", error);
      });
  }, [searchQuery, phase, attribute, effect, startDate, endDate]);

  const clearFilters = () => {
    setPhase("");
    setAttribute("");
    setEffect("");
    setStartDate("");
    setEndDate("");
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin });
    } else {
      loginWithRedirect();
    }
  };

  const columns = [
    { field: "id", headerName: "ID", type: "number", width: 70 },
    { field: "date_added", headerName: "Date Added", width: 130 },
    {
      field: "title",
      headerName: "Title",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      renderCell: (params) => (
        <a
          href={`/vulnerability-db/${params.row.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.value}
        </a>
      ),
    },
    {
      field: "phase",
      headerName: "Phase",
      width: 130,
      renderCell: (params) => (
        <a
          href={`/vulnerability-db/${params.row.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.value}
        </a>
      ),
    },
    {
      field: "effect",
      headerName: "Effect",
      width: 130,
      renderCell: (params) => (
        <a
          href={`/vulnerability-db/${params.row.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.value}
        </a>
      ),
    },
    {
      field: "attributes",
      headerName: "Attributes",
      width: 130,
      renderCell: (params) => (
        <a
          href={`/vulnerability-db/${params.row.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.value}
        </a>
      ),
    },
  ];

  return (
    <>
      <DefaultNavbar
        transparent
        light
        onAuthClick={handleAuthClick}
        isAuthenticated={isAuthenticated}
      />
      <MKBox
        minHeight="60vh"
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
              variant="h2"
              color="white"
              mt={10}
              sx={({ breakpoints, typography: { size } }) => ({
                [breakpoints.down("md")]: {
                  fontSize: size["3xl"],
                },
              })}
            >
              Vulnerability Search Results
            </MKTypography>
            <MKTypography variant="body1" color="white" opacity={0.8} mt={1} mb={3}>
              Results for your seach is shwon below. See all the vulnerabilities
              <MKTypography
                component="a"
                href="/vulnerability-db"
                // target="_blank"
                rel="noreferrer"
                variant="body2"
                color="white"
                fontWeight="regular"
                sx={{
                  display: "flex",
                  alignItems: "center",

                  "& .material-icons-round": {
                    fontSize: "1.125rem",
                    transform: `translateX(3px)`,
                    transition: "transform 0.2s cubic-bezier(0.34, 1.61, 0.7, 1.3)",
                  },

                  "&:hover .material-icons-round, &:focus .material-icons-round": {
                    transform: `translateX(6px)`,
                  },
                }}
              >
                here.
              </MKTypography>
            </MKTypography>
          </Grid>
        </Container>
      </MKBox>
      <Container sx={{ mt: 4 }}>
        <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
          <Grid sx={{ display: "flex", gap: 2, flexWrap: "nowrap", width: "100%" }}>
            <FormControl fullWidth>
              <InputLabel>Phase</InputLabel>
              <Select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                label="Phase"
                sx={{ padding: 1.5 }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Development">Development</MenuItem>
                <MenuItem value="Training">Training</MenuItem>
                <MenuItem value="Deployment and Use">Deployment and Use</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Attribute</InputLabel>
              <Select
                value={attribute}
                onChange={(e) => setAttribute(e.target.value)}
                label="Attribute"
                sx={{ padding: 1.5 }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Accuracy">Accuracy</MenuItem>
                <MenuItem value="Fairness">Fairness</MenuItem>
                <MenuItem value="Privacy">Privacy</MenuItem>
                <MenuItem value="Reliability">Reliability</MenuItem>
                <MenuItem value="Resiliency">Resiliency</MenuItem>
                <MenuItem value="Robustness">Robustness</MenuItem>
                <MenuItem value="Safety">Safety</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Effect</InputLabel>
              <Select
                value={effect}
                onChange={(e) => setEffect(e.target.value)}
                label="Effect"
                sx={{ padding: 1.5 }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="0: Correct functioning">0: Correct functioning</MenuItem>
                <MenuItem value="1: Reduced functioning">1: Reduced functioning</MenuItem>
                <MenuItem value="2: No actions">2: No actions</MenuItem>
                <MenuItem value="3: Chaotic">3: Chaotic</MenuItem>
                <MenuItem value="4: Directed actions">4: Directed actions</MenuItem>
                <MenuItem value="5: Random actions OoB">5: Random actions OoB</MenuItem>
                <MenuItem value="6: Directed actions OoB">6: Directed actions OoB</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <MKButton
              onClick={clearFilters}
              variant="contained"
              color="primary"
              style={{ cursor: "pointer" }}
            >
              Clear
            </MKButton>
          </Grid>
        </Grid>
        <Paper sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={vulnerabilities}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            sx={{ border: 0 }}
          />
        </Paper>
      </Container>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default SearchResults;

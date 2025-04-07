import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";

import PropTypes from "prop-types";

// react-router components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

function DefaultNavbar({ brand, transparent, light, action, sticky, relative }) {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleAuthClick = async () => {
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin });
    } else {
      await loginWithRedirect();
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 0) {
      try {
        const response = await axios.get(`https://86.50.228.33/api/vulnerability-db/search`, {
          params: { query: value },
        });
        console.log("Search API Response:", response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error?.response?.data || error.message);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const submitEmailIfNew = async () => {
        const reporterId = user.sub;
        const email = user.email;

        try {
          const response = await axios.post("https://86.50.228.33/api/auth/newaccount", {
            reporterId,
            email,
          });
          console.log(response.data.message || "Email submitted successfully");
        } catch (error) {
          if (
            error.response &&
            error.response.status === 400 &&
            error.response.data.message === "User already exists"
          ) {
            console.log("User already exists; no need to submit again.");
          } else {
            console.error("Error submitting email:", error);
          }
        }
      };
      submitEmailIfNew();
    }
  }, [isAuthenticated, user]);

  return (
    <Container sx={sticky ? { position: "sticky", top: 0, zIndex: 10 } : null}>
      <MKBox
        py={1}
        px={{ xs: 4, sm: transparent ? 2 : 3, lg: transparent ? 0 : 2 }}
        my={relative ? 0 : 2}
        mx={relative ? 0 : 3}
        width={relative ? "100%" : "calc(100% - 48px)"}
        borderRadius="xl"
        shadow={transparent ? "none" : "md"}
        color={light ? "white" : "dark"}
        position={relative ? "relative" : "absolute"}
        left={0}
        zIndex={3}
        sx={({ palette: { transparent: transparentColor, white }, functions: { rgba } }) => ({
          backgroundColor: transparent ? transparentColor.main : rgba(white.main, 0.8),
          backdropFilter: transparent ? "none" : `saturate(200%) blur(30px)`,
        })}
      >
        <MKBox display="flex" justifyContent="space-between" alignItems="center">
          <MKBox
            component={Link}
            to="/"
            lineHeight={1}
            py={transparent ? 1.5 : 0.75}
            pl={relative || transparent ? 0 : { xs: 0, lg: 1 }}
          >
            <MKTypography variant="button" fontWeight="bold" color={light ? "white" : "dark"}>
              {brand}
            </MKTypography>
          </MKBox>

          {/* Search Input */}
          <MKBox
            sx={{
              position: "relative",
              flexGrow: 1,
              maxWidth: 400,
              mx: 2,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search vulnerabilities..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearchChange({ target: { value: searchQuery } });
                  navigate(`/api/search-results`)
                }
              }}
              sx={{
                input: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
                "& .MuiInputAdornment-root": {
                  color: "white",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "white",
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "white", marginRight: 1 }} />
                  </InputAdornment>
                ),
              }}
            />

            {searchResults.length > 0 && (
              <Paper
                elevation={3}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  mt: 1,
                  zIndex: 10,
                  borderRadius: 2,
                  p: 1,
                  bgcolor: "white",
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                <List>
                  {searchResults.map((result) => (
                    <ListItem
                      key={result.id}
                      ListItemButton
                      onClick={() => navigate(`/api/vulnerability-db/${result.id}`)}
                    >
                      <ListItemText primary={result.title} secondary={result.date_added} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </MKBox>

          {/* Authentication Button */}
          <MKBox ml={{ xs: "auto", lg: 0 }}>
            <MKButton
              component={Link}
              variant={
                action.color === "white" || action.color === "default" ? "contained" : "gradient"
              }
              color={action.color ? action.color : "info"}
              size="small"
              onClick={handleAuthClick}
            >
              {isAuthenticated ? "Logout" : "Sign in"}
            </MKButton>
          </MKBox>
        </MKBox>
      </MKBox>
    </Container>
  );
}

// Setting default values for the props of DefaultNavbar
DefaultNavbar.defaultProps = {
  brand: "AIVT",
  transparent: false,
  light: false,
  action: false,
  sticky: false,
  relative: false,
  center: false,
};

// Typechecking props for the DefaultNavbar
DefaultNavbar.propTypes = {
  brand: PropTypes.string,
  // routes: PropTypes.arrayOf(PropTypes.shape).isRequired,
  transparent: PropTypes.bool,
  light: PropTypes.bool,
  action: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      type: PropTypes.oneOf(["external", "internal"]).isRequired,
      // route: PropTypes.string.isRequired,
      color: PropTypes.oneOf([
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "dark",
        "light",
        "default",
        "white",
      ]),
      label: PropTypes.string.isRequired,
    }),
  ]),
  sticky: PropTypes.bool,
  relative: PropTypes.bool,
  center: PropTypes.bool,
  onAuthClick: PropTypes.func,
  isAuthenticated: PropTypes.bool,
};

export default DefaultNavbar;

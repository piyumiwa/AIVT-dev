import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// react-router components
import { Link } from "react-router-dom";

// @mui material components
import Container from "@mui/material/Container";
// import Icon from "@mui/material/Icon";
// import Popper from "@mui/material/Popper";
// import Grow from "@mui/material/Grow";
// import Grid from "@mui/material/Grid";
// import Divider from "@mui/material/Divider";
// import MuiLink from "@mui/material/Link";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
// import InputIcon from "layouts/sections/input-areas/inputs/components/InputIcon";

// Material Kit 2 React example components
// import DefaultNavbarDropdown from "examples/Navbars/DefaultNavbar/DefaultNavbarDropdown";
// import DefaultNavbarMobile from "examples/Navbars/DefaultNavbar/DefaultNavbarMobile";

// Material Kit 2 React base styles
// import breakpoints from "assets/theme/base/breakpoints";

function DefaultNavbar({ brand, transparent, light, action, sticky, relative }) {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  const handleAuthClick = async () => {
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin });
    } else {
      await loginWithRedirect();
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const submitEmailIfNew = async () => {
        const reporterId = user.sub;
        const email = user.email;

        try {
          const response = await axios.post("http://localhost:5000/api/auth/newaccount", {
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
          {/* <MKBox sx={{ width: "80%" }}>
            <InputIcon />
          </MKBox> */}
          <MKBox ml={{ xs: "auto", lg: 0 }}>
            <MKButton
              component={Link}
              // to={action.route}
              variant={
                action.color === "white" || action.color === "default" ? "contained" : "gradient"
              }
              color={action.color ? action.color : "info"}
              size="small"
              onClick={handleAuthClick}
            >
              {isAuthenticated ? "Logout" : "Sign in"}
            </MKButton>
            {/* {isAuthenticated && user && (
              <MKTypography variant="caption" color="dark" ml={2}>
                Hello, {user.name}
              </MKTypography>
            )} */}
            {/* (action.type === "internal" ? (
                <MKButton
                  component={Link}
                  to={action.route}
                  variant={
                    action.color === "white" || action.color === "default"
                      ? "contained"
                      : "gradient"
                  }
                  color={action.color ? action.color : "info"}
                  size="small"
                >
                  {action.label}
                </MKButton>
              ) : (
                <MKButton
                  component="a"
                  href={action.route}
                  target="_blank"
                  rel="noreferrer"
                  variant={
                    action.color === "white" || action.color === "default"
                      ? "contained"
                      : "gradient"
                  }
                  color={action.color ? action.color : "info"}
                  size="small"
                >
                  {action.label}
                </MKButton>
              )) */}
          </MKBox>
          {/* <MKBox
            display={{ xs: "inline-block", lg: "none" }}
            lineHeight={0}
            py={1.5}
            pl={1.5}
            color={transparent ? "white" : "inherit"}
            sx={{ cursor: "pointer" }}
            onClick={openMobileNavbar}
          >
            <Icon fontSize="default">{mobileNavbar ? "close" : "menu"}</Icon>
          </MKBox>*/}
        </MKBox>
        {/* <MKBox
          bgColor={transparent ? "white" : "transparent"}
          shadow={transparent ? "lg" : "none"}
          borderRadius="xl"
          px={transparent ? 2 : 0}
        >
          {mobileView && <DefaultNavbarMobile routes={routes} open={mobileNavbar} />}
        </MKBox> */}
      </MKBox>
      {/* {dropdownMenu}
      {nestedDropdownMenu} */}
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

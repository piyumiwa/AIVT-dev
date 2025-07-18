/** 
  All of the routes for the Material Kit 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Navbar.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `name` key is used for the name of the route on the Navbar.
  2. The `icon` key is used for the icon of the route on the Navbar.
  3. The `collapse` key is used for making a collapsible item on the Navbar that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  4. The `route` key is used to store the route location which is used for the react router.
  5. The `href` key is used to store the external links location.
  6. The `component` key is used to store the component of its route.
  7. The `dropdown` key is used to define that the item should open a dropdown for its collapse items .
  8. The `description` key is used to define the description of
          a route under its name.
  9. The `columns` key is used to define that how the content should look inside the dropdown menu as columns,
          you can set the columns amount based on this key.
  10. The `rowsPerColumn` key is used to define that how many rows should be in a column.
*/

// @mui material components
// import Icon from "@mui/material/Icon";

// @mui icons
import GitHubIcon from "@mui/icons-material/GitHub";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArchiveIcon from "@mui/icons-material/Archive";

// // Pages
// import AboutUs from "layouts/pages/landing-pages/about-us";
// import ContactUs from "layouts/pages/landing-pages/contact-us";
// import Author from "layouts/pages/landing-pages/author";
// import SignUp from "pages/LandingPages/SignUp";
import ReportData from "pages/LandingPages/ReportData";
import VulnerabilityDb from "pages/LandingPages/VulnerabilityDb";
// import icon from "assets/theme/components/icon";
// import Vulnerability from "pages/LandingPages/Vulnerability";

const routes = [
  // {
  //   name: "about us",
  //   route: "/about-us",
  //   component: <AboutUs />,
  // },
  // {
  //   name: "contact us",
  //   route: "/contact-us",
  //   component: <ContactUs />,
  // },
  {
    name: "New report",
    icon: <AddCircleIcon />,
    route: "/report-data",
    component: <ReportData />,
  },
  {
    name: "Vulnerability list",
    icon: <ArchiveIcon />,
    route: "/vulnerability-db",
    component: <VulnerabilityDb />,
  },
  {
    name: "github",
    icon: <GitHubIcon />,
    href: "https://github.com/piyumiwa/AIVT-dev.git",
  },
];

export default routes;

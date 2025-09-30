import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "assets/theme";
import Presentation from "layouts/pages/presentation";
import ProtectedRouteReporter from "ProtectedRouteReporter";
import ProtectedRouteWithRole from "ProtectedRouteWithRole";
import ReportData from "pages/LandingPages/ReportData";
import VulnerabilityDb from "pages/LandingPages/VulnerabilityDb";
import Vulnerability from "pages/LandingPages/Vulnerability";
import SignUp from "pages/LandingPages/SignUp";
import SignIn from "pages/LandingPages/SignIn";
import UpdateData from "pages/LandingPages/UpdateData";
import ReviewDb from "pages/LandingPages/ReviewDb";
import ReviewData from "pages/LandingPages/ReviewData";
import RejectedDb from "pages/LandingPages/RejectedDb";
import SearchResults from "pages/LandingPages/SearchResults";
import TnC from "pages/LandingPages/TnC";
import Privacy from "pages/LandingPages/Privacy";
import Licenses from "pages/LandingPages/Licenses";

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Presentation />} />
        <Route path="/report-data" element={<ReportData />} />
        {/* <Route path="/report-data" element={<ProtectedRouteReporter element={ReportData} />} /> */}
        <Route path="/vulnerability-db" element={<VulnerabilityDb />} />
        <Route path="/vulnerability-db/id/:id" element={<Vulnerability />} />
        <Route path="/authentication/sign-up" element={<SignUp />} />
        <Route path="/authentication/sign-in" element={<SignIn />} />
        <Route
          path="/vulnerability-db/editid/:id"
          element={<ProtectedRouteWithRole element={UpdateData} requiredRole="admin" />}
        />
        <Route
          path="/vulnerability-db/edittoken/:token"
          element={<ProtectedRouteReporter element={UpdateData} />}
        />
        <Route
          path="/vulnerability-db/pending"
          element={<ProtectedRouteWithRole element={ReviewDb} />}
        />
        <Route
          path="/vulnerability-db/rejected"
          element={<ProtectedRouteWithRole element={RejectedDb} />}
        />
        <Route
          path="/vulnerability-db/:id/review"
          element={<ProtectedRouteWithRole element={ReviewData} requiredRole="admin" />}
        />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/terms-and-conditions" element={<TnC />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/licenses" element={<Licenses />} />
      </Routes>
    </ThemeProvider>
  );
}

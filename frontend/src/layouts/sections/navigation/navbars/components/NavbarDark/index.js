// Material Kit 2 React components
import MKBox from "components/MKBox";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
// import SignIn from "layouts/pages/authentication/sign-in";

// Routes
import routes from "routes";

// const signInRoute = routes
//   .find((route) => route.name === "pages")
//   ?.collapse.find((collapse) => collapse.name === "account")
//   ?.collapse.find((item) => item.name === "sign in")?.route;

function NavbarDark() {
  return (
    <MKBox variant="gradient" bgColor="dark" shadow="sm" py={0.25}>
      <DefaultNavbar
        routes={routes}
        // action={{
        //   type: "internal",
        //   route: signInRoute,
        //   label: "Sign in",
        //   color: "info",
        // }}
        transparent
        relative
        light
        center
      />
    </MKBox>
  );
}

export default NavbarDark;

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
// import YouTubeIcon from "@mui/icons-material/YouTube";

// Material Kit 2 React components
import MKTypography from "components/MKTypography";

// Images
import logoCT from "assets/images/apple-icon.png";

const date = new Date().getFullYear();

export default {
  brand: {
    name: "AI Vulnerability Taxonomy",
    image: logoCT,
    route: "/",
  },
  socials: [
    {
      icon: <FacebookIcon />,
      // link: "https://www.facebook.com/CreativeTim/",
    },
    {
      icon: <TwitterIcon />,
      // link: "https://twitter.com/creativetim",
    },
    {
      icon: <GitHubIcon />,
      link: "https://github.com/ouspg",
    },
    // {
    //   icon: <YouTubeIcon />,
    //   link: "https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w",
    // },
  ],
  menus: [
    // {
    //   name: "company",
    //   items: [
    //     { name: "about us", href: "/about-us" },
    //     // { name: "freebies", href: "https://www.creative-tim.com/templates/free" },
    //     // { name: "premium tools", href: "https://www.creative-tim.com/templates/premium" },
    //     { name: "blog", href: "/blog" },
    //   ],
    // },
    // {
    //   name: "resources",
    //   items: [
    //     { name: "illustrations", href: "https://iradesign.io/" },
    //     { name: "bits & snippets", href: "https://www.creative-tim.com/bits" },
    //     { name: "affiliate program", href: "https://www.creative-tim.com/affiliates/new" },
    //   ],
    // },
    {
      name: "help & support",
      items: [
        { name: "contact us", href: "/contact-us" },
        // { name: "knowledge center", href: "https://www.creative-tim.com/knowledge-center" },
        // { name: "custom development", href: "https://services.creative-tim.com/" },
        // { name: "sponsorships", href: "https://www.creative-tim.com/sponsorships" },
      ],
    },
    {
      name: "legal",
      items: [
        { name: "terms & conditions", href: "/terms" },
        { name: "privacy policy", href: "/privacy" },
        { name: "licenses (EULA)", href: "/license" },
      ],
    },
  ],
  copyright: (
    <MKTypography variant="button" fontWeight="regular">
      &copy; {date} AIVT by{" "}
      <MKTypography
        component="a"
        href="https://www.ouspg.org"
        target="_blank"
        rel="noreferrer"
        variant="button"
        fontWeight="regular"
      >
        OUSPG
      </MKTypography>
      .
    </MKTypography>
  ),
};

import { useAuth0 } from "@auth0/auth0-react";
import MKButton from "components/MKButton";

const LogoutButton = () => {{
    const { logout, isAuthenticated } = useAuth0();

    return (
        isAuthenticated && (
            <MKButton
            variant="gradient"
            color="info"
            fullWidth
            onClick={() => logout()}
            >
            Log out
            </MKButton>
        )
    )
}};

export default LogoutButton;
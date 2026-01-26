"use client";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../AuthContext";
import Button from "@mui/material/Button";
import { FiLogOut } from "react-icons/fi";

export default function Logout() {
  const { updateToken } = useAuthContext();
  const router = useRouter();

  function handleLogout() {
    updateToken(null);
    router.push("/");
  }

  return (
    <Button
      variant="outlined"
      color="inherit"
      onClick={handleLogout}
      startIcon={<FiLogOut size={16} />}
      sx={{
        textTransform: "none",
        fontWeight: 500,
        borderColor: "grey.300",
        color: "text.secondary",
        "&:hover": {
          borderColor: "grey.400",
          bgcolor: "grey.100",
        },
      }}
    >
      Logout
    </Button>
  );
}

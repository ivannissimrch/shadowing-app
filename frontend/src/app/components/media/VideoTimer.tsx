import getFormattedTime from "../../helpers/getFormattedTime";
import Chip from "@mui/material/Chip";
import { FiClock } from "react-icons/fi";

export default function VideoTimer({ currentTime }: { currentTime: number }) {
  return (
    <Chip
      icon={<FiClock size={14} />}
      label={getFormattedTime(currentTime)}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 500,
        // Force dark colors on light background (grey.50 container)
        color: "grey.700",
        borderColor: "grey.300",
        "& .MuiChip-icon": {
          color: "grey.600",
        },
      }}
    />
  );
}

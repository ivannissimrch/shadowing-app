import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ToggleState } from "./VideoScriptToggle";

interface ToggleButtonsProps {
  toggleState: ToggleState;
  updateToggleState: (newState: ToggleState) => void;
}

export default function ToggleButtons({
  toggleState,
  updateToggleState,
}: ToggleButtonsProps) {
  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      {toggleState === ToggleState.SHOW_BOTH && (
        <>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={() => updateToggleState(ToggleState.SHOW_VIDEO_ONLY)}
            startIcon={<FiEyeOff size={14} />}
            sx={{
              textTransform: "none",
              color: "text.secondary",
              fontSize: "0.75rem",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            Hide script
          </Button>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={() => updateToggleState(ToggleState.SHOW_SCRIPT_ONLY)}
            startIcon={<FiEyeOff size={14} />}
            sx={{
              textTransform: "none",
              color: "text.secondary",
              fontSize: "0.75rem",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            Hide video
          </Button>
        </>
      )}
      {toggleState === ToggleState.SHOW_SCRIPT_ONLY && (
        <Button
          size="small"
          variant="text"
          color="inherit"
          onClick={() => updateToggleState(ToggleState.SHOW_BOTH)}
          startIcon={<FiEye size={14} />}
          sx={{
            textTransform: "none",
            color: "text.secondary",
            fontSize: "0.75rem",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          Show video
        </Button>
      )}
      {toggleState === ToggleState.SHOW_VIDEO_ONLY && (
        <Button
          size="small"
          variant="text"
          color="inherit"
          onClick={() => updateToggleState(ToggleState.SHOW_BOTH)}
          startIcon={<FiEye size={14} />}
          sx={{
            textTransform: "none",
            color: "text.secondary",
            fontSize: "0.75rem",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          Show script
        </Button>
      )}
    </Box>
  );
}

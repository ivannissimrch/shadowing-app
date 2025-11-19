import { Button } from "../ui/Button/Button";
import styles from "./ToggleButtons.module.css";
import { ToggleState } from "./VideoScriptToggle";

interface ToggleButtonsProps {
  toggleState: ToggleState;
  updateToggleState: (newState: ToggleState) => void;
}

// Hides script, shows only videos
function HideScriptButton({ updateToggleState }: ToggleButtonsProps) {
  return (
    <Button
      variant="ghost"
      onClick={() => updateToggleState(ToggleState.SHOW_VIDEO_ONLY)}
    >
      hide script
    </Button>
  );
}
// Hides video, shows only script
function HideVideoButton({ updateToggleState }: ToggleButtonsProps) {
  return (
    <Button
      variant="ghost"
      onClick={() => updateToggleState(ToggleState.SHOW_SCRIPT_ONLY)}
    >
      hide video
    </Button>
  );
}
// Shows script back (returns to both visible)
function ShowScriptButton({ updateToggleState }: ToggleButtonsProps) {
  return (
    <Button
      variant="ghost"
      onClick={() => updateToggleState(ToggleState.SHOW_BOTH)}
    >
      show script
    </Button>
  );
}
// Shows video back (returns to both visible)
function ShowVideoButton({ updateToggleState }: ToggleButtonsProps) {
  return (
    <Button
      variant="ghost"
      onClick={() => updateToggleState(ToggleState.SHOW_BOTH)}
    >
      show video
    </Button>
  );
}

export default function ToggleButtons({
  toggleState,
  updateToggleState,
}: ToggleButtonsProps) {
  return (
    <div className={styles.toggleButtonsContainer}>
      {toggleState === ToggleState.SHOW_BOTH && (
        <>
          <HideScriptButton
            toggleState={toggleState}
            updateToggleState={updateToggleState}
          />
          <HideVideoButton
            toggleState={toggleState}
            updateToggleState={updateToggleState}
          />
        </>
      )}
      {toggleState === ToggleState.SHOW_SCRIPT_ONLY && (
        <ShowVideoButton
          toggleState={toggleState}
          updateToggleState={updateToggleState}
        />
      )}
      {toggleState === ToggleState.SHOW_VIDEO_ONLY && (
        <ShowScriptButton
          toggleState={toggleState}
          updateToggleState={updateToggleState}
        />
      )}
    </div>
  );
}

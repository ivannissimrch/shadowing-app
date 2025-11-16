import styles from "./ToggleButtons.module.css";
import { ToggleState } from "./VideoScriptToggle";

interface ToggleButtonsProps {
  toggleState: ToggleState;
  updateToggleState: (newState: ToggleState) => void;
}

// Hides script, shows only videos
function HideScriptButton({ updateToggleState }: ToggleButtonsProps) {
  return (
    <button
      className={styles.toggleScript}
      onClick={() => updateToggleState(ToggleState.SHOW_VIDEO_ONLY)}
    >
      hide script
    </button>
  );
}
// Hides video, shows only script
function HideVideoButton({ updateToggleState }: ToggleButtonsProps) {
  return (
    <button
      className={styles.toggleVideo}
      onClick={() => updateToggleState(ToggleState.SHOW_SCRIPT_ONLY)}
    >
      hide video
    </button>
  );
}
// Shows script back (returns to both visible)
function ShowScriptButton({ updateToggleState }: ToggleButtonsProps) {
  return (
    <button
      className={styles.toggleScript}
      onClick={() => updateToggleState(ToggleState.SHOW_BOTH)}
    >
      show script
    </button>
  );
}
// Shows video back (returns to both visible)
function ShowVideoButton({ updateToggleState }: ToggleButtonsProps) {
  return (
    <button
      className={styles.toggleVideo}
      onClick={() => updateToggleState(ToggleState.SHOW_BOTH)}
    >
      show video
    </button>
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

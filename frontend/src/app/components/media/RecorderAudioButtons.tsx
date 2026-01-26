import { Lesson } from "@/app/Types";
import { useRecorderPanelContext } from "@/app/RecorderpanelContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FiTrash2, FiSend } from "react-icons/fi";

export default function RecorderAudioButtons({
  selectedLesson,
}: {
  selectedLesson: Lesson | undefined;
}) {
  const { dispatch, handleSubmit, isAudioMutating, isLessonMutating } =
    useRecorderPanelContext();
  const isSubmitting = isAudioMutating || isLessonMutating;

  if (selectedLesson?.status === "completed") {
    return null;
  } else {
    return (
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            dispatch({ type: "RESET" });
          }}
          disabled={isSubmitting}
          startIcon={<FiTrash2 size={16} />}
          sx={{ textTransform: "none", fontWeight: 500 }}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={<FiSend size={16} />}
          sx={{ textTransform: "none", fontWeight: 500 }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    );
  }
}

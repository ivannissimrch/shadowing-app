import { useTranslations } from "next-intl";
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
  const tCommon = useTranslations("common");
  const {
    dispatch,
    handleSubmit,
    handleDeleteSubmission,
    isAudioMutating,
    isLessonMutating,
    isDeleting,
  } = useRecorderPanelContext();
  const isSubmitting = isAudioMutating || isLessonMutating;

  if (selectedLesson?.status === "completed") {
    return null;
  }

  if (selectedLesson?.status === "submitted") {
    return (
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteSubmission}
          disabled={isDeleting}
          startIcon={<FiTrash2 size={16} />}
          sx={{ textTransform: "none", fontWeight: 500 }}
        >
          {isDeleting ? tCommon("deleting") : tCommon("deleteAndResubmit")}
        </Button>
      </Box>
    );
  }

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
        {tCommon("delete")}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={isSubmitting}
        startIcon={<FiSend size={16} />}
        sx={{ textTransform: "none", fontWeight: 500 }}
      >
        {isSubmitting ? tCommon("submitting") : tCommon("submit")}
      </Button>
    </Box>
  );
}

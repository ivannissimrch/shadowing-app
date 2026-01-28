"use client";
import { useTranslations } from "next-intl";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { ErrorBoundary } from "react-error-boundary";
import useAddLesson from "../../hooks/useAddLesson";
import { FiUpload } from "react-icons/fi";

interface AddLessonProps {
  isAddLessonDialogOpen: boolean;
  closeAddLessonDialog: () => void;
}

export default function AddLesson({
  isAddLessonDialogOpen,
  closeAddLessonDialog,
}: AddLessonProps) {
  const t = useTranslations("teacher");
  const tLesson = useTranslations("lesson");
  const tCommon = useTranslations("common");
  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
  } = useAlertMessageStyles();

  const {
    errorMessage,
    formData,
    selectedImage,
    isMutatingLesson,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
  } = useAddLesson(closeAddLessonDialog);

  return (
    <ErrorBoundary fallback={<div>Something went wrong.</div>}>
      <StyledDialog
        aria-modal="true"
        open={isAddLessonDialogOpen}
        onClose={closeAddLessonDialog}
        aria-labelledby="add-lesson-dialog-title"
        disableScrollLock={true}
        keepMounted={false}
        autoFocus={true}
      >
        <DialogTitle
          id="add-lesson-dialog-title"
          sx={{
            fontWeight: 600,
            fontSize: "1.25rem",
            color: "text.primary",
            pb: 1,
          }}
        >
          {t("addLesson")}
        </DialogTitle>
        <StyledDialogContent>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="lesson-title">{tLesson("title")}</label>
              <input
                id="lesson-title"
                type="text"
                placeholder={t("enterLessonTitle")}
                required
                aria-required="true"
                aria-invalid={errorMessage ? "true" : "false"}
                aria-describedby={errorMessage ? "add-lesson-error" : undefined}
                value={formData.title}
                onChange={handleInputChange}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="video-id">{tLesson("videoUrl")}</label>
              <input
                id="video-id"
                type="text"
                placeholder={t("enterVideoUrl")}
                required
                aria-required="true"
                aria-invalid={errorMessage ? "true" : "false"}
                aria-describedby={errorMessage ? "add-lesson-error" : undefined}
                value={formData.videoId}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="image-upload">{t("uploadImage")}</label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                required
                aria-required="true"
                onChange={handleImageUpload}
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              />
              <Box
                component="label"
                htmlFor="image-upload"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  p: 1.5,
                  border: "1px solid",
                  borderColor: selectedImage ? "primary.main" : "grey.300",
                  borderRadius: 1,
                  cursor: "pointer",
                  color: selectedImage ? "text.primary" : "text.secondary",
                  bgcolor: selectedImage ? "primary.light" : "transparent",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "primary.light",
                  },
                }}
              >
                <FiUpload size={16} />
                {selectedImage ? selectedImage.name : t("chooseImageFile")}
              </Box>
            </div>
            {errorMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Alert>
            )}
          </form>
        </StyledDialogContent>
        <StyledDialogActions>
          <StyledButton variant="outlined" onClick={closeAddLessonDialog}>
            {tCommon("cancel")}
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            disabled={isMutatingLesson}
          >
            {isMutatingLesson ? tCommon("adding") : t("addLesson")}
          </StyledButton>
        </StyledDialogActions>
      </StyledDialog>
    </ErrorBoundary>
  );
}

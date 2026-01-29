"use client";
import { useTranslations } from "next-intl";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { ErrorBoundary } from "react-error-boundary";
import useAddLesson, { VideoType, ScriptType } from "../../hooks/useAddLesson";
import { FiUpload, FiVideo, FiFileText } from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import RichTextEditor from "../ui/RichTextEditor";

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
    selectedVideo,
    videoType,
    scriptType,
    scriptText,
    isMutatingLesson,
    handleInputChange,
    handleImageUpload,
    handleVideoUpload,
    handleVideoTypeChange,
    handleScriptTypeChange,
    handleScriptTextChange,
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
                value={formData.title || ""}
                onChange={handleInputChange}
                autoFocus
              />
            </div>

            {/* Video Type Toggle */}
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t("videoSource") || "Video Source"}
              </Typography>
              <ToggleButtonGroup
                value={videoType}
                exclusive
                onChange={(_e, newValue: VideoType | null) => {
                  if (newValue !== null) {
                    handleVideoTypeChange(newValue);
                  }
                }}
                aria-label="video source type"
                size="small"
                fullWidth
                sx={{
                  "& .MuiToggleButton-root": {
                    color: "text.primary",
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                  },
                }}
              >
                <ToggleButton value="youtube" aria-label="YouTube video">
                  <FaYoutube style={{ marginRight: 8 }} />
                  YouTube
                </ToggleButton>
                <ToggleButton value="cloudinary" aria-label="Upload video">
                  <FiVideo style={{ marginRight: 8 }} />
                  {t("uploadVideo") || "Upload Video"}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Conditional Video Input */}
            {videoType === 'youtube' ? (
              <div key="youtube-input">
                <label htmlFor="video-id">{tLesson("videoUrl")}</label>
                <input
                  id="video-id"
                  type="text"
                  placeholder={t("enterVideoUrl")}
                  required
                  aria-required="true"
                  aria-invalid={errorMessage ? "true" : "false"}
                  aria-describedby={errorMessage ? "add-lesson-error" : undefined}
                  value={formData.videoId ?? ""}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              <div key="video-upload-input">
                <label htmlFor="video-upload">{t("uploadVideo") || "Upload Video"}</label>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska"
                  required
                  aria-required="true"
                  onChange={handleVideoUpload}
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
                  htmlFor="video-upload"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    p: 1.5,
                    border: "1px solid",
                    borderColor: selectedVideo ? "primary.main" : "grey.300",
                    borderRadius: 1,
                    cursor: "pointer",
                    color: selectedVideo ? "text.primary" : "text.secondary",
                    bgcolor: selectedVideo ? "primary.light" : "transparent",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "primary.light",
                    },
                  }}
                >
                  <FiVideo size={16} />
                  {selectedVideo ? selectedVideo.name : (t("chooseVideoFile") || "Choose video file")}
                </Box>
                <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "text.secondary" }}>
                  {t("videoFormats") || "Supported: MP4, WebM, MOV, AVI, MKV (max 100MB)"}
                </Typography>
              </div>
            )}

            {/* Script Type Toggle */}
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t("scriptSource") || "Script Source"}
              </Typography>
              <ToggleButtonGroup
                value={scriptType}
                exclusive
                onChange={(_e, newValue: ScriptType | null) => {
                  if (newValue !== null) {
                    handleScriptTypeChange(newValue);
                  }
                }}
                aria-label="script source type"
                size="small"
                fullWidth
                sx={{
                  "& .MuiToggleButton-root": {
                    color: "text.primary",
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                  },
                }}
              >
                <ToggleButton value="image" aria-label="Upload image">
                  <FiUpload style={{ marginRight: 8 }} />
                  {t("uploadImage")}
                </ToggleButton>
                <ToggleButton value="text" aria-label="Formatted text">
                  <FiFileText style={{ marginRight: 8 }} />
                  {t("formattedText") || "Formatted Text"}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Conditional Script Input */}
            {scriptType === 'image' ? (
              <div key="image-upload-input">
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
            ) : (
              <div key="text-editor-input">
                <label>{t("lessonScript") || "Lesson Script"}</label>
                <RichTextEditor
                  value={scriptText}
                  onChange={handleScriptTextChange}
                  placeholder={t("pasteScriptHere") || "Paste your lesson script here..."}
                />
                <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "text.secondary" }}>
                  {t("scriptHint") || "Paste from PowerPoint to keep formatting (bold, colors, lists)"}
                </Typography>
              </div>
            )}
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

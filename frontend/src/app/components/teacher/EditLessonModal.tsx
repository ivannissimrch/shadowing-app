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
import useEditLesson, { VideoType, ScriptType } from "../../hooks/useEditLesson";
import { FiUpload, FiVideo, FiFileText, FiCheck } from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import RichTextEditor from "../ui/RichTextEditor";
import { Lesson } from "../../Types";

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
}

export default function EditLessonModal({
  isOpen,
  onClose,
  lesson,
}: EditLessonModalProps) {
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
    hasVideoChanged,
    hasImageChanged,
    isMutatingLesson,
    handleInputChange,
    handleImageUpload,
    handleVideoUpload,
    handleVideoTypeChange,
    handleScriptTypeChange,
    handleScriptTextChange,
    handleSubmit,
  } = useEditLesson(lesson, onClose);

  return (
    <ErrorBoundary fallback={<div>Something went wrong.</div>}>
      <StyledDialog
        aria-modal="true"
        open={isOpen}
        onClose={onClose}
        aria-labelledby="edit-lesson-dialog-title"
        disableScrollLock={true}
        keepMounted={false}
        autoFocus={true}
      >
        <DialogTitle
          id="edit-lesson-dialog-title"
          sx={{
            fontWeight: 600,
            fontSize: "1.25rem",
            color: "text.primary",
            pb: 1,
          }}
        >
          {t("editLesson") || "Edit Lesson"}
        </DialogTitle>
        <StyledDialogContent>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="edit-lesson-title">{tLesson("title")}</label>
              <input
                id="edit-lesson-title"
                type="text"
                placeholder={t("enterLessonTitle")}
                required
                aria-required="true"
                aria-invalid={errorMessage ? "true" : "false"}
                value={formData.title || ""}
                onChange={handleInputChange}
                autoFocus
              />
            </div>

            {/* Category Input */}
            <div>
              <label htmlFor="edit-lesson-category">{t("category") || "Category"}</label>
              <input
                id="edit-lesson-category"
                type="text"
                placeholder={t("enterCategory") || "e.g., Vowel sounds, Intonation..."}
                value={formData.category || ""}
                onChange={handleInputChange}
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
                <label htmlFor="edit-video-id">{tLesson("videoUrl")}</label>
                <input
                  id="edit-video-id"
                  type="text"
                  placeholder={t("enterVideoUrl")}
                  required
                  aria-required="true"
                  value={formData.videoId ?? ""}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              <div key="video-upload-input">
                <label htmlFor="edit-video-upload">{t("uploadVideo") || "Upload Video"}</label>
                <input
                  id="edit-video-upload"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska"
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
                  htmlFor="edit-video-upload"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    p: 1.5,
                    border: "1px solid",
                    borderColor: selectedVideo || (!hasVideoChanged && lesson?.cloudinary_public_id)
                      ? "primary.main"
                      : "grey.300",
                    borderRadius: 1,
                    cursor: "pointer",
                    color: selectedVideo || (!hasVideoChanged && lesson?.cloudinary_public_id)
                      ? "text.primary"
                      : "text.secondary",
                    bgcolor: selectedVideo || (!hasVideoChanged && lesson?.cloudinary_public_id)
                      ? "primary.light"
                      : "transparent",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "primary.light",
                    },
                  }}
                >
                  {selectedVideo ? (
                    <>
                      <FiVideo size={16} />
                      {selectedVideo.name}
                    </>
                  ) : !hasVideoChanged && lesson?.cloudinary_public_id ? (
                    <>
                      <FiCheck size={16} />
                      {t("currentVideoKept") || "Current video (click to change)"}
                    </>
                  ) : (
                    <>
                      <FiVideo size={16} />
                      {t("chooseVideoFile") || "Choose video file"}
                    </>
                  )}
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
                <label htmlFor="edit-image-upload">{t("uploadImage")}</label>
                <input
                  id="edit-image-upload"
                  type="file"
                  accept="image/*"
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
                  htmlFor="edit-image-upload"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    p: 1.5,
                    border: "1px solid",
                    borderColor: selectedImage || (!hasImageChanged && lesson?.image)
                      ? "primary.main"
                      : "grey.300",
                    borderRadius: 1,
                    cursor: "pointer",
                    color: selectedImage || (!hasImageChanged && lesson?.image)
                      ? "text.primary"
                      : "text.secondary",
                    bgcolor: selectedImage || (!hasImageChanged && lesson?.image)
                      ? "primary.light"
                      : "transparent",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "primary.light",
                    },
                  }}
                >
                  {selectedImage ? (
                    <>
                      <FiUpload size={16} />
                      {selectedImage.name}
                    </>
                  ) : !hasImageChanged && lesson?.image ? (
                    <>
                      <FiCheck size={16} />
                      {t("currentImageKept") || "Current image (click to change)"}
                    </>
                  ) : (
                    <>
                      <FiUpload size={16} />
                      {t("chooseImageFile")}
                    </>
                  )}
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
          <StyledButton variant="outlined" onClick={onClose}>
            {tCommon("cancel")}
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            disabled={isMutatingLesson}
          >
            {isMutatingLesson ? tCommon("saving") || "Saving..." : tCommon("save") || "Save"}
          </StyledButton>
        </StyledDialogActions>
      </StyledDialog>
    </ErrorBoundary>
  );
}

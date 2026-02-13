"use client";
import { useTranslations } from "next-intl";
import DialogTitle from "@mui/material/DialogTitle";
import { ErrorBoundary } from "react-error-boundary";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import StudentSelect from "../student/StudentSelect";
import { mutate } from "swr";
import { API_PATHS } from "../../constants/apiKeys";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";
import { useFormModal } from "@/app/hooks/useFormModal";

interface AssignCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  listName: string;
}

interface AssignCourseResponse {
  success: boolean;
  message: string;
  data: { assignedCount: number };
}

export default function AssignCourseModal({
  isOpen,
  onClose,
  listId,
  listName,
}: AssignCourseModalProps) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const form = useFormModal({ selectedStudent: "" });
  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
    StyledFormControl,
  } = useAlertMessageStyles();
  const { trigger, isMutating } = useSWRMutationHook<
    AssignCourseResponse,
    { studentId: string }
  >(API_PATHS.ASSIGN_COURSE(listId), { method: "POST" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    form.clearErrors();

    try {
      await trigger({ studentId: form.fields.selectedStudent });
      mutate(API_PATHS.STUDENTS_WITH_LESSONS);
      mutate(API_PATHS.LESSONS);
      form.reset();
      onClose();
    } catch (err) {
      form.setFormError(
        err instanceof Error ? err.message : tErrors("failedToSave")
      );
    }
  };

  return (
    <StyledDialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="assign-course-dialog-title"
      aria-modal="true"
      disableScrollLock={true}
      keepMounted={false}
      autoFocus={true}
    >
      <DialogTitle
        id="assign-course-dialog-title"
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
          color: "text.primary",
          pb: 1,
        }}
      >
        {t("assignCourse")}: {listName}
      </DialogTitle>
      <StyledDialogContent>
        <form onSubmit={handleSubmit}>
          <div>
            <ErrorBoundary fallback={<div>{tErrors("failedToLoad")}</div>}>
              <StudentSelect
                selectedStudent={form.fields.selectedStudent}
                onStudentChange={(value) =>
                  form.setField("selectedStudent", value)
                }
                StyledFormControl={StyledFormControl}
              />
            </ErrorBoundary>
          </div>
          {form.errors.form && (
            <p
              role="alert"
              aria-live="assertive"
              style={{ color: "#f44336", marginTop: "8px", fontSize: "14px" }}
            >
              {form.errors.form}
            </p>
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
          disabled={isMutating || !form.fields.selectedStudent}
          aria-label={`${t("assignCourse")} "${listName}"`}
        >
          {isMutating ? t("assigningCourse") : t("assignCourse")}
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}

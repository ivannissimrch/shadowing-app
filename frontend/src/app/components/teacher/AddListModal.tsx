"use client";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { mutate } from "swr";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { API_PATHS } from "../../constants/apiKeys";
import { List } from "@/app/Types";
import { useFormModal } from "@/app/hooks/useFormModal";

interface AddListModalProps {
  isOpen: boolean;
  onClose: () => void;
  list?: List | null;
}

export default function AddListModal({
  isOpen,
  onClose,
  list,
}: AddListModalProps) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const isEditing = !!list;

  const form = useFormModal({
    name: "",
    description: "",
  });

  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
    StyledFormControl,
  } = useAlertMessageStyles();

  const { trigger: createTrigger, isMutating: isCreating } = useSWRMutationHook<
    List,
    { name: string; description: string }
  >(API_PATHS.CREATE_LIST, { method: "POST" });

  const { trigger: updateTrigger, isMutating: isUpdating } = useSWRMutationHook<
    List,
    { name: string; description: string }
  >(list ? API_PATHS.LIST(list.id) : null, { method: "PATCH" });

  const isMutating = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen && list) {
      form.setField("name", list.name);
      form.setField("description", list.description || "");
    } else if (isOpen) {
      form.setField("name", "");
      form.setField("description", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, list]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    form.clearErrors();

    if (!form.fields.name.trim()) {
      form.setFormError(tErrors("fillAllFields"));
      return;
    }

    try {
      if (isEditing) {
        await updateTrigger({
          name: form.fields.name.trim(),
          description: form.fields.description.trim(),
        });
        mutate(API_PATHS.LIST(list.id));
      } else {
        await createTrigger({
          name: form.fields.name.trim(),
          description: form.fields.description.trim(),
        });
      }
      mutate(API_PATHS.ALL_LISTS);
      form.reset();
      onClose();
    } catch (err) {
      form.setFormError(
        err instanceof Error ? err.message : tErrors("failedToSave")
      );
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="add-list-dialog-title"
      aria-modal="true"
      disableScrollLock={true}
      keepMounted={false}
      autoFocus={true}
    >
      <DialogTitle
        id="add-list-dialog-title"
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
          color: "text.primary",
          pb: 1,
        }}
      >
        {isEditing ? t("editList") : t("createList")}
      </DialogTitle>
      <StyledDialogContent>
        <form onSubmit={handleSubmit}>
          <StyledFormControl fullWidth>
            <TextField
              label={t("listName")}
              value={form.fields.name}
              onChange={(e) => form.setField("name", e.target.value)}
              placeholder={t("enterListName")}
              fullWidth
              required
              autoFocus
            />
          </StyledFormControl>
          <StyledFormControl fullWidth>
            <TextField
              label={t("listDescription")}
              value={form.fields.description}
              onChange={(e) => form.setField("description", e.target.value)}
              placeholder={t("enterListDescription")}
              fullWidth
              multiline
              rows={2}
            />
          </StyledFormControl>
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
        <StyledButton variant="outlined" onClick={handleClose}>
          {tCommon("cancel")}
        </StyledButton>
        <StyledButton
          variant="contained"
          onClick={handleSubmit}
          disabled={isMutating || !form.fields.name.trim()}
        >
          {isMutating
            ? tCommon("saving")
            : isEditing
              ? tCommon("save")
              : tCommon("add")}
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}

"use client";
import { useTranslations } from "next-intl";
import DialogTitle from "@mui/material/DialogTitle";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { mutate } from "swr";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { API_PATHS } from "../../constants/apiKeys";
import { List } from "@/app/Types";
import { useAlertContext } from "@/app/AlertContext";

interface DeleteListModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  listName: string;
}

export default function DeleteListModal({
  isOpen,
  onClose,
  listId,
  listName,
}: DeleteListModalProps) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const { openAlertDialog } = useAlertContext();

  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
    StyledErrorButton,
  } = useAlertMessageStyles();

  const { trigger } = useSWRMutationHook(API_PATHS.LIST(listId), {
    method: "DELETE",
  });

  const handleDelete = async () => {
    onClose();
    try {
      await mutate(
        API_PATHS.ALL_LISTS,
        async (currentLists: List[] | undefined) => {
          await trigger(undefined);
          return (
            currentLists?.filter((list) => list.id !== listId) ?? []
          );
        },
        {
          optimisticData: (currentLists: List[] | undefined) =>
            currentLists?.filter((list) => list.id !== listId) ?? [],
          rollbackOnError: true,
          revalidate: false,
        }
      );
    } catch {
      openAlertDialog(
        tErrors("failedToDelete"),
        t("couldNotDeleteList", { name: listName })
      );
    }
  };

  return (
    <StyledDialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="delete-list-dialog-title"
      disableScrollLock={true}
      keepMounted={false}
      autoFocus={true}
      aria-modal="true"
    >
      <DialogTitle
        id="delete-list-dialog-title"
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
          color: "text.primary",
          pb: 1,
        }}
      >
        {t("deleteList")}
      </DialogTitle>
      <StyledDialogContent>
        <p>{t("confirmDeleteListMessage", { name: listName })}</p>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton variant="outlined" onClick={onClose}>
          {tCommon("cancel")}
        </StyledButton>
        <StyledErrorButton
          variant="contained"
          onClick={handleDelete}
          aria-label={`${t("deleteList")} ${listName}`}
        >
          {t("deleteList")}
        </StyledErrorButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}

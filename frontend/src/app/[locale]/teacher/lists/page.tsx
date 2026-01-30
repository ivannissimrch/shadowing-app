"use client";
import { useTranslations } from "next-intl";
import { ErrorBoundary } from "react-error-boundary";
import AddListModal from "@/app/components/teacher/AddListModal";
import ListsView from "@/app/components/teacher/ListsView";
import ErrorFallback from "@/app/components/ui/ErrorFallback";
import MainCard from "@/app/components/ui/MainCard";
import useModal from "@/app/hooks/useModal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FiPlus } from "react-icons/fi";
import { mutate } from "swr";
import { API_PATHS } from "@/app/constants/apiKeys";

export default function ListsPage() {
  const t = useTranslations("navigation");
  const tTeacher = useTranslations("teacher");
  const addListModal = useModal();

  return (
    <Box>
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}
      >
        {t("lists")}
      </Typography>

      {/* Lists */}
      <MainCard
        title={tTeacher("myLists")}
        secondary={
          <Button
            variant="contained"
            size="small"
            onClick={() => addListModal.openModal()}
            startIcon={<FiPlus size={14} />}
            sx={{ textTransform: "none" }}
          >
            {tTeacher("createList")}
          </Button>
        }
      >
        <ErrorBoundary
          fallbackRender={(props) => (
            <ErrorFallback {...props} title={tTeacher("errorLoadingLists")} />
          )}
          onReset={() => {
            mutate(API_PATHS.ALL_LISTS, undefined, { revalidate: true });
          }}
        >
          <ListsView />
        </ErrorBoundary>
      </MainCard>

      {/* Add List Modal */}
      <AddListModal
        isOpen={addListModal.isModalOpen}
        onClose={() => addListModal.closeModal()}
      />
    </Box>
  );
}

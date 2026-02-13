"use client";
import { use, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ErrorBoundary } from "react-error-boundary";
import { mutate } from "swr";
import { useSWRAxios } from "@/app/hooks/useSWRAxios";
import useModal from "@/app/hooks/useModal";
import api from "@/app/helpers/axiosFetch";
import { API_PATHS } from "@/app/constants/apiKeys";
import { ListWithLessons, Lesson } from "@/app/Types";
import ErrorFallback from "@/app/components/ui/ErrorFallback";
import MainCard from "@/app/components/ui/MainCard";
import CardGrid from "@/app/components/ui/CardGrid";
import AddListModal from "@/app/components/teacher/AddListModal";
import AddLessonsToListModal from "@/app/components/teacher/AddLessonsToListModal";
import AssignLessonModal from "@/app/components/teacher/AssignLessonModal";
import AssignCourseModal from "@/app/components/teacher/AssignCourseModal";
import EditLessonModal from "@/app/components/teacher/EditLessonModal";
import DeleteLessonModal from "@/app/components/teacher/DeleteLessonModal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import {
  FiPlus,
  FiEdit2,
  FiBook,
  FiEye,
  FiUserPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import Transitions from "@/app/components/ui/Transitions";

interface ListDetailContentProps {
  listId: string;
}

function ListDetailContent({ listId }: ListDetailContentProps) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("navigation");

  const { data: list, isLoading } = useSWRAxios<ListWithLessons>(
    API_PATHS.LIST(listId)
  );

  const editListModal = useModal();
  const addLessonsModal = useModal();
  const assignCourseModal = useModal();

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [assignLesson, setAssignLesson] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [removingLessonId, setRemovingLessonId] = useState<string | null>(null);
  const [viewingLessonId, setViewingLessonId] = useState<string | null>(null);

  const handleRemoveFromList = async (lesson: Lesson) => {
    setRemovingLessonId(lesson.id);
    try {
      await api.delete(API_PATHS.LIST_REMOVE_LESSON(listId, lesson.id));
      mutate(API_PATHS.LIST(listId));
      mutate(API_PATHS.ALL_LISTS);
    } finally {
      setRemovingLessonId(null);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!list) {
    return (
      <Typography color="error" sx={{ py: 4, textAlign: "center" }}>
        {t("listNotFound")}
      </Typography>
    );
  }

  const existingLessonIds = list.lessons.map((l) => l.id);

  return (
    <Transitions type="fade">
      <Box>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          href="/teacher/lists"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          {tNav("lists")}
        </Link>
        <Typography color="text.primary">{list.name}</Typography>
      </Breadcrumbs>

      {/* Page Title with Edit */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          {list.name}
        </Typography>
        <Tooltip title={t("editList")}>
          <IconButton
            onClick={() => editListModal.openModal()}
            size="small"
            color="primary"
          >
            <FiEdit2 size={18} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Description */}
      {list.description && (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {list.description}
        </Typography>
      )}

      {/* Lessons Card */}
      <MainCard
        title={`${t("lessonsCount")} (${list.lessons.length})`}
        secondary={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => assignCourseModal.openModal()}
              startIcon={<FiUserPlus size={14} />}
              sx={{ textTransform: "none" }}
            >
              {t("assignCourse")}
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => addLessonsModal.openModal()}
              startIcon={<FiPlus size={14} />}
              sx={{ textTransform: "none" }}
            >
              {t("addLessons")}
            </Button>
          </Box>
        }
      >
        {list.lessons.length === 0 ? (
          <Typography
            color="text.secondary"
            sx={{ py: 4, textAlign: "center" }}
          >
            {t("noLessonsInList")}
          </Typography>
        ) : (
          <CardGrid>
            {list.lessons.map((lesson) => (
              <MuiCard
                key={lesson.id}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {/* Category Badge */}
                {lesson.category && (
                  <Chip
                    label={lesson.category}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "secondary.light",
                      color: "secondary.dark",
                      fontWeight: 500,
                      fontSize: "0.7rem",
                      height: 22,
                    }}
                  />
                )}

                <CardContent
                  sx={{ flexGrow: 1, pb: 1, pt: lesson.category ? 4 : 2 }}
                >
                  {/* Icon */}
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "primary.light",
                        color: "primary.main",
                        width: 56,
                        height: 56,
                      }}
                    >
                      <FiBook size={28} />
                    </Avatar>
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      textAlign: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {lesson.title}
                  </Typography>
                </CardContent>

                <CardActions
                  sx={{ p: 2, pt: 0, flexDirection: "column", gap: 1 }}
                >
                  {/* View Button */}
                  <Button
                    component={Link}
                    href={`/teacher/lesson/${lesson.id}`}
                    variant="outlined"
                    fullWidth
                    startIcon={
                      viewingLessonId !== lesson.id ? (
                        <FiEye size={16} />
                      ) : undefined
                    }
                    disabled={viewingLessonId === lesson.id}
                    onClick={() => setViewingLessonId(lesson.id)}
                    sx={{ textTransform: "none", fontWeight: 500 }}
                  >
                    {viewingLessonId === lesson.id
                      ? tCommon("loading")
                      : t("viewLesson")}
                  </Button>

                  {/* Action Buttons Row */}
                  <Box sx={{ display: "flex", width: "100%", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<FiUserPlus size={16} />}
                      onClick={() =>
                        setAssignLesson({ id: lesson.id, title: lesson.title })
                      }
                      sx={{ textTransform: "none", fontWeight: 500, flex: 1 }}
                      size="small"
                    >
                      {t("assignLesson")}
                    </Button>
                    <Tooltip title={t("editLesson")}>
                      <IconButton
                        onClick={() => setSelectedLesson(lesson)}
                        color="primary"
                        size="small"
                        aria-label={`${t("editLesson")} ${lesson.title}`}
                      >
                        <FiEdit2 size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("removeFromList")}>
                      <IconButton
                        onClick={() => handleRemoveFromList(lesson)}
                        color="warning"
                        size="small"
                        disabled={removingLessonId === lesson.id}
                        aria-label={`${t("removeFromList")} ${lesson.title}`}
                      >
                        {removingLessonId === lesson.id ? (
                          <CircularProgress size={16} />
                        ) : (
                          <FiX size={16} />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("deleteLesson")}>
                      <IconButton
                        onClick={() =>
                          setLessonToDelete({
                            id: lesson.id,
                            title: lesson.title,
                          })
                        }
                        color="error"
                        size="small"
                        aria-label={`${t("deleteLesson")} ${lesson.title}`}
                      >
                        <FiTrash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </MuiCard>
            ))}
          </CardGrid>
        )}
      </MainCard>

      <AddListModal
        isOpen={editListModal.isModalOpen}
        onClose={() => editListModal.closeModal()}
        list={{
          ...list,
          lesson_count: list.lessons.length,
        }}
      />

      <AddLessonsToListModal
        isOpen={addLessonsModal.isModalOpen}
        onClose={() => addLessonsModal.closeModal()}
        listId={listId}
        existingLessonIds={existingLessonIds}
      />

      {assignLesson && (
        <AssignLessonModal
          isOpen={!!assignLesson}
          onClose={() => setAssignLesson(null)}
          lessonId={assignLesson.id}
          lessonTitle={assignLesson.title}
        />
      )}

      <EditLessonModal
        isOpen={!!selectedLesson}
        onClose={() => setSelectedLesson(null)}
        lesson={selectedLesson}
      />

      {lessonToDelete && (
        <DeleteLessonModal
          isOpen={!!lessonToDelete}
          onClose={() => setLessonToDelete(null)}
          lessonId={lessonToDelete.id}
          lessonTitle={lessonToDelete.title}
        />
      )}

      <AssignCourseModal
        isOpen={assignCourseModal.isModalOpen}
        onClose={() => assignCourseModal.closeModal()}
        listId={listId}
        listName={list.name}
      />
      </Box>
    </Transitions>
  );
}

export default function ListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title="Error Loading List" />
      )}
      onReset={() => {
        mutate(API_PATHS.LIST(id), undefined, { revalidate: true });
      }}
    >
      <ListDetailContent listId={id} />
    </ErrorBoundary>
  );
}

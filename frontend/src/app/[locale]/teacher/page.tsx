"use client";
import { useTranslations } from "next-intl";
import AddStudent from "../../components/teacher/AddStudent";
import AddLesson from "../../components/teacher/AddLesson";
import StatsCard from "../../components/ui/StatsCard";
import MainCard from "../../components/ui/MainCard";
import Transitions from "../../components/ui/Transitions";
import AnimateButton from "../../components/ui/AnimateButton";
import RecentLessonsCard from "../../components/ui/RecentLessonsCard";
import StudentProgressCard, {
  StudentProgress,
} from "../../components/ui/StudentProgressCard";
import useModal from "@/app/hooks/useModal";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import { Lesson, Student } from "../../Types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  FiUsers,
  FiBook,
  FiPlus,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { useRouter } from "@/i18n/routing";

interface DashboardStats {
  pendingReviewCount: number;
  completedThisWeek: number;
  recentLessons: Lesson[];
  studentProgress: StudentProgress[];
}

export default function TeacherPage() {
  const t = useTranslations("navigation");
  const tTeacher = useTranslations("teacher");
  const tDashboard = useTranslations("dashboard");
  const router = useRouter();
  const studentModal = useModal();
  const lessonModal = useModal();

  const { data: students } = useSWRAxios<Student[]>(API_PATHS.USERS);
  const { data: lessons } = useSWRAxios<Lesson[]>(API_PATHS.ALL_LESSONS);
  const { data: dashboardStats, isLoading: statsLoading } =
    useSWRAxios<DashboardStats>(API_PATHS.DASHBOARD_STATS);

  const studentCount = students?.length || 0;
  const lessonCount = lessons?.length || 0;
  const pendingReview = dashboardStats?.pendingReviewCount || 0;
  const completedThisWeek = dashboardStats?.completedThisWeek || 0;

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}
      >
        {t("dashboard")}
      </Typography>

      <Transitions type="fade">
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title={t("students")}
              value={studentCount}
              icon={<FiUsers size={24} />}
              color="primary"
              onClick={() => router.push("/teacher/students")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title={t("lessons")}
              value={lessonCount}
              icon={<FiBook size={24} />}
              color="secondary"
              onClick={() => router.push("/teacher/lessons")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title={tDashboard("pendingReview")}
              value={pendingReview}
              icon={<FiAlertCircle size={24} />}
              color={pendingReview > 0 ? "warning" : "success"}
              subtitle={
                pendingReview > 0 ? tDashboard("needsAttention") : undefined
              }
              onClick={() => router.push("/teacher/reviews")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title={tDashboard("completedThisWeek")}
              value={completedThisWeek}
              icon={<FiCheckCircle size={24} />}
              color="success"
              onClick={() => router.push("/teacher/students")}
            />
          </Grid>
        </Grid>
      </Transitions>

      <Transitions type="fade">
        <MainCard
          title={tDashboard("quickActions")}
          sx={{ mb: 4 }}
          contentSX={{ py: 2 }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <AnimateButton>
              <Button
                variant="contained"
                startIcon={<FiPlus size={16} />}
                onClick={() => studentModal.openModal()}
                sx={{ textTransform: "none" }}
              >
                {tTeacher("addStudent")}
              </Button>
            </AnimateButton>
            <AnimateButton>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<FiPlus size={16} />}
                onClick={() => lessonModal.openModal()}
                sx={{ textTransform: "none" }}
              >
                {tTeacher("addLesson")}
              </Button>
            </AnimateButton>
          </Box>
        </MainCard>
      </Transitions>

      <Transitions type="fade">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <RecentLessonsCard
              lessons={dashboardStats?.recentLessons}
              isLoading={statsLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StudentProgressCard
              students={dashboardStats?.studentProgress}
              isLoading={statsLoading}
            />
          </Grid>
        </Grid>
      </Transitions>

      <AddStudent
        isAddStudentDialogOpen={studentModal.isModalOpen}
        closeAddStudentDialog={() => studentModal.closeModal()}
        aria-label="Add new student"
      />
      <AddLesson
        isAddLessonDialogOpen={lessonModal.isModalOpen}
        closeAddLessonDialog={() => lessonModal.closeModal()}
      />
    </Box>
  );
}

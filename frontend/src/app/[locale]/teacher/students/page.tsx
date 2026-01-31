"use client";
import { useTranslations } from "next-intl";
import Students from "../../../components/student/Students";
import AddStudent from "../../../components/teacher/AddStudent";
import MainCard from "../../../components/ui/MainCard";
import Transitions from "../../../components/ui/Transitions";
import useModal from "@/app/hooks/useModal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FiPlus } from "react-icons/fi";

export default function StudentsPage() {
  const t = useTranslations("navigation");
  const tTeacher = useTranslations("teacher");
  const studentModal = useModal();

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}
      >
        {t("students")}
      </Typography>

      <Transitions type="fade">
        <MainCard
          title={tTeacher("myStudents")}
          secondary={
            <Button
              variant="contained"
              size="small"
              onClick={() => studentModal.openModal()}
              startIcon={<FiPlus size={14} />}
              sx={{ textTransform: "none" }}
            >
              {tTeacher("addStudent")}
            </Button>
          }
        >
          <Students />
        </MainCard>
      </Transitions>

      <AddStudent
        isAddStudentDialogOpen={studentModal.isModalOpen}
        closeAddStudentDialog={() => studentModal.closeModal()}
        aria-label="Add new student"
      />
    </Box>
  );
}

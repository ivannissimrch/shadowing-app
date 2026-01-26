"use client";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { Lesson, Student } from "../../Types";
import Card from "../ui/Card";
import { API_PATHS } from "../../constants/apiKeys";
import { useState } from "react";
import UnassignLessonModal from "./UnassignLessonModal";
import CardGrid from "../ui/CardGrid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { FiX } from "react-icons/fi";

export default function TeacherLessonsList({ id }: { id: string }) {
  const { data: lessons } = useSWRAxios<Lesson[]>(
    API_PATHS.TEACHER_STUDENT_LESSONS(id)
  );
  const { data: student } = useSWRAxios<Student>(API_PATHS.TEACHER_STUDENT(id));

  const [unassignModal, setUnassignModal] = useState<{
    isOpen: boolean;
    lessonId: string;
    lessonTitle: string;
  }>({
    isOpen: false,
    lessonId: "",
    lessonTitle: "",
  });

  return (
    <>
      <CardGrid>
        {lessons &&
          lessons.map((lesson: Lesson) => (
            <Box key={lesson.id} sx={{ position: "relative" }}>
              <Card
                lesson={lesson}
                linkPath={`/teacher/student/${id}/lesson/${lesson.id}`}
              />
              <Tooltip title="Remove from student">
                <IconButton
                  onClick={() =>
                    setUnassignModal({
                      isOpen: true,
                      lessonId: lesson.id,
                      lessonTitle: lesson.title,
                    })
                  }
                  aria-label={`Remove ${lesson.title} from student`}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "error.main",
                    },
                  }}
                >
                  <FiX size={16} />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
      </CardGrid>

      {student && (
        <UnassignLessonModal
          isOpen={unassignModal.isOpen}
          onClose={() =>
            setUnassignModal({ isOpen: false, lessonId: "", lessonTitle: "" })
          }
          lessonId={unassignModal.lessonId}
          lessonTitle={unassignModal.lessonTitle}
          studentId={id}
          studentName={student.username}
        />
      )}
    </>
  );
}

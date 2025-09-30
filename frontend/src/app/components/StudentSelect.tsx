"use client";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Student } from "../Types";
import { useFetch } from "../hooks/useFetch";

interface StudentSelectProps {
  selectedStudent: string | "";
  onStudentChange: (studentId: string) => void;
  StyledFormControl: React.ComponentType<{
    fullWidth?: boolean;
    children: React.ReactNode;
  }>;
}

export default function StudentSelect({
  selectedStudent,
  onStudentChange,
  StyledFormControl,
}: StudentSelectProps) {
  const { data: students } = useFetch<Student[]>("/api/users");

  return (
    <StyledFormControl fullWidth>
      <InputLabel id="student-select-label">Select Student</InputLabel>
      <Select
        labelId="student-select-label"
        value={selectedStudent}
        onChange={(e) => onStudentChange(e.target.value as string)}
        label="Select Student"
      >
        {students &&
          students.map((student: Student) => (
            <MenuItem key={student.id} value={student.id}>
              {student.username}
            </MenuItem>
          ))}
      </Select>
    </StyledFormControl>
  );
}

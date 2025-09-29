"use client";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useAppContext } from "../AppContext";
import fetchData from "../helpers/fetchData";
import { use } from "react";
import { Student } from "../Types";

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
  const { token } = useAppContext();
  if (!token) return null;

  const students = use(fetchData("/api/users", token)) as Student[];

  return (
    <StyledFormControl fullWidth>
      <InputLabel id="student-select-label">Select Student</InputLabel>
      <Select
        labelId="student-select-label"
        value={selectedStudent}
        onChange={(e) => onStudentChange(e.target.value as string)}
        label="Select Student"
      >
        {students.map((student: Student) => (
          <MenuItem key={student.id} value={student.id}>
            {student.username}
          </MenuItem>
        ))}
      </Select>
    </StyledFormControl>
  );
}

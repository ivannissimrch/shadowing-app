"use client";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Student } from "../Types";
import { useSWRAxios } from "../hooks/useSWRAxios";
import { API_PATHS } from "../constants/apiKeys";

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
  const { data: students } = useSWRAxios<Student[]>(API_PATHS.USERS);

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

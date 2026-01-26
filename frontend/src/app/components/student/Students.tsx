"use client";
import { ErrorBoundary } from "react-error-boundary";
import StudentList from "./StudentList";
import ErrorFallback from "../ui/ErrorFallback";
import { mutate } from "swr";
import { API_PATHS } from "../../constants/apiKeys";

export default function Students() {
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title="Error loading students" />
      )}
      onReset={() => {
        mutate(API_PATHS.USERS, undefined, { revalidate: true });
      }}
    >
      <StudentList />
    </ErrorBoundary>
  );
}

"use client";
import { useTranslations } from "next-intl";
import { ErrorBoundary } from "react-error-boundary";
import StudentList from "./StudentList";
import ErrorFallback from "../ui/ErrorFallback";
import { mutate } from "swr";
import { API_PATHS } from "../../constants/apiKeys";

export default function Students() {
  const tErrors = useTranslations("errors");
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title={tErrors("errorLoadingStudents")} />
      )}
      onReset={() => {
        mutate(API_PATHS.USERS, undefined, { revalidate: true });
      }}
    >
      <StudentList />
    </ErrorBoundary>
  );
}

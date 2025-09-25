"use client";
import { useEffect, useState } from "react";
import { Lesson } from "@/app/Types";
import { useAppContext } from "../AppContext";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useGetSelectedLesson() {
  const { token } = useAppContext();
  const params = useParams();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        if (!token) return;
        setLoading(true);
        const response = await fetch(`${API_URL}/api/lessons/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const responseData = await response.json();
        setSelectedLesson(responseData.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lesson data:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token, params]);

  return { selectedLesson, error, loading };
}

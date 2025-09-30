import { expect, it } from "vitest";
import extractVideoId from "./extractVideoId";

it("should extract video ID from URL", () => {
  const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  const videoId = extractVideoId(url);
  expect(videoId).toBe("dQw4w9WgXcQ");
});

it("should return null for invalid URL", () => {
  const url = "https://www.example.com";
  const videoId = extractVideoId(url);
  expect(videoId).toBeNull();
});

it("should return null for URL without video ID", () => {
  const url = "https://www.youtube.com/watch?v=";
  const videoId = extractVideoId(url);
  expect(videoId).toBeNull();
});

it("should return null for empty string", () => {
  const url = "";
  const videoId = extractVideoId(url);
  expect(videoId).toBeNull();
});

it("should return null for non-YouTube URL", () => {
  const url = "https://nextjs.org/docs/app/guides/testing/vitest";
  const videoId = extractVideoId(url);
  expect(videoId).toBeNull();
});

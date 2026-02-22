export default function getScoreColor(score: number) {
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "error";
}

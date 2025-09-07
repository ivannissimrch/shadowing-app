export default function base64ToBlob(
  base64Data: string,
  contentType = "audio/webm"
) {
  const base64 = base64Data.includes(",")
    ? base64Data.split(",")[1]
    : base64Data;
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

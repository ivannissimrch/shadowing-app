export default function buildCloudinaryDownloadUrl(
  cloudName: string,
  publicId: string,
  filename: string
) {
  const cleanFilename = filename
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return `https://res.cloudinary.com/${cloudName}/video/upload/fl_attachment:${cleanFilename}/${publicId}`;
}

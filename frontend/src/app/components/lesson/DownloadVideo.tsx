import buildCloudinaryDownloadUrl from "@/app/helpers/buildCloudinaryDownloadUrl";
import { IconButton, Tooltip } from "@mui/material";
import { MdDownload } from "react-icons/md";

interface DownloadVideoProps {
  cloudinary_public_id: string;
  title: string;
}

export default function DownloadVideo({
  cloudinary_public_id,
  title,
}: DownloadVideoProps) {
  return (
    <Tooltip title="Download video">
      <IconButton
        size="small"
        sx={{
          border: "1px solid",
          borderColor: "#e0e0e0",
          borderRadius: 1,
          color: "text.secondary",
          px: 0.5,
          py: 0.5,
          alignSelf: "center",
        }}
        onClick={() => {
          const url = buildCloudinaryDownloadUrl(
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
            cloudinary_public_id,
            title
          );
          window.open(url);
        }}
      >
        <MdDownload size={16} />
      </IconButton>
    </Tooltip>
  );
}

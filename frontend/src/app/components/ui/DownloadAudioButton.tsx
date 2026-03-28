import { Button, CircularProgress } from '@mui/material';
import { Download } from '@mui/icons-material';
import useAudioDownload from '@/app/hooks/useAudioDownload';
import { AudioSegment, Lesson } from '@/app/Types';
import { useSnackbar } from '@/app/SnackbarContext';

interface DownloadAudioButtonProps {
  segments: AudioSegment[];
  lesson: Lesson;
}

export default function DownloadAudioButton({ segments, lesson }: DownloadAudioButtonProps) {
  const { downloadAudioSegments, isDownloading } = useAudioDownload({ segments, lesson });
  const { showSnackbar } = useSnackbar();

  const handleDownload = async () => {
    try {
      await downloadAudioSegments();
      showSnackbar('Audio files downloaded successfully!', 'success');
    } catch (error) {
      showSnackbar('Failed to download audio files', 'error');
      console.error('Download error:', error);
    }
  };

  if (!segments || segments.length === 0) {
    return null;
  }

  return (
    <Button
      variant="contained"
      onClick={handleDownload}
      disabled={isDownloading}
      startIcon={isDownloading ? <CircularProgress size={20} /> : <Download />}
      sx={{ mb: 2 }}
    >
{isDownloading ? 'Downloading...' : `Download Audio (${segments.length})`}
    </Button>
  );
}
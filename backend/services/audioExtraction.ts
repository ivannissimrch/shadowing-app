import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { Readable, PassThrough } from "stream";

ffmpeg.setFfmpegPath(ffmpegPath.path);

/**
 * Extract audio from a video buffer as MP3.
 * Uses ffmpeg to strip the video track and encode audio as 128kbps mono MP3.
 * Returns a Buffer containing the MP3 data.
 */
export function extractAudioFromVideo(videoBuffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const inputStream = Readable.from(videoBuffer);
    const outputStream = new PassThrough();
    const chunks: Buffer[] = [];

    outputStream.on("data", (chunk) => chunks.push(chunk));
    outputStream.on("end", () => resolve(Buffer.concat(chunks)));
    outputStream.on("error", reject);

    ffmpeg(inputStream)
      .noVideo()
      .audioCodec("libmp3lame")
      .audioBitrate(128)
      .audioChannels(1)
      .format("mp3")
      .on("error", (err: Error) => {
        reject(
          new Error(`Audio extraction failed: ${err.message}`)
        );
      })
      .pipe(outputStream);
  });
}

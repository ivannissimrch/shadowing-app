import { useState } from 'react';
import JSZip from 'jszip';
import { AudioSegment, Lesson } from '@/app/Types';

interface UseAudioDownloadProps {
  segments: AudioSegment[];
  lesson: Lesson;
}

export default function useAudioDownload({ segments, lesson }: UseAudioDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const trimAudioSegment = async (audioBuffer: ArrayBuffer, startTime: number, endTime: number): Promise<ArrayBuffer> => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const decodedData = await audioContext.decodeAudioData(audioBuffer.slice(0));

    const sampleRate = decodedData.sampleRate;
    const startSample = Math.floor(startTime * sampleRate);
    const endSample = Math.floor(endTime * sampleRate);
    const segmentLength = endSample - startSample;

    if (segmentLength <= 0) {
      throw new Error('Invalid segment length');
    }

    const trimmedBuffer = audioContext.createBuffer(
      decodedData.numberOfChannels,
      segmentLength,
      sampleRate
    );

    for (let channel = 0; channel < decodedData.numberOfChannels; channel++) {
      const sourceData = decodedData.getChannelData(channel);
      const targetData = trimmedBuffer.getChannelData(channel);

      for (let i = 0; i < segmentLength; i++) {
        targetData[i] = sourceData[startSample + i] || 0;
      }
    }

    return await audioBufferToWav(trimmedBuffer);
  };

  const audioBufferToWav = async (buffer: AudioBuffer): Promise<ArrayBuffer> => {
    const length = buffer.length * buffer.numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, buffer.numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true);
    view.setUint16(32, buffer.numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length, true);

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  };

  const downloadAudioSegments = async () => {
    if (!segments || segments.length === 0 || (!lesson.audio_url && !lesson.cloudinary_url)) {
      throw new Error('No audio segments or audio URL available');
    }

    setIsDownloading(true);

    try {
      const zip = new JSZip();
      const audioFolder = zip.folder(lesson.title || 'practice-phrases');

      const sortedSegments = [...segments].sort((a, b) => a.position - b.position);

      const baseAudioUrl = lesson.audio_url ||
        lesson.cloudinary_url?.replace('/upload/', '/upload/f_mp3/');

      if (!baseAudioUrl) {
        throw new Error('No audio URL available');
      }

      const response = await fetch(baseAudioUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`);
      }
      const fullAudioBuffer = await response.arrayBuffer();

      for (let i = 0; i < sortedSegments.length; i++) {
        const segment = sortedSegments[i];
        const paddedNumber = String(i + 1).padStart(3, '0');

        const cleanText = segment.label
          .replace(/<[^>]*>/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '_')
          .substring(0, 50);

        const filename = `${paddedNumber}_${cleanText}.wav`;

        try {
          const trimmedAudioBuffer = await trimAudioSegment(
            fullAudioBuffer,
            segment.start_time,
            segment.end_time
          );

          audioFolder?.file(filename, trimmedAudioBuffer);

        } catch (error) {
          console.error(`Failed to process segment ${i + 1}:`, error);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${lesson.title || 'practice-phrases'}_audio.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadAudioSegments,
    isDownloading
  };
}
import getFormattedTime from "@/app/helpers/getFormattedTime";
import styles from "./YouTubePlayer.module.css";
import { FaArrowRight } from "react-icons/fa";
import { memo } from "react";

interface LoopTimerProps {
  startTime: number;
  endTime: number;
}

function LoopSegmentInfo({ startTime, endTime }: LoopTimerProps) {
  return (
    <div className={styles.segmentInfo}>
      Loop segment: {getFormattedTime(startTime)} <FaArrowRight />{" "}
      {getFormattedTime(endTime)} ({endTime - startTime}s)
    </div>
  );
}

export default memo(LoopSegmentInfo);

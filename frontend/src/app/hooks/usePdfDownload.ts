"use client";
import { useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function usePdfDownload() {
  const downloadAsPdf = useCallback(async (
    elementId: string,
    fileName: string = "lesson-script"
  ) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        console.error("Element not found");
        return;
      }

      // Create canvas with high quality
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");

      // Calculate dimensions for PDF
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }, []);

  return { downloadAsPdf };
}
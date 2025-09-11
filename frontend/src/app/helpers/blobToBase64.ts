export default async function blobToBase64(blob: Blob): Promise<string> {
  const base64: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = () => {
      reject(new Error("Failed to read blob"));
    };
    reader.readAsDataURL(blob);
  });
  return base64;
}

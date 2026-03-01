import { BlobServiceClient, CorsRule } from "@azure/storage-blob";
import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!connectionString) {
  throw new Error(
    "AZURE_STORAGE_CONNECTION_STRING is not defined in environment variables"
  );
}

const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);

// Get container clients
const imageContainerClient = blobServiceClient.getContainerClient("images");
const audioContainerClient = blobServiceClient.getContainerClient("audio");

// Upload image to Azure Blob Storage
export async function uploadImage(fileBuffer: Buffer, fileName: string) {
  const blockBlobClient = imageContainerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: "image/jpeg" },
  });
  return blockBlobClient.url;
}

// Upload audio to Azure Blob Storage
export async function uploadAudio(audioBuffer: Buffer, fileName: string) {
  const blockBlobClient = audioContainerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadData(audioBuffer, {
    blobHTTPHeaders: { blobContentType: "audio/webm" },
  });

  return blockBlobClient.url;
}
// Upload extracted lesson audio (MP3) to Azure Blob Storage
export async function uploadLessonAudio(
  audioBuffer: Buffer,
  fileName: string
) {
  const blockBlobClient = audioContainerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadData(audioBuffer, {
    blobHTTPHeaders: { blobContentType: "audio/mpeg" },
  });

  return blockBlobClient.url;
}

// Set CORS rules on the Azure storage account so browsers can fetch audio/images
export async function configureAzureCors() {
  const corsRules: CorsRule[] = [
    {
      allowedOrigins:
        "https://shadowspeak.net,https://www.shadowspeak.net,http://localhost:3000,http://localhost:3001",
      allowedMethods: "GET,HEAD,OPTIONS",
      allowedHeaders: "*",
      exposedHeaders: "*",
      maxAgeInSeconds: 86400,
    },
  ];

  const properties = await blobServiceClient.getProperties();
  properties.cors = corsRules;
  await blobServiceClient.setProperties(properties);
}

// Delete a blob from a specified container
export async function deleteBlob(containerName: string, blobName: string) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.deleteBlob(blobName);
}

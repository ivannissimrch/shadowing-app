import { BlobServiceClient } from "@azure/storage-blob";
import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

// Get container clients
const imageContainerClient = blobServiceClient.getContainerClient("images");
const audioContainerClient = blobServiceClient.getContainerClient("audio");

// Upload image to Azure Blob Storage
export async function uploadImage(fileBuffer, fileName) {
  const blockBlobClient = imageContainerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: "image/jpeg" },
  });
  return blockBlobClient.url;
}

// Upload audio to Azure Blob Storage
export async function uploadAudio(audioBuffer, fileName) {
  const blockBlobClient = audioContainerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadData(audioBuffer, {
    blobHTTPHeaders: { blobContentType: "audio/webm" },
  });

  return blockBlobClient.url;
}
// Delete a blob from a specified container
export async function deleteBlob(containerName, blobName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.deleteBlob(blobName);
}

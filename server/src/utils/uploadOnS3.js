import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY || !process.env.AWS_BUCKET_NAME) {
  throw new Error("Missing required AWS environment variables");
}

const uploadToS3 = async (fileContent, key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileContent,
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    console.log("Upload successful:", data);

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    return fileUrl;
  } catch (err) {
    console.error("Error uploading to S3:", err);
    throw new Error("Failed to upload file to S3");
  }
};

const deleteFromS3 = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, 
    Key: key, 
  };

  try {
    const command = new DeleteObjectCommand(params);
    const data = await s3Client.send(command);
    console.log("Deletion successful:", data);
    return data;
  } catch (err) {
    console.error("Error deleting from S3:", err);
    throw new Error("Failed to delete file from S3");
  }
};

export { uploadToS3, deleteFromS3 };

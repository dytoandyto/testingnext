import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.AWS_ENDPOINT_URL_S3;
const region = process.env.AWS_REGION || "us-east-2";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
export const BUCKET_NAME = process.env.NEON_STORAGE_BUCKET || "assets";

export const s3Client = new S3Client({
  endpoint,
  region,
  credentials:
    accessKeyId && secretAccessKey
      ? {
          accessKeyId,
          secretAccessKey,
        }
      : undefined,
  forcePathStyle: true, // Required for Neon Object Storage
});

export async function uploadObject(
  key: string,
  body: string | Uint8Array | Buffer,
  contentType: string = "application/octet-stream"
) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  return await s3Client.send(command);
}

export async function getObject(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  const response = await s3Client.send(command);
  const streamToBuffer = async (stream: unknown): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (stream as any).on("data", (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (stream as any).on("error", (err: unknown) => reject(err));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (stream as any).on("end", () => resolve(Buffer.concat(chunks)));
    });
  };
  const buffer = await streamToBuffer(response.Body);
  return {
    buffer,
    contentType: response.ContentType,
    contentLength: response.ContentLength,
  };
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string = "application/octet-stream",
  expiresIn = 3600
) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });
  return await getSignedUrl(s3Client, command, { expiresIn });
}

export async function getPresignedDownloadUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  return await getSignedUrl(s3Client, command, { expiresIn });
}

export async function listBucketObjects(prefix?: string) {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  });
  const response = await s3Client.send(command);
  return response.Contents || [];
}

export async function deleteObject(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  return await s3Client.send(command);
}

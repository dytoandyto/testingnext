import { NextRequest, NextResponse } from "next/server";
import { uploadObject, getPresignedDownloadUrl } from "@/lib/storage";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileKey = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Upload to Neon Object Storage bucket
    await uploadObject(fileKey, buffer, file.type || "application/octet-stream");

    // Generate public or presigned URL
    const secureUrl = await getPresignedDownloadUrl(fileKey, 86400 * 7); // 7 days

    // Persist to Neon Postgres MediaAsset table
    const media = await db.mediaAsset.create({
      data: {
        publicId: fileKey,
        secureUrl,
        format: file.type || "application/octet-stream",
        width: 800,
        height: 600,
        bytes: buffer.length,
        altText,
      },
    });

    return NextResponse.json({
      success: true,
      media,
    });
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload to Neon Object Storage" },
      { status: 500 }
    );
  }
}

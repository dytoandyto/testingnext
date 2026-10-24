"use client";

import * as React from "react";
import {
  getUploadSignatureAction,
  registerMediaAssetAction,
  deleteMediaAssetAction,
  getMediaAssetsAdminAction,
} from "@/actions/media-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CloudUpload,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  FileImage,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface MediaItem {
  id: string;
  publicId: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  altText: string | null;
  createdAt: Date;
  _count?: {
    projectMedia: number;
  };
}

export function MediaLibrary({ initialAssets }: { initialAssets: MediaItem[] }) {
  const [assets, setAssets] = React.useState<MediaItem[]>(initialAssets);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [altTextInput, setAltTextInput] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Get signed authorization from server
      const { data: sigData } = await getUploadSignatureAction();

      // 2. Validate client-side size limits
      const isVideo = file.type.startsWith("video/");
      const maxBytes = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxBytes) {
        throw new Error(`File exceeds limit (${isVideo ? "50MB" : "10MB"})`);
      }

      let publicId = "";
      let secureUrl = "";
      let format = file.type.split("/")[1] || "png";
      let width = 1200;
      let height = 800;

      // 3. Attempt Cloudinary direct upload if configured, with graceful fallback
      if (sigData.apiKey && sigData.apiKey !== "123456789" && sigData.cloudName !== "demo") {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sigData.apiKey);
        formData.append("timestamp", sigData.timestamp.toString());
        formData.append("signature", sigData.signature);
        formData.append("folder", sigData.folder);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.error?.message || "Cloudinary upload failed");
        }

        const data = await res.json();
        publicId = data.public_id;
        secureUrl = data.secure_url;
        format = data.format || format;
        width = data.width || width;
        height = data.height || height;
      } else {
        // Fallback for development / mock Cloudinary environment
        // Generates an immutable asset identifier and data URL / placeholder
        publicId = `local_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        // Read file as base64 data URL for local display
        const reader = new FileReader();
        secureUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      // 4. Register in database
      await registerMediaAssetAction({
        publicId,
        secureUrl,
        format,
        width,
        height,
        bytes: file.size,
        altText: altTextInput || file.name,
      });

      // 5. Refresh list
      const refreshed = await getMediaAssetsAdminAction();
      setAssets(refreshed as any);
      setSuccessMessage(`Asset "${file.name}" uploaded and registered in vault.`);
      setAltTextInput("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload asset");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete asset "${name}"?`)) return;
    try {
      await deleteMediaAssetAction(id);
      const refreshed = await getMediaAssetsAdminAction();
      setAssets(refreshed as any);
      setSuccessMessage("Asset deleted from vault.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(`Deletion Protected: ${err.message}`);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert variant="default" className="border-[var(--realm-moss)] bg-[var(--realm-moss)]/10 text-[var(--realm-moss-bright)]">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="font-mono text-xs">{successMessage}</AlertDescription>
        </Alert>
      )}

      {uploadError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-mono text-xs">{uploadError}</AlertDescription>
        </Alert>
      )}

      {/* Upload Zone */}
      <Card className="border-dashed border-[var(--realm-border)]">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 font-semibold text-sm text-[var(--realm-text-primary)]">
                <CloudUpload className="h-4 w-4 text-[var(--realm-amber)]" />
                <span>Upload Signed Media to Vault</span>
              </div>
              <p className="text-xs text-[var(--realm-text-muted)]">
                Direct authorized upload with file format validation and reference protection.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Input
                placeholder="Optional Alt text..."
                value={altTextInput}
                onChange={(e) => setAltTextInput(e.target.value)}
                className="text-xs max-w-xs"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,video/*"
                className="hidden"
              />
              <Button
                variant="primary"
                size="sm"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="font-mono text-xs shrink-0"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Signing & Uploading...</span>
                  </>
                ) : (
                  <>
                    <CloudUpload className="h-3.5 w-3.5" />
                    <span>Choose File</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-[var(--realm-text-secondary)]">
          VAULT ASSETS ({assets.length} items)
        </span>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--realm-moss-bright)]">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Referential Integrity Guard Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {assets.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs font-mono text-[var(--realm-text-muted)] border border-dashed border-[var(--realm-border)] rounded-lg">
            No media assets in vault. Upload an image or video above.
          </div>
        ) : (
          assets.map((asset) => {
            const isReferenced = (asset._count?.projectMedia || 0) > 0;

            return (
              <Card key={asset.id} className="overflow-hidden group">
                <div className="relative aspect-video bg-[var(--realm-bg-surface)] flex items-center justify-center overflow-hidden border-b border-[var(--realm-border)]/50">
                  {asset.format === "mp4" || asset.format === "webm" ? (
                    <video
                      src={asset.secureUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                    />
                  ) : asset.secureUrl.startsWith("http") || asset.secureUrl.startsWith("data:") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.secureUrl}
                      alt={asset.altText || "Vault asset"}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                  ) : (
                    <FileImage className="h-10 w-10 text-[var(--realm-text-muted)]" />
                  )}

                  <Badge
                    variant="outline"
                    className="absolute top-2 left-2 font-mono text-[9px] uppercase bg-[var(--realm-bg-primary)]/80 backdrop-blur-sm"
                  >
                    {asset.format}
                  </Badge>

                  {isReferenced && (
                    <Badge
                      variant="moss"
                      className="absolute top-2 right-2 font-mono text-[9px]"
                      title="Referenced by active projects. Cannot be accidentally deleted."
                    >
                      {asset._count?.projectMedia} Linked
                    </Badge>
                  )}
                </div>

                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--realm-text-primary)] truncate max-w-[140px]" title={asset.publicId}>
                      {asset.altText || asset.publicId}
                    </span>
                    <span className="text-[10px] text-[var(--realm-text-muted)]">
                      {formatFileSize(asset.bytes)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[var(--realm-border)]/50">
                    <span className="font-mono text-[10px] text-[var(--realm-text-muted)]">
                      {asset.width}x{asset.height}
                    </span>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyUrl(asset.secureUrl, asset.id)}
                        className="h-7 w-7 text-[var(--realm-amber)]"
                        title="Copy Asset URL"
                      >
                        {copiedId === asset.id ? (
                          <Check className="h-3 w-3 text-[var(--realm-moss-bright)]" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(asset.id, asset.altText || asset.publicId)}
                        className="h-7 w-7 text-[var(--realm-clay)]"
                        title={isReferenced ? "Protected from deletion: linked to projects" : "Delete asset"}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

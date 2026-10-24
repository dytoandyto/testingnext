"use client";

import * as React from "react";
import {
  getRevisionsAdminAction,
  restoreRevisionAdminAction,
} from "@/actions/revision-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  History,
  RotateCcw,
  Eye,
  CheckCircle2,
  Loader2,
  Calendar,
  FileCode,
} from "lucide-react";

interface RevisionItem {
  id: string;
  entityType: string;
  entityId: string;
  snapshotJson: any;
  authorId: string | null;
  createdAt: Date;
}

export function RevisionManager({ initialRevisions }: { initialRevisions: RevisionItem[] }) {
  const [revisions, setRevisions] = React.useState<RevisionItem[]>(initialRevisions);
  const [typeFilter, setTypeFilter] = React.useState<string>("ALL");
  const [selectedRevision, setSelectedRevision] = React.useState<RevisionItem | null>(null);
  const [isInspectOpen, setIsInspectOpen] = React.useState(false);
  const [isRestoringId, setIsRestoringId] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const filteredRevisions = revisions.filter((rev) => {
    return typeFilter === "ALL" || rev.entityType === typeFilter;
  });

  const handleInspect = (rev: RevisionItem) => {
    setSelectedRevision(rev);
    setIsInspectOpen(true);
  };

  const handleRestore = async (rev: RevisionItem) => {
    if (
      !confirm(
        `Are you sure you want to restore ${rev.entityType} (${rev.entityId.slice(
          0,
          8
        )}) to snapshot from ${new Date(rev.createdAt).toLocaleString()}? Current unsaved changes will be overwritten.`
      )
    ) {
      return;
    }

    setIsRestoringId(rev.id);
    try {
      await restoreRevisionAdminAction(rev.id);
      const refreshed = await getRevisionsAdminAction();
      setRevisions(refreshed as any);
      setSuccessMessage(
        `Successfully restored ${rev.entityType} to revision snapshot.`
      );
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(`Restoration failed: ${err.message}`);
    } finally {
      setIsRestoringId(null);
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert variant="default" className="border-[var(--realm-moss)] bg-[var(--realm-moss)]/10 text-[var(--realm-moss-bright)]">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="font-mono text-xs">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Filter and Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-[var(--realm-amber)]" />
          <span className="text-sm font-semibold">Point-in-Time Content Revisions</span>
          <Badge variant="outline" className="font-mono">
            {revisions.length} Snapshots
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[var(--realm-text-muted)]">Filter:</span>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-44 font-mono text-xs"
          >
            <option value="ALL">All Entity Types</option>
            <option value="Project">Project</option>
            <option value="Experience">Experience</option>
            <option value="WorldScene">WorldScene</option>
            <option value="SiteSettings">SiteSettings</option>
          </Select>
        </div>
      </div>

      {/* Revisions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--realm-border)] bg-[var(--realm-bg-surface)] font-mono tracking-wider text-[var(--realm-text-muted)] uppercase">
              <tr>
                <th className="p-4">Entity Type</th>
                <th className="p-4">Entity Reference ID</th>
                <th className="p-4">Snapshot Timestamp</th>
                <th className="p-4">Author</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--realm-border)]/50">
              {filteredRevisions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--realm-text-muted)] font-mono">
                    No revision snapshots recorded for this filter. Revisions are created automatically whenever projects, experiences, scenes, or settings are saved.
                  </td>
                </tr>
              ) : (
                filteredRevisions.map((rev) => {
                  const isRestoring = isRestoringId === rev.id;

                  return (
                    <tr
                      key={rev.id}
                      className="transition-colors hover:bg-[var(--realm-bg-surface)]/50"
                    >
                      <td className="p-4">
                        <Badge
                          variant={
                            rev.entityType === "Project"
                              ? "amber"
                              : rev.entityType === "Experience"
                              ? "moss"
                              : "outline"
                          }
                          className="font-mono text-[10px]"
                        >
                          {rev.entityType}
                        </Badge>
                      </td>

                      <td className="p-4 font-mono text-[11px] text-[var(--realm-text-primary)]">
                        {rev.entityId}
                      </td>

                      <td className="p-4 font-mono text-[11px] text-[var(--realm-text-secondary)]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-[var(--realm-amber)]" />
                          <span>{new Date(rev.createdAt).toLocaleString()}</span>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-[11px] text-[var(--realm-text-muted)]">
                        {rev.authorId ? `admin (${rev.authorId.slice(0, 8)})` : "system"}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleInspect(rev)}
                            className="h-7 px-2 font-mono text-xs gap-1 text-[var(--realm-text-secondary)] hover:text-white"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Inspect</span>
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={isRestoring}
                            onClick={() => handleRestore(rev)}
                            className="h-7 px-2 font-mono text-xs gap-1 text-[var(--realm-amber)] hover:bg-[var(--realm-amber)]/20"
                          >
                            {isRestoring ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <RotateCcw className="h-3 w-3" />
                            )}
                            <span>Restore</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspect Snapshot Dialog */}
      <Dialog open={isInspectOpen} onOpenChange={setIsInspectOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono text-sm">
              <FileCode className="h-4 w-4 text-[var(--realm-amber)]" />
              <span>
                Snapshot Inspection: {selectedRevision?.entityType} (
                {selectedRevision?.entityId.slice(0, 8)})
              </span>
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Point-in-time state recorded at{" "}
              {selectedRevision && new Date(selectedRevision.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-primary)] p-4 font-mono text-xs text-[var(--realm-text-secondary)] overflow-x-auto max-h-[500px]">
            <pre>
              {selectedRevision
                ? JSON.stringify(selectedRevision.snapshotJson, null, 2)
                : ""}
            </pre>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--realm-border)]">
            <Button
              variant="ghost"
              onClick={() => setIsInspectOpen(false)}
              className="font-mono text-xs"
            >
              Close
            </Button>
            {selectedRevision && (
              <Button
                variant="primary"
                onClick={() => {
                  setIsInspectOpen(false);
                  handleRestore(selectedRevision);
                }}
                className="font-mono text-xs gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restore This Version</span>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

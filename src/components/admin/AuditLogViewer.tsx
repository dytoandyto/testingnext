"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ShieldAlert,
  Search,
  Eye,
  Calendar,
  Lock,
  User,
} from "lucide-react";

interface AuditLogItem {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string | null;
  ipHash: string;
  detailsJson: any;
  timestamp: Date;
  actor?: {
    id: string;
    email: string;
    name: string | null;
  };
}

export function AuditLogViewer({ initialLogs }: { initialLogs: AuditLogItem[] }) {
  const [logs] = React.useState<AuditLogItem[]>(initialLogs);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState("ALL");
  const [selectedLog, setSelectedLog] = React.useState<AuditLogItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.entityId && log.entityId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.actor?.email && log.actor.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-[var(--realm-amber)]" />
          <span className="text-sm font-semibold">Security Audit Trail</span>
          <Badge variant="outline" className="font-mono">
            {logs.length} Recorded Events
          </Badge>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--realm-text-muted)]" />
            <Input
              placeholder="Filter actions or actor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs font-mono"
            />
          </div>

          <Select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-44 font-mono text-xs"
          >
            <option value="ALL">All Actions</option>
            {uniqueActions.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--realm-border)] bg-[var(--realm-bg-surface)] font-mono tracking-wider text-[var(--realm-text-muted)] uppercase">
              <tr>
                <th className="p-4">Action Directive</th>
                <th className="p-4">Entity Type & ID</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Client Hash</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--realm-border)]/50">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[var(--realm-text-muted)] font-mono">
                    No audit records match the current filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isDestructive =
                    log.action.includes("DELETE") || log.action.includes("UNPUBLISH");

                  return (
                    <tr
                      key={log.id}
                      className="transition-colors hover:bg-[var(--realm-bg-surface)]/50"
                    >
                      <td className="p-4">
                        <Badge
                          variant={isDestructive ? "clay" : "outline"}
                          className="font-mono text-[10px]"
                        >
                          {log.action}
                        </Badge>
                      </td>

                      <td className="p-4 font-mono text-[11px]">
                        <span className="font-semibold text-[var(--realm-text-primary)]">
                          {log.entityType}
                        </span>
                        {log.entityId && (
                          <span className="block text-[10px] text-[var(--realm-text-muted)] truncate max-w-[160px]">
                            {log.entityId}
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-mono text-[11px] text-[var(--realm-text-secondary)]">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3 text-[var(--realm-amber)]" />
                          <span>{log.actor?.email || "System"}</span>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-[10px] text-[var(--realm-text-muted)]">
                        <div className="flex items-center gap-1">
                          <Lock className="h-2.5 w-2.5 text-[var(--realm-moss-bright)]" />
                          <span>{log.ipHash}</span>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-[11px] text-[var(--realm-text-secondary)]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-[var(--realm-amber)]" />
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedLog(log);
                            setIsDetailsOpen(true);
                          }}
                          className="h-7 px-2 font-mono text-xs gap-1 text-[var(--realm-amber)] hover:bg-[var(--realm-amber)]/20"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Payload</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono text-sm">
              <ShieldAlert className="h-4 w-4 text-[var(--realm-amber)]" />
              <span>
                Audit Log Payload: {selectedLog?.action} ({selectedLog?.entityType})
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[var(--realm-bg-surface)] p-3 rounded-lg border border-[var(--realm-border)]">
              <div>
                <span className="text-[var(--realm-text-muted)] block text-[10px]">ACTOR</span>
                <span className="text-[var(--realm-text-primary)]">{selectedLog?.actor?.email || "System"}</span>
              </div>
              <div>
                <span className="text-[var(--realm-text-muted)] block text-[10px]">IP HASH</span>
                <span className="text-[var(--realm-text-primary)]">{selectedLog?.ipHash}</span>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-primary)] p-3 font-mono text-xs text-[var(--realm-text-secondary)] overflow-x-auto max-h-[300px]">
              <pre>{selectedLog ? JSON.stringify(selectedLog.detailsJson, null, 2) : ""}</pre>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[var(--realm-border)]">
            <Button
              variant="ghost"
              onClick={() => setIsDetailsOpen(false)}
              className="font-mono text-xs"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Info, FileText, Calendar, Users } from "lucide-react";

export function InfoPanel() {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="outline" size="sm" />}
      >
        <Info className="h-4 w-4 mr-2" />
        Programme Info
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ECS8056 — Themed Research Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium flex items-center gap-1 mb-1">
              <FileText className="h-4 w-4" /> Assessment
            </h4>
            <ul className="space-y-1 text-muted-foreground ml-5 list-disc">
              <li>
                <strong>70%</strong> — Research paper (~5,000 words)
              </li>
              <li>
                <strong>30%</strong> — Supporting materials (code, data,
                notebooks, etc.)
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium flex items-center gap-1 mb-1">
              <Users className="h-4 w-4" /> Selection Process
            </h4>
            <ul className="space-y-1 text-muted-foreground ml-5 list-disc">
              <li>Browse projects and identify ones that interest you</li>
              <li>
                Contact supervisors to discuss projects and express interest
              </li>
              <li>
                Supervisors evaluate and select students for their projects
              </li>
              <li>You may be interested in multiple projects — that&apos;s encouraged</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium flex items-center gap-1 mb-1">
              <Calendar className="h-4 w-4" /> Key Information
            </h4>
            <ul className="space-y-1 text-muted-foreground ml-5 list-disc">
              <li>65 projects across 6 themed areas</li>
              <li>17 supervisors</li>
              <li>10 industrial projects (Thales, Pytilia, Cirdan, Sourcing Lens)</li>
              <li>MSc Artificial Intelligence — Queen&apos;s University Belfast</li>
            </ul>
          </div>

          <Separator />

          <p className="text-xs text-muted-foreground">
            Data sourced from the ECS8056 2026 Supervisors and Projects
            spreadsheet. Supervisor profiles link to QUB Pure research portal.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

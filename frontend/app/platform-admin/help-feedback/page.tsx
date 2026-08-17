"use client";
import { ThumbsUp } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Topbar } from "@/components/platform-admin/Topbar";

interface HelpFeedbackRow {
  questionSlug: string;
  yes: number;
  no: number;
  total: number;
  helpfulPct: number | null;
}

// Real votes only — never shown on the public page, this is the one place
// they're readable (see backend/src/api/routes/admin/helpFeedback.ts's own
// header comment). questionSlug -> readable label is a plain string
// transform (dashes -> spaces, capitalised), not a lookup against the
// public page's FAQ content, so this page never breaks if a question's
// exact wording changes — only the slug (locked, content-derived) matters.
function slugToLabel(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function HelpFeedbackPage() {
  const { data } = useApi<{ questions: HelpFeedbackRow[] }>("/api/admin/platform/help-feedback", { refreshInterval: 60000 });

  return (
    <div className="-m-6">
      <Topbar title="Help Centre Feedback" />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-[#10B981]" /> &quot;Was this helpful?&quot; votes, per question
            </CardTitle>
          </CardHeader>
          <Table>
            <Thead>
              <tr>
                <Th>Question</Th>
                <Th>Yes</Th>
                <Th>No</Th>
                <Th>Total votes</Th>
                <Th>Helpful %</Th>
              </tr>
            </Thead>
            <Tbody>
              {data?.questions.map((q) => (
                <Tr key={q.questionSlug}>
                  <Td className="font-medium text-[#1F2937]">{slugToLabel(q.questionSlug)}</Td>
                  <Td>{q.yes}</Td>
                  <Td>{q.no}</Td>
                  <Td>{q.total}</Td>
                  <Td>{q.helpfulPct === null ? "—" : `${q.helpfulPct}%`}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {data && !data.questions.length && <EmptyState title="No votes yet" />}
        </Card>
      </div>
    </div>
  );
}

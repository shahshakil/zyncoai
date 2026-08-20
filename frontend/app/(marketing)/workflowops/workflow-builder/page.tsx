import dynamic from "next/dynamic";

export const metadata = {
  title: "Workflow Builder",
  description: "Build and visualise automation workflows on ZyncoAI's drag-and-drop canvas — connect triggers, actions, and conditions without code.",
  alternates: { canonical: "/workflowops/workflow-builder" },
};

// reactflow is a canvas-heavy interactive library with no SSR value —
// deferred to the client like every other heavy widget in this codebase
// (recharts, maps) so it doesn't add to server render cost or ship in the
// initial HTML.
const WorkflowBuilderStage6 = dynamic(() => import("@/components/workflow-builder-stage6/WorkflowBuilderStage6"), {
  ssr: false,
  loading: () => <div className="flex h-screen w-full animate-pulse items-center justify-center bg-slate-50 text-sm text-slate-400">Loading workflow builder…</div>,
});

export default function WorkflowBuilderPage() {
  return <WorkflowBuilderStage6 />;
}

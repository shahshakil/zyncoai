"use client";

export default function BuilderTopbar({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onSave,
  onDeploy,
  onRun,
  status,
}: {
  name: string;
  description: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onSave: () => void;
  onDeploy: () => void;
  onRun: () => void;
  status: string;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
        <input
          className="rounded-2xl border border-neutral-300 px-4 py-3"
          placeholder="Workflow name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <input
          className="rounded-2xl border border-neutral-300 px-4 py-3"
          placeholder="Workflow description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
        <div className="flex flex-wrap gap-3">
          <button onClick={onSave} className="rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white">
            Save Draft
          </button>
          <button onClick={onDeploy} className="rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900">
            Deploy
          </button>
          <button onClick={onRun} className="rounded-2xl border border-neutral-300 bg-neutral-50 px-5 py-3 text-sm font-medium text-neutral-900">
            Run Test
          </button>
        </div>
      </div>
      <div className="mt-4 text-sm text-neutral-600">{status}</div>
    </div>
  );
}

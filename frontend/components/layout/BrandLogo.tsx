// Premium gradient wordmark for the dashboard sidebar — distinct from the
// small platform-admin "ZyncoAI Admin" mark and from marketing's ZyncoMark.
// Transparent background so it drops onto any sidebar surface; the gradient
// icon badge is self-contained and reads fine on either light or dark, but
// the wordmark/tagline text colors are tuned for the white sidebar.
export function BrandLogo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
        <span className="absolute inset-0 animate-pulse rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-60 blur-md" />
        <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-sm font-extrabold text-white shadow-lg">
          Z
        </span>
      </div>
      {!collapsed && (
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-bold tracking-tight text-slate-900">ZyncoAI</p>
          <p className="truncate text-xs font-medium uppercase tracking-wider text-slate-400">Voice Core</p>
        </div>
      )}
    </div>
  );
}

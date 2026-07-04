export function CaseStudyVisual({
  gradient,
  square = false,
}: {
  gradient: string;
  square?: boolean;
}) {
  if (square) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]">
        <div
          className={`absolute -inset-4 rounded-[2rem] bg-gradient-to-br ${gradient} blur-3xl opacity-80 sm:-inset-5`}
        />
        <div className="relative flex h-full w-full flex-col rounded-[1.75rem] border border-white/80 bg-[#ececec] p-5 shadow-2xl sm:rounded-[2rem] sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-foreground/5" />
            <div className="h-2.5 w-24 rounded-full bg-foreground/10" />
          </div>
          <div className="flex flex-1 flex-col rounded-xl border border-border/60 bg-white p-4 shadow-sm">
            <div className="space-y-2">
              <div className="h-2.5 w-3/4 rounded-full bg-foreground/10" />
              <div className="h-2.5 w-1/2 rounded-full bg-foreground/10" />
            </div>
            <div className="mt-auto flex items-center gap-2 rounded-xl border border-border bg-[#fafafa] px-3 py-3">
              <div className="h-2.5 flex-1 rounded-full bg-foreground/10" />
              <div className="h-6 w-6 shrink-0 rounded-full bg-foreground/5" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="h-8 flex-1 rounded-lg bg-foreground/5" />
            <div className="h-8 w-8 rounded-lg bg-foreground/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[600px]">
      <div
        className={`absolute -inset-6 rounded-[3rem] bg-gradient-to-br ${gradient} blur-3xl opacity-80 sm:-inset-8 lg:-inset-10`}
      />
      <div className="relative flex h-full min-h-[600px] w-full flex-col rounded-[2rem] border border-white/80 bg-[#ececec] p-7 shadow-2xl sm:rounded-[2.5rem] sm:p-9 lg:p-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-foreground/5" />
          <div className="h-3 w-32 rounded-full bg-foreground/10" />
        </div>
        <div className="flex flex-1 flex-col rounded-2xl border border-border/60 bg-white p-6 shadow-sm sm:p-7">
          <div className="space-y-3">
            <div className="h-3 w-3/4 rounded-full bg-foreground/10" />
            <div className="h-3 w-1/2 rounded-full bg-foreground/10" />
          </div>
          <div className="mt-auto flex items-center gap-3 rounded-2xl border border-border bg-[#fafafa] px-5 py-4">
            <div className="h-3 flex-1 rounded-full bg-foreground/10" />
            <div className="h-8 w-8 shrink-0 rounded-full bg-foreground/5" />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <div className="h-11 flex-1 rounded-xl bg-foreground/5" />
          <div className="h-11 w-11 rounded-xl bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}

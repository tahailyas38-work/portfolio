export function ProjectVisual({ gradient }: { gradient: string }) {
  return (
    <div className="relative flex aspect-[4/3] items-center justify-center lg:aspect-square">
      <div
        className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${gradient} blur-3xl opacity-70`}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-md">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-foreground/5" />
          <div className="h-2.5 w-24 rounded-full bg-foreground/10" />
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="h-2.5 w-3/4 rounded-full bg-foreground/10" />
          <div className="mt-3 h-2.5 w-1/2 rounded-full bg-foreground/10" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-8 flex-1 rounded-lg bg-foreground/5" />
          <div className="h-8 w-8 rounded-lg bg-primary/10" />
        </div>
      </div>
    </div>
  );
}

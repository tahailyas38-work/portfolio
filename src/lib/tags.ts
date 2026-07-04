export type ProjectTag =
  | "CRM"
  | "Consumer"
  | "Mobile"
  | "Web"
  | "Revamp"
  | "Features Addition"
  | "Complete Design";

export const tagStyles: Record<
  ProjectTag,
  { bg: string; text: string; border: string }
> = {
  CRM: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  Consumer: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  Mobile: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
  Web: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  Revamp: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  "Features Addition": {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  "Complete Design": {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
};

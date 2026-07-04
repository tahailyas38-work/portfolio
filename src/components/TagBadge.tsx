export function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="rounded-full border border-[#e6e6e6] bg-gray-50 px-4 py-2 text-[13px] font-medium text-gray-500">
      {tag}
    </span>
  );
}

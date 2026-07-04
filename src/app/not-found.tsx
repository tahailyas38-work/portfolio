import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl font-semibold">404</h1>
      <p className="mt-4 text-muted">Page not found.</p>
      <Link href="/" className="mt-8 text-sm font-medium transition-opacity hover:opacity-60">
        Back to home
      </Link>
    </div>
  );
}

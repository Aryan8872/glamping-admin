import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <h2 className="text-xl font-semibold">Page not found</h2>
      <p className="text-muted-foreground">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>
      <Link href="/admin/plans" className="text-primary underline">
        Go back to Plans
      </Link>
    </div>
  );
}

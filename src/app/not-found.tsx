import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-16 sm:px-6">
      <p className="label">404</p>
      <h1 className="font-display text-4xl">No specimen with that name</h1>
      <p className="text-muted">
        The species may not be in the collection yet, or the address may be mistyped.
      </p>
      <Link
        href="/"
        className="inline-block text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
      >
        Browse all species
      </Link>
    </div>
  );
}

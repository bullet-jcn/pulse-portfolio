import Link from "next/link";
export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-accent text-sm">404</p>
        <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
        <p className="text-muted mt-2 text-sm">This route is not part of Pulse.</p>
        <Link
          className="bg-accent mt-6 inline-block rounded-xl px-4 py-2 text-sm font-semibold text-[#07110e]"
          href="/portfolio"
        >
          Back to portfolio
        </Link>
      </div>
    </div>
  );
}

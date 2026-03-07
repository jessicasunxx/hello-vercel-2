import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
        <p className="mb-8 text-xl text-slate-400">Page not found</p>
        <Link
          href="/login"
          className="rounded-lg bg-sky-500 px-6 py-3 font-medium text-white transition hover:bg-sky-400"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

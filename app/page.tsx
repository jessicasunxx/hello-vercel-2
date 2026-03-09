export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-4xl flex-col items-start gap-8 px-6 pb-24 pt-20">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm uppercase tracking-[0.25em] text-cyan-400/90">
          Humor Project Admin
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          A quiet control room for captions, images, and the community behind
          them.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-400">
          Sign in to review content, manage uploads, and monitor the humor
          pipeline.
        </p>
        <a
          href="/login"
          className="group rounded-full bg-cyan-500/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400 transition hover:bg-cyan-500/30 hover:text-cyan-300"
        >
          Enter Admin
        </a>
      </main>
    </div>
  );
}

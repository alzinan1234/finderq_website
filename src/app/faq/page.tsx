import React from 'react'

export default function FAQPage() {
  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-6 py-16 sm:px-10">
      <section className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-border bg-[#0a0e1a] p-10 shadow-2xl shadow-slate-900/10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:shadow-black/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_25%)]" />
        <div className="relative space-y-8 text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 p-4 text-2xl font-semibold text-slate-900 shadow-sm shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100">
            🌟 FAQ Coming Soon
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white  dark:text-white sm:text-5xl">
              FAQ Page Coming Soon
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              We're building a helpful FAQ section with quick answers, useful tips,
              and clear guidance. Stay tuned — everything you need will be here soon.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white/75 px-5 py-6 text-left shadow-sm shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-950/70">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                update
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                New content soon
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                We're adding FAQs and answers to help you find support faster.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/75 px-5 py-6 text-left shadow-sm shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-950/70">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                ready
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                Smooth experience
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Find answers clearly and quickly without extra hassle.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/75 px-5 py-6 text-left shadow-sm shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-950/70">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                soon
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                Useful support info
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Answers, game tips, and support details will arrive in one place.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

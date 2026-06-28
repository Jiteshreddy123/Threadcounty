"use client";

export function FabricWeaveBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Woven grid */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 23px,
              oklch(0.45 0.2 264 / 0.12) 23px,
              oklch(0.45 0.2 264 / 0.12) 24px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 23px,
              oklch(0.65 0.12 150 / 0.1) 23px,
              oklch(0.65 0.12 150 / 0.1) 24px
            )
          `,
        }}
      />

      {/* Cursor spotlight on weave */}
      <div
        className="absolute inset-0 opacity-60 dark:opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(
            600px circle at var(--mouse-x, 50%) var(--mouse-y, 40%),
            oklch(0.45 0.2 264 / 0.08),
            transparent 70%
          )`,
        }}
      />

      {/* Fabric texture noise */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYiLz4KPC9zdmc+')]" />

      {/* Decorative thread strands */}
      <svg className="absolute top-20 left-[10%] w-32 h-32 text-primary/20 animate-pulse" viewBox="0 0 100 100" fill="none">
        <path d="M10 50 Q50 10 90 50 T170 50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" />
      </svg>
      <svg className="absolute bottom-32 right-[15%] w-40 h-40 text-chart-3/25" viewBox="0 0 100 100" fill="none">
        <path d="M10 80 Q50 20 90 80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 5" />
      </svg>
    </div>
  );
}

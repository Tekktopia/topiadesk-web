export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      {/* Animated wifi-off icon */}
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
        <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8L42 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M24 36h.02" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
          <path d="M16.2 28.2A11.9 11.9 0 0124 25.3" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M10 22a19.8 19.8 0 0110.6-5.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M38 22a19.8 19.8 0 00-8-4.7" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M31.7 28a12 12 0 00-3.5-2.1" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M4 16A27.7 27.7 0 0118 9.3" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M44 16a27.7 27.7 0 00-7-4.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-white">!</span>
      </div>

      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
        You&apos;re offline
      </h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground leading-relaxed">
        No internet connection detected. Any changes you make will be saved locally and synced automatically when you&apos;re back online.
      </p>

      <div className="mt-6 w-full max-w-xs space-y-3 text-left">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Available offline
        </p>
        {[
          'View recently opened tickets',
          'Read cached knowledge base articles',
          'Review asset information',
          'Queue ticket updates for sync',
        ].map((item) => (
          <div key={item} className="flex items-center gap-2.5 text-sm text-foreground">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {item}
          </div>
        ))}
      </div>

      <button
        onClick={() => window.location.reload()}
        className="mt-8 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 active:scale-95 transition-transform"
      >
        Try again
      </button>
    </div>
  );
}

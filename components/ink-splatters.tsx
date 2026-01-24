export function InkSplatters() {
  return (
    <>
      <div
        className="pointer-events-none fixed -top-24 -right-24 z-0 h-96 w-96 rounded-full opacity-60 blur-[80px] transition-opacity dark:opacity-40"
        style={{ background: "var(--ink-purple)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed bottom-[10%] -left-24 z-0 h-80 w-80 rounded-full opacity-60 blur-[80px] transition-opacity dark:opacity-40"
        style={{ background: "var(--ink-blue)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed top-1/2 right-[10%] z-0 h-72 w-72 rounded-full opacity-60 blur-[80px] transition-opacity dark:opacity-40"
        style={{ background: "var(--ink-pink)" }}
        aria-hidden="true"
      />
    </>
  )
}

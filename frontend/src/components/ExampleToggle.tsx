/**
 * Lets a reader see what a page looks like with some reading done. The example is labelled
 * wherever it shows and is never mixed with the reader's own data.
 */
export function ExampleToggle({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {on && (
        <p
          role="status"
          className="label-caps m-0 rounded-full bg-accent-tint px-3 py-1.5 text-ink"
        >
          Example — sample data, not your reading
        </p>
      )}
      <button
        type="button"
        aria-pressed={on}
        onClick={() => onChange(!on)}
        className="rounded-sm text-[0.9375rem] font-medium text-accent underline-offset-4 hover:underline"
      >
        {on ? 'Hide the example' : 'See an example'}
      </button>
    </div>
  )
}

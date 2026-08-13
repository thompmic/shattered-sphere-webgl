/**
 * A dev-only marker for placeholder content.
 *
 * Anything in content.js flagged `todo: true` renders one of these beside it so
 * unfinished copy is impossible to ship by accident. `import.meta.env.DEV` is
 * statically replaced at build time, so this whole component is tree-shaken out
 * of production — no chips, no cost.
 */
export function Todo({ label = 'TODO' }) {
  if (!import.meta.env.DEV) return null
  return (
    <span className="todo-chip" title="Placeholder — edit src/content.js">
      {label}
    </span>
  )
}

/** Convenience: render children, appending a chip when `when` is true. */
export function MaybeTodo({ when, children }) {
  return (
    <>
      {children}
      {when ? <Todo /> : null}
    </>
  )
}

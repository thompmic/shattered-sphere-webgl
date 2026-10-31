/**
 * Deep links to a single project: `#work/squadup`.
 *
 * The shape is deliberately a *sub-path of the existing section anchor* rather
 * than a new one. `#work` already scrolls to the work section through Lenis, and
 * `#work/squadup` degrades to the same place if the slug is unknown or the deck
 * never mounts — so the worst case is landing on Work instead of 404-ing or
 * sitting at the top of the page.
 *
 * Nothing here writes to the URL on its own. Paging and filtering do NOT update
 * the hash: the nav uses `#about`, `#skills` and friends, and rewriting the hash
 * on every page turn would both fight that and fill the back button with deck
 * states nobody asked to navigate. The hash changes only when someone clicks a
 * card's permalink.
 */

export const WORK_HASH = '#work'
const PREFIX = `${WORK_HASH}/`

/** The `#work/<slug>` for a project. */
export function projectHash(slug) {
  return `${PREFIX}${slug}`
}

/**
 * The slug in the current hash, or null.
 * Returns null for plain `#work` — that is a section link, not a project link.
 */
export function readProjectSlug(hash = typeof location === 'undefined' ? '' : location.hash) {
  if (!hash.startsWith(PREFIX)) return null
  const slug = decodeURIComponent(hash.slice(PREFIX.length)).trim()
  return slug || null
}

/** True when the page was opened pointing at a specific project. */
export function hasProjectHash() {
  return readProjectSlug() !== null
}

/**
 * Where a project sits in the deck, given the full list and a page size.
 * Returns null when the slug matches nothing — a stale link someone saved
 * before a project was renamed should fall back, not throw.
 */
export function locateProject(projects, slug, perPage) {
  const index = projects.findIndex((p) => p.slug === slug)
  if (index < 0) return null
  return { index, page: Math.floor(index / perPage), project: projects[index] }
}

/**
 * Write the hash without adding a history entry.
 *
 * `location.hash = …` pushes, so clicking three permalinks would mean three
 * presses of Back to leave the page. `replaceState` keeps the address bar
 * copyable, which is the entire point, without hijacking the back button.
 */
export function setProjectHash(slug) {
  if (typeof history === 'undefined') return
  history.replaceState(null, '', projectHash(slug))
}

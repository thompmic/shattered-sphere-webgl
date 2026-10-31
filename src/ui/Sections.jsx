import { content } from '../content.js'
import { Todo } from './Todo.jsx'
import { WorkDeck } from './WorkDeck.jsx'

/**
 * The scrolling page: Work → About → Skills → Interests → Contact.
 *
 * These sit in a readable column over the fixed 3D stage. Each block carries its
 * own scrim (`.panel`) because body copy directly over the lit sphere is only just
 * legible — the scrim is what makes the continuous-scene idea survive real content.
 *
 * Section numbers are DERIVED from the order of `SECTIONS` at the bottom of this
 * file, not written into each block. They used to be hardcoded "01".."05", which
 * meant inserting a section silently renumbered nothing and the page shipped with
 * two 03s.
 */

function SectionHeading({ index, title, intro, introTodo }) {
  return (
    <header className="sec-head">
      <p className="sec-index">{index}</p>
      <h2 className="sec-title">{title}</h2>
      {intro ? (
        <p className="sec-intro">
          {intro}
          {introTodo ? <Todo /> : null}
        </p>
      ) : null}
    </header>
  )
}

/**
 * "Thirteen things I have built" was hardcoded, which meant adding a fourteenth
 * project left the intro quietly lying. The words still live in content.js; only
 * the number is derived, and it is spelled out up to twenty because a sentence
 * should not open with a numeral.
 */
const NUMBER_WORDS = [
  'No',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
  'Twenty',
]

function spellCount(n) {
  return NUMBER_WORDS[n] ?? String(n)
}

function Work({ index }) {
  const { work } = content
  const intro = work.intro?.replace('{count}', spellCount(work.projects.length))
  return (
    <section id="work" className="sec">
      <div className="panel">
        <SectionHeading index={index} title={work.title} intro={intro} introTodo={work.introTodo} />
        <WorkDeck />
      </div>
    </section>
  )
}

function About({ index }) {
  const { about } = content
  return (
    <section id="about" className="sec">
      <div className="panel">
        <SectionHeading index={index} title={about.title} />
        <div className="prose">
          {about.body.map((para, i) => (
            <p key={i}>
              {para}
              {about.bodyTodo && i === 0 ? <Todo /> : null}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

function Skills({ index }) {
  const { skills } = content
  return (
    <section id="skills" className="sec">
      <div className="panel">
        <SectionHeading index={index} title={skills.title} intro={skills.intro} introTodo={skills.introTodo} />
        <div className="skill-groups">
          {skills.groups.map((g) => (
            <div key={g.label} className="skill-group">
              <h3>
                {g.label}
                {g.todo ? <Todo /> : null}
              </h3>
              <ul className="chips">
                {g.items.map((it, i) => (
                  <li key={`${it}-${i}`}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Interests({ index }) {
  const { interests } = content
  return (
    <section id="interests" className="sec">
      <div className="panel">
        <SectionHeading
          index={index}
          title={interests.title}
          intro={interests.intro}
          introTodo={interests.introTodo}
        />
        <ul className="interests">
          {interests.items.map((it, i) => (
            <li key={i}>
              <h3>
                {it.label}
                {it.todo ? <Todo /> : null}
              </h3>
              <p>{it.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Contact({ index }) {
  const { contact, social, identity, footer } = content
  return (
    <section id="contact" className="sec sec-contact">
      <div className="panel">
        <SectionHeading index={index} title={contact.title} />
        <p className="prose">
          {contact.body}
          {contact.bodyTodo ? <Todo /> : null}
        </p>

        <div className="contact-actions">
          {contact.email ? (
            <a className="btn" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          ) : (
            <span className="btn disabled">
              Email not set
              <Todo />
            </span>
          )}

          {contact.resume ? (
            <a className="btn ghost" href={contact.resume} download>
              Download CV
            </a>
          ) : null}
        </div>

        <ul className="contact-social">
          {social.map((s) =>
            s.href ? (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer noopener">
                  {s.label}
                </a>
              </li>
            ) : (
              <li key={s.label} className="disabled">
                {s.label}
                {s.todo ? <Todo /> : null}
              </li>
            ),
          )}
        </ul>
      </div>

      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} {identity.name}
        </p>
        <p>
          <a href={footer.creditHref} target="_blank" rel="noreferrer noopener">
            {footer.credit}
          </a>
        </p>
      </footer>
    </section>
  )
}

/** Order here is the order on the page, and the source of the 01..0n numbering. */
const SECTIONS = [Work, About, Skills, Interests, Contact]

export function Sections() {
  return (
    <div className="sections">
      {SECTIONS.map((Section, i) => (
        <Section key={Section.name} index={String(i + 1).padStart(2, '0')} />
      ))}
    </div>
  )
}

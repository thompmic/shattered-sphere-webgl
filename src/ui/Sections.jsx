import { content } from '../content.js'
import { Todo } from './Todo.jsx'
import { SectionLink } from './Chrome.jsx'

/**
 * The scrolling page: Work → About → Skills → Interests → Contact.
 *
 * These sit in a readable column over the fixed 3D stage. Each block carries its
 * own scrim (`.panel`) because body copy directly over the lit sphere is only just
 * legible — the scrim is what makes the continuous-scene idea survive real content.
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

function Work() {
  const { work } = content
  return (
    <section id="work" className="sec">
      <div className="panel">
        <SectionHeading index="01" title={work.title} intro={work.intro} introTodo={work.introTodo} />

        <ol className="projects">
          {work.projects.map((p) => (
            <li key={p.title} className="project" data-todo={p.todo || undefined}>
              <div className="project-top">
                <h3 className="project-title">
                  {p.title}
                  {p.todo ? <Todo /> : null}
                </h3>
                <span className="project-year">{p.year}</span>
              </div>

              <p className="project-summary">{p.summary}</p>

              {p.role ? <p className="project-role">{p.role}</p> : null}

              {p.stack?.length ? (
                <ul className="chips">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : null}

              {p.links?.length ? (
                <p className="project-links">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer noopener">
                      {l.label}
                      <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                        <path d="M7 17 L17 7 M9 7 h8 v8" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </a>
                  ))}
                </p>
              ) : null}

              {p.credit ? <p className="project-credit">{p.credit}</p> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function About() {
  const { about } = content
  return (
    <section id="about" className="sec">
      <div className="panel">
        <SectionHeading index="02" title={about.title} />
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

function Skills() {
  const { skills } = content
  return (
    <section id="skills" className="sec">
      <div className="panel">
        <SectionHeading index="03" title={skills.title} intro={skills.intro} introTodo={skills.introTodo} />
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

function Interests() {
  const { interests } = content
  return (
    <section id="interests" className="sec">
      <div className="panel">
        <SectionHeading
          index="04"
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

function Contact() {
  const { contact, social, identity, footer } = content
  return (
    <section id="contact" className="sec sec-contact">
      <div className="panel">
        <SectionHeading index="05" title={contact.title} />
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

export function Sections() {
  return (
    <div className="sections">
      <Work />
      <About />
      <Skills />
      <Interests />
      <Contact />
    </div>
  )
}

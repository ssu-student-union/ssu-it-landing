import { SectionTitle } from "../components";
import { notes } from "../content";

export const ApplicationNotes = () => (
  <section className="w-full px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl py-12 sm:py-16 lg:py-20">
      <SectionTitle>{notes.title}</SectionTitle>
      <ul className="mt-8 flex flex-col gap-3 sm:mt-10 sm:gap-4">
        {notes.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2 pl-4 sm:pl-6">
            <span className="mt-2 size-1.25 shrink-0 rounded-full bg-ink sm:mt-2.5" />
            <span className="font-medium text-base text-ink sm:text-lg">
              {bullet}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-2 pl-4 sm:pl-6">
        <p className="font-medium text-base text-ink sm:text-lg">
          {notes.contactIntro}
        </p>
        <ul className="flex flex-col gap-1.5">
          {notes.contacts.map((contact) => (
            <li key={contact.label} className="text-sm sm:text-base">
              <span className="font-semibold text-ink">{contact.label}: </span>
              <a
                href={contact.href}
                target="_blank"
                rel="noreferrer"
                className="text-muted underline underline-offset-2 hover:text-ink"
              >
                {contact.value}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

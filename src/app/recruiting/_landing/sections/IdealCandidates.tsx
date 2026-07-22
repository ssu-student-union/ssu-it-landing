import { SectionTitle } from "../components";
import { ideal } from "../content";

export const IdealCandidates = () => (
  <section className="w-full px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl py-12 sm:py-16 lg:py-20">
      <SectionTitle>{ideal.title}</SectionTitle>
      <div className="mt-8 flex flex-col gap-8 sm:mt-10 sm:gap-10">
        {ideal.cards.map((card) => (
          <article
            key={card.title}
            className="border-ink border-l-2 pl-5 sm:pl-6"
          >
            <div className="flex items-center gap-1.5">
              <span aria-hidden="true" className="text-xl sm:text-2xl">
                {card.emoji}
              </span>
              <h3 className="font-semibold text-ink text-lg sm:text-xl lg:text-2xl">
                {card.title}
              </h3>
            </div>
            <p className="mt-3 text-base text-ink leading-relaxed sm:text-lg">
              {card.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

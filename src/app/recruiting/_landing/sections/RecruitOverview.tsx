import { KeyValueRow, SectionTitle } from "../components";
import { overview } from "../content";

export const RecruitOverview = () => (
  <section className="w-full px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl py-12 sm:py-16 lg:py-20">
      <SectionTitle>{overview.title}</SectionTitle>
      <ul className="mt-8 flex flex-col gap-3 sm:mt-10 sm:gap-4 lg:gap-5">
        {overview.rows.map((row) => (
          <KeyValueRow key={row.label} {...row} />
        ))}
      </ul>
    </div>
  </section>
);

import { KeyValueRow, SectionTitle } from "../components";
import { buildTimelineItems, timeline } from "../content";

const items = buildTimelineItems();

export const Timeline = () => (
  <section className="w-full px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl py-12 sm:py-16 lg:py-20">
      <SectionTitle icon>{timeline.title}</SectionTitle>
      {/* 행 간격은 flex gap이 아니라 각 행의 pb로 준다 — 그래야 연결선 h-full이 다음 점에 닿는다. */}
      <ul className="mt-8 flex flex-col sm:mt-10">
        {items.map((item) => (
          <KeyValueRow
            key={item.label}
            label={item.label}
            value={item.date}
            connector={!item.last}
            className={item.last ? undefined : "pb-8"}
          />
        ))}
      </ul>
    </div>
  </section>
);

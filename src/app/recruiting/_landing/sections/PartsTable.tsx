import type { ReactNode } from "react";
import { Table } from "../../_components/fields";
import { SectionTitle } from "../components";
import { parts } from "../content";

/** 마감 파트(Frontend)는 행 전체를 흐리게. */
const dim = (text: string, dimmed?: boolean): ReactNode =>
  dimmed ? <span className="text-inactive">{text}</span> : text;

export const PartsTable = () => (
  <section className="w-full px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl py-12 sm:py-16 lg:py-20">
      <SectionTitle icon>{parts.title}</SectionTitle>
      <Table
        variant="text"
        className="mt-8 sm:mt-10"
        cornerLabel={parts.cornerLabel}
        columns={[...parts.columns]}
        rows={parts.rows.map((row) => ({
          id: row.part,
          label: dim(row.part, row.dimmed),
          cells: [
            { id: `${row.part}-count`, content: dim(row.count, row.dimmed) },
            { id: `${row.part}-note`, content: dim(row.note, row.dimmed) },
          ],
        }))}
      />
    </div>
  </section>
);

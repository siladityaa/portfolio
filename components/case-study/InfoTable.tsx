import type { InfoTableSection } from "@/content/types";

/**
 * Bordered rounded card containing a comparison table.
 * Mirrors the xiangyi "Category | Foundational Experience | Core Iterations"
 * pattern, blended with this portfolio's mono+serif language.
 */
export function InfoTable({ section }: { section: InfoTableSection }) {
  return (
    <div className="my-12">
      <div className="overflow-hidden rounded-2xl border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)]">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              {section.columns.map((col, i) => (
                <th
                  key={i}
                  scope="col"
                  className="border-b border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] px-6 py-5 text-left text-mono-s font-normal text-[color:var(--surface-graphite)]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_18%,transparent)] first:border-t-0"
              >
                <th
                  scope="row"
                  className="px-6 py-6 align-top text-left text-mono-s font-normal text-[color:var(--surface-graphite)]"
                >
                  {row.label}
                </th>
                {row.cells.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="px-6 py-6 align-top text-body text-[color:var(--surface-ink)]"
                  >
                    {Array.isArray(cell) ? (
                      <ul className="flex flex-col gap-1">
                        {cell.map((item, i) => (
                          <li key={i}>· {item}</li>
                        ))}
                      </ul>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {section.footnote ? (
        <p className="mt-4 text-mono-s text-[color:var(--surface-graphite)]">
          {section.footnote}
        </p>
      ) : null}
    </div>
  );
}

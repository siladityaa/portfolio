"use client";

import { useFieldArray, Controller, useFormContext } from "react-hook-form";
import clsx from "clsx";

import { TextField } from "../fields/TextField";
import { TextareaField } from "../fields/TextareaField";
import { ListActions } from "../fields/ListActions";

/**
 * Info table editor — the hardest piece of UI in the CMS.
 *
 * Shape:
 *   columns: string[]   // header row, e.g. ["Category", "Foundational", "Core iterations"]
 *   rows: Array<{ label: string, cells: Array<string | string[]> }>
 *
 * Each cell can be either a single line (string) or a bullet list
 * (string[]). The form uses a per-cell segmented toggle to switch
 * between the two representations, preserving the value when possible.
 *
 * The number of cells per row is bound to `columns.length - 1` (the
 * first column is always the row's `label` field). Adding a column
 * appends an empty cell to every row; removing a column drops the
 * corresponding cell.
 */
export function InfoTableFields({ pathPrefix }: { pathPrefix: string }) {
  const { setValue, getValues } = useFormContext();

  const columns = useFieldArray({
    name: `${pathPrefix}.columns` as `${string}.columns`,
  });
  const rows = useFieldArray({
    name: `${pathPrefix}.rows` as `${string}.rows`,
  });

  // Number of body columns (cells per row) = columns.length - 1
  // because the first column is the row label.
  const bodyColumnCount = Math.max(columns.fields.length - 1, 0);

  function addColumn() {
    columns.append("New column");
    // Append an empty string cell to every row to keep widths in sync.
    const currentRows: Array<{ label: string; cells: Array<string | string[]> }> =
      getValues(`${pathPrefix}.rows`) ?? [];
    currentRows.forEach((_, rowIndex) => {
      const cellPath = `${pathPrefix}.rows.${rowIndex}.cells`;
      const existing = (getValues(cellPath) ?? []) as Array<string | string[]>;
      setValue(cellPath, [...existing, ""], { shouldDirty: true });
    });
  }

  function removeColumn(colIndex: number) {
    columns.remove(colIndex);
    if (colIndex === 0) return; // first column is the row-label slot — no cells
    const cellIndex = colIndex - 1;
    const currentRows: Array<{ label: string; cells: Array<string | string[]> }> =
      getValues(`${pathPrefix}.rows`) ?? [];
    currentRows.forEach((_, rowIndex) => {
      const cellPath = `${pathPrefix}.rows.${rowIndex}.cells`;
      const existing = (getValues(cellPath) ?? []) as Array<string | string[]>;
      setValue(
        cellPath,
        existing.filter((_, i) => i !== cellIndex),
        { shouldDirty: true },
      );
    });
  }

  function addRow() {
    rows.append({
      label: "Row label",
      cells: Array.from({ length: bodyColumnCount }, () => ""),
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {/* COLUMNS */}
      <section className="flex flex-col gap-3">
        <header className="flex items-center justify-between">
          <span className="text-mono-s text-[color:var(--surface-graphite)]">
            COLUMNS
          </span>
          <button
            type="button"
            onClick={addColumn}
            className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
          >
            + ADD COLUMN
          </button>
        </header>
        <p className="text-body text-[color:var(--surface-graphite)]">
          The first column is the row-label column — adding a body column
          appends an empty cell to every row.
        </p>
        <ul className="flex flex-col gap-2">
          {columns.fields.map((field, i) => (
            <li key={field.id} className="flex items-end gap-2">
              <div className="flex-1">
                <TextField
                  name={`${pathPrefix}.columns.${i}`}
                  label={i === 0 ? "ROW LABEL HEADER" : `COLUMN ${i}`}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete this column?")) removeColumn(i);
                }}
                className="mb-2 inline-flex h-8 w-8 items-center justify-center text-mono-s text-[color:var(--surface-graphite)] transition-colors duration-300 ease-[var(--ease-out-soft)] hover:text-[color:var(--surface-signal)]"
                title="Delete column"
                aria-label="Delete column"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* ROWS */}
      <section className="flex flex-col gap-3">
        <header className="flex items-center justify-between">
          <span className="text-mono-s text-[color:var(--surface-graphite)]">
            ROWS
          </span>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
          >
            + ADD ROW
          </button>
        </header>

        <ul className="flex flex-col gap-6">
          {rows.fields.map((field, rowIndex) => (
            <li
              key={field.id}
              className="flex items-start gap-3 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] pt-4"
            >
              <div className="flex flex-1 flex-col gap-3">
                <TextField
                  name={`${pathPrefix}.rows.${rowIndex}.label`}
                  label={`ROW ${rowIndex + 1} LABEL`}
                />
                {Array.from({ length: bodyColumnCount }).map((_, cellIndex) => (
                  <CellField
                    key={cellIndex}
                    name={`${pathPrefix}.rows.${rowIndex}.cells.${cellIndex}`}
                    columnLabel={
                      (getValues(
                        `${pathPrefix}.columns.${cellIndex + 1}`,
                      ) as string) ?? `Column ${cellIndex + 1}`
                    }
                  />
                ))}
              </div>
              <div className="pt-7">
                <ListActions
                  index={rowIndex}
                  total={rows.fields.length}
                  onMoveUp={() => rows.move(rowIndex, rowIndex - 1)}
                  onMoveDown={() => rows.move(rowIndex, rowIndex + 1)}
                  onDelete={() => rows.remove(rowIndex)}
                />
              </div>
            </li>
          ))}
        </ul>

        <TextField
          name={`${pathPrefix}.footnote`}
          label="FOOTNOTE (optional)"
        />
      </section>
    </div>
  );
}

/* ---------- CellField: union toggle between string and string[] -------- */

interface CellFieldProps {
  name: string;
  columnLabel: string;
}

function CellField({ name, columnLabel }: CellFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const isList = Array.isArray(field.value);
        return (
          <div className="flex flex-col gap-2 rounded-md border border-[color:color-mix(in_srgb,var(--surface-graphite)_20%,transparent)] p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-mono-s text-[color:var(--surface-graphite)]">
                {columnLabel.toUpperCase()}
              </span>
              <SegmentedToggle
                isList={isList}
                onChange={(next) => {
                  if (next === isList) return;
                  if (next) {
                    // string → string[]
                    const current = typeof field.value === "string" ? field.value : "";
                    field.onChange(current ? [current] : [""]);
                  } else {
                    // string[] → string (join with newlines so nothing is lost)
                    const current = Array.isArray(field.value)
                      ? field.value.join("\n")
                      : "";
                    field.onChange(current);
                  }
                }}
              />
            </div>

            {isList ? (
              <BulletListEditor
                value={field.value as string[]}
                onChange={field.onChange}
              />
            ) : (
              <textarea
                value={(field.value as string) ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                rows={2}
                className="w-full resize-y border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] bg-transparent px-3 py-2 text-body text-[color:var(--surface-ink)] focus:border-[color:var(--surface-ink)] focus:outline-none"
              />
            )}
          </div>
        );
      }}
    />
  );
}

function SegmentedToggle({
  isList,
  onChange,
}: {
  isList: boolean;
  onChange: (isList: boolean) => void;
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-full border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)]">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={clsx(
          "px-3 py-1 text-mono-s transition-colors duration-200",
          !isList
            ? "bg-[color:var(--surface-ink)] text-[color:var(--surface-paper)]"
            : "text-[color:var(--surface-graphite)]",
        )}
      >
        SINGLE
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={clsx(
          "px-3 py-1 text-mono-s transition-colors duration-200",
          isList
            ? "bg-[color:var(--surface-ink)] text-[color:var(--surface-paper)]"
            : "text-[color:var(--surface-graphite)]",
        )}
      >
        BULLETS
      </button>
    </div>
  );
}

function BulletListEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-mono-s text-[color:var(--surface-graphite)]">
            ·
          </span>
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] bg-transparent px-3 py-2 text-body text-[color:var(--surface-ink)] focus:border-[color:var(--surface-ink)] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="text-mono-s text-[color:var(--surface-graphite)] hover:text-[color:var(--surface-signal)]"
            title="Remove bullet"
            aria-label="Remove bullet"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="self-start text-mono-s text-[color:var(--surface-graphite)] hover:text-[color:var(--surface-ink)]"
      >
        + ADD BULLET
      </button>
    </div>
  );
}

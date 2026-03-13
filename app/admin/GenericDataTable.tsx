type GenericRow = Record<string, unknown>;

type GenericDataTableProps = {
  title: string;
  data: GenericRow[] | null;
  error: string | null;
  columns?: string[];
};

function safeString(val: unknown): string {
  if (val == null) return "—";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

export default function GenericDataTable({
  title,
  data,
  error,
  columns,
}: GenericDataTableProps) {
  if (error) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
        <h3 className="text-lg font-semibold text-amber-400">{title}</h3>
        <p className="mt-2 text-sm text-amber-200/80">{error}</p>
      </div>
    );
  }

  const rows = data ?? [];
  const cols =
    columns ??
    (rows.length > 0
      ? (Object.keys(rows[0] as GenericRow) as string[])
      : []);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 shadow-lg">
      <h3 className="border-b border-white/10 bg-zinc-800/80 px-4 py-3 text-lg font-semibold text-white">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-zinc-800/60 text-xs uppercase tracking-[0.2em] text-zinc-500">
            <tr>
              {cols.map((col) => (
                <th key={col} className="px-4 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-white/5">
                {cols.map((col) => (
                  <td
                    key={col}
                    className="max-w-[300px] truncate px-4 py-3 text-zinc-400"
                    title={safeString((row as GenericRow)[col])}
                  >
                    {safeString((row as GenericRow)[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <p className="px-4 py-6 text-sm text-zinc-500">No records found.</p>
      )}
    </div>
  );
}

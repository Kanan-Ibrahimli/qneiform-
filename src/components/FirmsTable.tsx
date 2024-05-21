import { useFetch } from "@/hooks";
import { IFirm } from "@/interfaces";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { useMemo, useState } from "react";

const fetchOptions: RequestInit = {
  headers: new Headers({
    "x-api-key": import.meta.env.VITE_API_KEY,
  }),
};

const FirmsTable = () => {
  const { data, loading } = useFetch<IFirm[]>(
    `${import.meta.env.VITE_API_URL}/get?user=${import.meta.env.VITE_API_USER}`,
    fetchOptions,
  );

  const [filters, setFilters] = useState<string[]>([]);

  const strategies = useMemo(() => {
    const _strategies = new Set<string>();

    if (data) {
      data.forEach((item) => {
        item.strategies.forEach((strategy) => {
          _strategies.add(strategy);
        });
      });
    }

    return Array.from(_strategies);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];

    return filters.length > 0
      ? data.filter((item) =>
          item.strategies.some((strategy) => filters.includes(strategy)),
        )
      : data;
  }, [data, filters]);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Qneiform</h1>

      <Accordion style={{ marginBottom: "1rem" }}>
        <AccordionTab header="Filters">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <MultiSelect
              placeholder="Strategy"
              maxSelectedLabels={3}
              value={filters}
              options={strategies}
              onChange={(e) => setFilters(e.value)}
            />
          </div>
        </AccordionTab>
      </Accordion>

      <DataTable
        value={filteredData}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        showGridlines
        emptyMessage="No firms found"
        loading={loading}
      >
        <Column field="name" header="Name" style={{ width: "20%" }} />
        <Column field="city" header="City" style={{ width: "20%" }} />
        <Column field="country" header="Country" style={{ width: "20%" }} />
        <Column
          field="strategies"
          header="Strategies"
          body={(data: IFirm) => (
            <div
              style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}
            >
              {data.strategies.map((strategy) => (
                <Chip key={strategy} label={strategy} />
              ))}
            </div>
          )}
          style={{ width: "40%" }}
        />
      </DataTable>
    </>
  );
};

export default FirmsTable;

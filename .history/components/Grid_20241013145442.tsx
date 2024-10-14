import React, { useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import * as agGrid from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { GridOptions } from 'ag-grid-community';

interface RowData {
  athlete: string;
  age: number;
  country: string;
  year: number;
  date: string;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

const Grid: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [gridApi, setGridApi] = useState<agGrid.GridApi | null>(null);
  const [gridColumnApi, setGridColumnApi] = useState<agGrid.ColumnApi | null>(
    null
  );
  const gridOptions: GridOptions = {
    // ... other grid options
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
  };
  useEffect(() => {
    fetch("https://tsttmp.s3.us-west-2.amazonaws.com/data/large-file.json")
      .then((response) => response.json())
      .then((data) => setRowData(data));
  }, []);

  const columnDefs: agGrid.ColDef[] = [
    { field: "id", filter: "agTextColumnFilter" },
    { field: "type", filter: "agTextColumnFilter" },
    { field: "actor.login", filter: "agSetColumnFilter" },
    { field: "payload.action", filter: "agSetColumnFilter" },
    { field: "repo.url", filter: "agSetColumnFilter" },
    { field: "created_at", filter: "agTextColumnFilter" },
    { field: "payload.pusher_type", filter: "agTextColumnFilter" }
  ];

  const defaultColDef: agGrid.ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) =>
        params.api.setGridOption("rowData", data),
      );
  }, []);

  const onPaginationChanged = () => {
    console.log("onPaginationChanged");
  };

  const clearFilters = () => {
    if (gridApi) {
      gridApi.setFilterModel(null);
    }
  };

  
  const rowSelectionConfig = useMemo<agGrid.RowSelectionOptions | "single" | "multiple">(() => {
    return {
      mode: "multiRow",
    };
  }, []);
  return (
    <div className="ag-theme-alpine grid-container">
      <div className="flex justify-between align-middle mb-4 text-lg text-[#4b5563] ">
        <button
          className="rounded bg-gray-200 px-3 py-1"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>
      <AgGridReact
        className="ag-grid"
        columnDefs={columnDefs}
        rowData={rowData}
        rowSelection="{rowSelectionConfig}"
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        pagination={true}
        paginationPageSize={50}
        onPaginationChanged={onPaginationChanged}
      ></AgGridReact>
      <style jsx global>{`
        .grid-container {
          height: 800px;
          width: 100%;
        }
        .ag-grid .ag-cell {
          padding: 0.5rem;
          font-size: 1.2rem;
          color: #4b5563;
          border-color: #e5e7eb;
          line-height: 1.5;
        }
        .ag-grid .ag-header-cell {
          font-weight: 600;
          font-size: 1.2rem;
          color: #374151;
          background-color: #f9fafb;
          border-color: #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default Grid;

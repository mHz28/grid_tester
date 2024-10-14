import React, { useCallback, useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import * as agGrid from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";


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
  
  const gridOptions: agGrid.GridOptions = {
    // ... other grid options
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
  };

  const [columnDefs, setColumnDefs] = useState<agGrid.ColDef[]>([
    { field: "id", filter: "agTextColumnFilter" },
    { field: "type", filter: "agTextColumnFilter" },
    { field: "actor.login", filter: "agSetColumnFilter" },
    { field: "payload.action", filter: "agSetColumnFilter" },
    { field: "repo.url", filter: "agSetColumnFilter" },
    { field: "created_at", filter: "agTextColumnFilter" },
    { field: "payload.pusher_type", filter: "agTextColumnFilter" }
  ]);

  const defaultColDef = useMemo<agGrid.ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const onGridReady = useCallback((params: agGrid.GridReadyEvent) => {
    fetch("https://tsttmp.s3.us-west-2.amazonaws.com/data/large-file.json")
      .then((resp) => resp.json())
      .then((data: RowData[]) =>
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

      <AgGridReact 
        rowSelection={"single"}
        className="ag-grid"
        columnDefs={columnDefs}
        // rowData={rowData}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        gridOptions={gridOptions}
        pagination={true}
        paginationPageSize={20}
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

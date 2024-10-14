import React, { useCallback, useMemo, useState, useEffect } from "react";
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
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  
  const rowSelectionConfig = useMemo<agGrid.RowSelectionOptions | "single" | "multiple">(() => {
    return {
      mode: "multiRow",
    };
  }, []);
  return (
    <div className="ag-theme-alpine grid-container">
     <div
        style={gridStyle}
        className={
          "ag-theme-quartz-dark"
        }
      >
        <AgGridReact<rowData>
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default Grid;

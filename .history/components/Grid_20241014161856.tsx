import React, { useCallback, useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import * as agGrid from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";


interface RowData {
  id: string;
  type: string;
  login: string;
  action: string;
  url: string;
  created_at: string;
  pusher_type: string;
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
    fetch("https://raw.githubusercontent.com/mHz28/grid_tester/refs/heads/main/large-file.json")
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

  
  const rowSelection = useMemo(() => { 
    return { 
          mode: 'multiRow',
          sort: 'true',
      };
  }, []);
  
  return (
    <div className="ag-theme-alpine grid-container">

      <AgGridReact 
        
        className="ag-grid"
        columnDefs={columnDefs}
        rowSelection={rowSelection}
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

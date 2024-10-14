
Search⌘ K

    Demos
    Theme Builder
    Docs
    API
    Community
    Pricing

    What's New
    Getting Started
    Quick Start

Layout & Styling
Design System
Grid Layout
Charting
Core Features

    Row Selection
        Single Row Selection
        Multi-Row Selection
        API Reference
    Cell Selection(e)

    Range Handle(e)

Fill Handle(e)
API Reference(e)
Advanced Features
Miscellaneous

React Data GridSingle Row Selection

Enable users to select a single row within a grid.
Enabling Single Row Selection

To enable single row selection set rowSelection.mode to 'singleRow'.

const rowSelection = useMemo(() => { 
	return {
        mode: 'singleRow'
    };
}, []);

<AgGridReact rowSelection={rowSelection} />

The example below uses this configuration to restrict selection to a single row

Language:
Import type:

"use strict";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  GridState,
  ModuleRegistry,
  RowSelectionOptions,
  createGrid,
} from "@ag-grid-community/core";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MenuModule,
  RowGroupingModule,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 150 },
    { field: "age", maxWidth: 90 },
    { field: "year", maxWidth: 90 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return { mode: "singleRow" };
  }, []);
  const initialState = useMemo<GridState>(() => {
    return {
      rowSelection: ["2"],
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) =>
        params.api.setGridOption("rowData", data),
      );
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={gridStyle}
        className={
          "ag-theme-quartz-dark"
        }
      >
        <AgGridReact<IOlympicData>
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
          initialState={initialState}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);

New Tab
CodeSandboxPlunker

Deselect a row by clicking its checkbox. Alternatively, you can do this via the keyboard by focusing the row and pressing the ␣ Space key.
Removing Selection Checkboxes

To prevent any row selection checkboxes from being rendered, set rowSelection.checkboxes to false. You will also need to enable click selection by setting enableClickSelection: true.

const rowSelection = useMemo(() => { 
	return {
        mode: 'singleRow',
        checkboxes: false,
        enableClickSelection: true,
    };
}, []);

<AgGridReact rowSelection={rowSelection} />

New Tab
CodeSandboxPlunker

You may also pass a function to rowSelection.checkboxes to dynamically enable or disable checkboxes for given rows.
Configure Selectable Rows

It is possible to specify which rows can be selected via the rowSelection.isRowSelectable callback function.

For instance if we only wanted to allow selection for rows where the 'year' property is less than 2007, we could implement the following:

const rowSelection = useMemo(() => { 
	return {
        mode: 'singleRow',
        isRowSelectable: (rowNode) => rowNode.data ? rowNode.data.year < 2007 : false,
        hideDisabledCheckboxes: true
    };
}, []);

<AgGridReact rowSelection={rowSelection} />

Rows for which isRowSelectable returns false cannot be selected at all, whether using the UI or the API.
New Tab
CodeSandboxPlunker

Note this example uses hideDisabledCheckboxes to hide disabled checkboxes, which can be toggled on or off.
Customising the Checkbox Column

The checkbox column may be customised in a similar way to any other column, by specifying its column definition in the selectionColumnDef grid option.
selectionColumnDef
SelectionColumnDef
Configure the selection column, used for displaying checkboxes. Note that due to the nature of this column, this type is a subset of ColDef, which does not support several normal column features such as editing, pivoting and grouping.

The SelectionColumnDef allows for a great deal of customisation, including custom renderers, sorting, tooltips and more. The example below demonstrates allowing sorting using the default sort order (selected first) via the header menu, changing the default width of the column, and adding some header tooltip text.

const selectionColumnDef = useMemo(() => { 
	return {
        sortable: true,
        width: 100,
        maxWidth: 100,
        suppressHeaderMenuButton: false,
        headerTooltip: 'Checkboxes indicate selection',
    };
}, []);

<AgGridReact selectionColumnDef={selectionColumnDef} />

New Tab
CodeSandboxPlunker

The checkbox column has a default maxWidth set. To make the column resizable (when setting resizable: true), or to set a width/initialWidth, the max width must also be overridden.
Enable Click Selection & Deselection

The rowSelection.enableClickSelection property configures whether a row's selection state will be impacted when the row is clicked.
enableClickSelection
boolean | 'enableDeselection' | 'enableSelection'
default: false
Modifies the selection behaviour when clicking a row, or pressing Space while focusing a row.

This is typically used when Checkbox Selection is disabled, though both can be enabled simultaneously if desired. Click-selection and deselection can be enabled by setting enableClickSelection to true, otherwise they may be enabled separately using the values 'enableSelection' and 'enableDeselection'.

const rowSelection = useMemo(() => { 
	return { 
        mode: 'singleRow',
        enableClickSelection: true,
    };
}, []);

<AgGridReact rowSelection={rowSelection} />

The example below demonstrates the three possible configurations for this property, as well as the behaviour when it is disabled. Click a row to select it, or ^ Ctrl-click a row to deselect it. Use the select element to switch between modes.
New Tab
CodeSandboxPlunker

Note that deselection is still possible using the ␣ Space key or when checkboxes are enabled by clicking a selected checkbox.
API Reference

See the full list of configuration options available in 'singleRow' mode.
mode
'singleRow'
'singleRow'
enableClickSelection
boolean | 'enableDeselection' | 'enableSelection'
default: false
Modifies the selection behaviour when clicking a row, or pressing Space while focusing a row.
checkboxes
boolean | CheckboxSelectionCallback
default: true
Set to true or return true from the callback to render a selection checkbox.
hideDisabledCheckboxes
boolean
default: false
Set to true to hide a disabled checkbox when row is not selectable and checkboxes are enabled.
isRowSelectable
IsRowSelectable
Callback to be used to determine which rows are selectable. By default rows are selectable, so return false to make a row non-selectable.
copySelectedRows
boolean
When enabled and a row is selected, the copy action should copy the entire row, rather than just the focused cell
enableSelectionWithoutKeys
boolean
default: false
Set to true to allow (possibly multiple) rows to be selected and deselected using single click or touch.
Next up

Row selection works with row grouping, tree data, and the server-side row model. See the relevant documentation sections:

    Row Group Selection
    Tree Data Selection
    Server-Side Row Model Selection

Continue to the next section to learn about Multi-Row Selection.

    Single Row Selection
    Enabling Single Row Selection
    Removing Selection Checkboxes
    Configure Selectable Rows
    Customising the Checkbox Column
    Enable Click Selection & Deselection
    API Reference
    Next up

© AG Grid Ltd. 2015-2024

AG Grid Ltd registered in the United Kingdom. Company No. 07318192.
Documentation

    Getting Started
    Changelog
    Pipeline
    Documentation Archive

Support & Community

    Stack Overflow
    License & Pricing
    Support via Zendesk

The Company

    AG Charts
    About
    Blog
    Privacy Policy
    Cookies Policy
    Sitemap

Follow

Github
X
YouTube

    LinkedIn


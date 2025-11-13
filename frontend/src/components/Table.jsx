import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';

export default function Table({ rowData, columnDefs, onGridReady, height = 520 }) {
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    minWidth: 100,
    flex: 1,
  }), []);

  const paginationPageSizeSelector = useMemo(() => {
    return [10, 20, 50, 100];
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={paginationPageSizeSelector}
        onGridReady={onGridReady}
        suppressRowClickSelection={true}
        rowSelection="multiple"
        animateRows={true}
        enableCellTextSelection={true}
        ensureDomOrder={true}
      />
    </div>
  );
}
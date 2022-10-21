import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

/**
 * @component DataTable
 * @desc Create a sortable table with pagination
 * @param {Prop} rows-an array of objects
 * @param {Prop} columns-an array of objects with id referred to row's key
 * @param {Prop} itemsPerPage-number of displaying rows
 * @param {Prop} startPage-number of page to start with
 * @param {Prop} sortModel-determine initial state of sorting
 * @param {Prop} sortingOrder-determine the order of sorting
 * @param {Prop} onCellClick-function that fired on tables's cell click
 * @param {Prop} getRowClassName-function to assign class to a row
 * @param {Prop} className-optional prop to assign class to the component (somehow bind styling with MUI styled function)
 */

interface DataTableClasses {
  root: string;
  head: string;
  body: string;
  row: string;
  cell: string;
  footer: string;
}

// Classes for styling the component
export const dataTableClasses: DataTableClasses = {
  root: "mui-dataTable-root",
  head: "mui-dataTable-head",
  body: "mui-dataTable-body",
  row: "mui-dataTable-row",
  cell: "mui-dataTable-cell",
  footer: "mui-dataTable-footer",
};

interface Row {
  [key: string | number]: any;
}

/**
 * @interface Column
 * @desc Interface for table's column
 * @param {keyof Row} id should be the key of row
 * @param label displayed column's name
 * @param align the alignment of column
 * @param disablePadding change normal padding to none
 * @param valueGetter used to display combination of row's field
 */
export interface Column {
  id: keyof Row;
  label?: string | undefined;
  align?: "inherit" | "left" | "center" | "right" | "justify";
  disablePadding?: boolean;
  valueGetter?: (row: Row) => string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T | null) {
  if (orderBy === null) return 0;
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// sorting order
type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key | null
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// this method is created for cross-browser compatibility (IE11 support)
function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Row
  ) => void;
  columns: Column[];
  initOrder: Order;
  order: Order;
  orderBy: keyof Row | null;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { columns, initOrder, order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Row) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow className={dataTableClasses.head}>
        {columns.map((column) => (
          <TableCell
            className={dataTableClasses.head}
            key={column.id}
            align={column.align || "left"}
            padding={column.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === column.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : initOrder}
              onClick={createSortHandler(column.id)}
            >
              {column.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export type DataTableProps = {
  rows: Row[];
  columns: Column[];
  itemsPerPage: number;
  sortModel: {
    order: Order;
    orderBy?: keyof Row;
  };
  sortingOrder?: Order[];
  startPage?: number;
  className?: string;
  onCellClick: (params: any, event: React.MouseEvent<HTMLElement>) => void;
  getRowClassName?: (row: Row) => string;
};

function DataTable({
  rows,
  columns,
  itemsPerPage,
  startPage,
  sortModel = { order: "asc" },
  sortingOrder = ["asc", "desc"],
  onCellClick,
  getRowClassName,
  className,
}: DataTableProps) {
  const [sortingOrderIndex, setSortingOrderIndex] = React.useState<number>(
    sortingOrder.findIndex((el) => el === sortModel.order)
  );
  const [orderBy, setOrderBy] = React.useState<keyof Row | null>(
    sortModel?.orderBy || null
  );
  const [page, setPage] = React.useState(startPage || 0);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Row
  ) => {
    if (orderBy !== property) {
      setSortingOrderIndex(0);
    } else {
      setSortingOrderIndex(
        (sortingOrderIndex) => (sortingOrderIndex + 1) % sortingOrder.length
      );
    }
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Box className={className}>
      <TableContainer className={dataTableClasses.root}>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead
            columns={columns}
            initOrder={sortingOrder[0]}
            order={sortingOrder[sortingOrderIndex]}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody className={dataTableClasses.body}>
            {/* used to support IE11 */}
            {stableSort(
              rows,
              getComparator(sortingOrder[sortingOrderIndex], orderBy)
            )
              .slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage)
              .map((row, index) => (
                <TableRow
                  className={`${dataTableClasses.row} ${getRowClassName && getRowClassName(row)
                    }`}
                  hover
                  onClick={(e) => onCellClick(row.id, e)}
                  role="row"
                  tabIndex={-1}
                  key={row.id}
                >
                  {columns.map((column) => (
                    <TableCell
                      className={`${dataTableClasses.cell}`}
                      key={column.id}
                      component="th"
                      scope="row"
                      align={column.align || "left"}
                    >
                      {column.valueGetter
                        ? column.valueGetter(row)
                        : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className={`${dataTableClasses.footer}`}
        component="div"
        count={rows.length}
        rowsPerPage={itemsPerPage}
        rowsPerPageOptions={[itemsPerPage]}
        page={page}
        onPageChange={handleChangePage}
      />
    </Box>
  );
}

export default DataTable;

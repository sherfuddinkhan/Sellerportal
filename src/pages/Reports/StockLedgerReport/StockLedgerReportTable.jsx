//======================================================
// StockLedgerReportTable.jsx
// Part 1A
//======================================================

import React, {
  useCallback,
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import {
  formatDate,
  formatNumber,
  normalizeStockLedgerReport,
  getStockLedgerStatusColor,
} from "./StockLedgerReportHelpers";

//======================================================
// Columns
//======================================================

const DEFAULT_COLUMNS = [
  {
    key: "date",
    label: "Date",
    sortable: true,
  },
  {
    key: "voucherNumber",
    label: "Voucher No.",
    sortable: true,
  },
  {
    key: "voucherType",
    label: "Voucher Type",
    sortable: true,
  },
  {
    key: "stockItem",
    label: "Stock Item",
    sortable: true,
  },
  {
    key: "warehouse",
    label: "Warehouse",
    sortable: true,
  },
  {
    key: "transactionType",
    label: "Transaction",
    sortable: true,
  },
  {
    key: "inwardQuantity",
    label: "Inward",
    sortable: true,
  },
  {
    key: "outwardQuantity",
    label: "Outward",
    sortable: true,
  },
  {
    key: "closingQuantity",
    label: "Closing",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
];

//======================================================
// StockLedgerReportTable
//======================================================

const StockLedgerReportTable = ({
  reports = [],
  loading = false,
  columns = DEFAULT_COLUMNS,
  sortField = "date",
  sortDirection = "desc",
  onSort,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "No stock ledger records found.",
}) => {
  //====================================================
  // Normalize Reports
  //====================================================

  const normalizedReports = useMemo(() => {
    if (!Array.isArray(reports)) {
      return [];
    }

    return reports.map(
      (report) =>
        normalizeStockLedgerReport(
          report || {}
        )
    );
  }, [reports]);

  //====================================================
  // Sort Handler
  //====================================================

  const handleSort = useCallback(
    (column) => {
      if (
        !column?.sortable ||
        typeof onSort !== "function"
      ) {
        return;
      }

      let nextDirection = "asc";

      if (
        sortField === column.key
      ) {
        nextDirection =
          sortDirection === "asc"
            ? "desc"
            : "asc";
      }

      onSort(
        column.key,
        nextDirection
      );
    },
    [
      onSort,
      sortField,
      sortDirection,
    ]
  );

  //====================================================
  // Report ID
  //====================================================

  const getReportId = useCallback(
    (report, index) =>
      report?.id ??
      report?.reportId ??
      report?.stockLedgerId ??
      `stock-ledger-${index}`,
    []
  );

  //====================================================
  // Cell Value
  //====================================================

  const renderCellValue = useCallback(
    (report, column) => {
      const value =
        report?.[column.key];

      switch (column.key) {
        case "date":
          return formatDate(
            value
          );

        case "inwardQuantity":
        case "outwardQuantity":
        case "closingQuantity":
        case "balanceQuantity":
        case "quantity":
          return formatNumber(
            value
          );

        case "rate":
        case "amount":
          return formatNumber(
            value
          );

        case "stockItem":
          return (
            report.stockItem ||
            report.itemName ||
            "-"
          );

        case "warehouse":
          return (
            report.warehouse ||
            report.warehouseName ||
            "-"
          );

        case "status":
          return (
            <Typography
              component="span"
              variant="body2"
              sx={{
                color:
                  getStockLedgerStatusColor(
                    value
                  ) === "success"
                    ? "success.main"
                    : getStockLedgerStatusColor(
                        value
                      ) === "error"
                    ? "error.main"
                    : getStockLedgerStatusColor(
                        value
                      ) === "warning"
                    ? "warning.main"
                    : "text.primary",
                fontWeight: 600,
              }}
            >
              {value || "-"}
            </Typography>
          );

        default:
          return value ??
            value === 0
            ? value
            : "-";
      }
    },
    []
  );

  //======================================================
  // Loading State
  //======================================================

  if (
    loading &&
    normalizedReports.length === 0
  ) {
    return (
      <Paper
        className="stock-ledger-report-table"
        elevation={0}
        variant="outlined"
      >
        <Box
          sx={{
            minHeight: 260,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress />

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Loading stock ledger records...
          </Typography>
        </Box>
      </Paper>
    );
  }

  //======================================================
  // Empty State
  //======================================================

  if (
    !loading &&
    normalizedReports.length === 0
  ) {
    return (
      <Paper
        className="stock-ledger-report-table"
        elevation={0}
        variant="outlined"
      >
        <Box
          sx={{
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {emptyMessage}
          </Typography>
        </Box>
      </Paper>
    );
  }

  //======================================================
  // Render
  //======================================================

  return (
    <TableContainer
      component={Paper}
      className="stock-ledger-report-table"
      elevation={0}
      variant="outlined"
      sx={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Table
        stickyHeader
        size="small"
        sx={{
          minWidth: 1100,
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map(
              (column) => (
                <TableCell
                  key={column.key}
                  align={
                    [
                      "inwardQuantity",
                      "outwardQuantity",
                      "closingQuantity",
                      "quantity",
                      "rate",
                      "amount",
                    ].includes(
                      column.key
                    )
                      ? "right"
                      : "left"
                  }
                  onClick={() =>
                    handleSort(
                      column
                    )
                  }
                  sx={{
                    fontWeight: 700,
                    whiteSpace:
                      "nowrap",
                    cursor:
                      column.sortable
                        ? "pointer"
                        : "default",
                    userSelect:
                      "none",
                  }}
                >
                  {column.label}

                  {column.sortable &&
                    sortField ===
                      column.key && (
                      <Typography
                        component="span"
                        sx={{
                          ml: 0.5,
                          fontSize:
                            "0.75rem",
                        }}
                      >
                        {sortDirection ===
                        "asc"
                          ? "▲"
                          : "▼"}
                      </Typography>
                    )}
                </TableCell>
              )
            )}

            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                whiteSpace:
                  "nowrap",
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {normalizedReports.map(
            (
              report,
              index
            ) => {
              const reportId =
                getReportId(
                  report,
                  index
                );

              return (
                <TableRow
                  key={String(
                    reportId
                  )}
                  hover
                >
                  {columns.map(
                    (column) => (
                      <TableCell
                        key={
                          column.key
                        }
                        align={
                          [
                            "inwardQuantity",
                            "outwardQuantity",
                            "closingQuantity",
                            "quantity",
                            "rate",
                            "amount",
                          ].includes(
                            column.key
                          )
                            ? "right"
                            : "left"
                        }
                        sx={{
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {renderCellValue(
                          report,
                          column
                        )}
                      </TableCell>
                    )
                  )}

                  <TableCell
                    align="center"
                    sx={{
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    <Box
                      sx={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        gap: 0.5,
                      }}
                    >
                      {typeof onView ===
                        "function" && (
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() =>
                              onView(
                                report
                              )
                            }
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {typeof onEdit ===
                        "function" && (
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() =>
                              onEdit(
                                report
                              )
                            }
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {typeof onDelete ===
                        "function" && (
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              onDelete(
                                report
                              )
                            }
                          >
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

//======================================================
// PropTypes
//======================================================

StockLedgerReportTable.propTypes = {
  reports:
    PropTypes.arrayOf(
      PropTypes.object
    ),

  loading:
    PropTypes.bool,

  columns:
    PropTypes.arrayOf(
      PropTypes.shape({
        key:
          PropTypes.string
            .isRequired,

        label:
          PropTypes.string
            .isRequired,

        sortable:
          PropTypes.bool,
      })
    ),

  sortField:
    PropTypes.string,

  sortDirection:
    PropTypes.oneOf([
      "asc",
      "desc",
    ]),

  onSort:
    PropTypes.func,

  onView:
    PropTypes.func,

  onEdit:
    PropTypes.func,

  onDelete:
    PropTypes.func,

  emptyMessage:
    PropTypes.string,
};

//======================================================
// Default Props
//======================================================

StockLedgerReportTable.defaultProps = {
  reports: [],

  loading: false,

  columns:
    DEFAULT_COLUMNS,

  sortField:
    "date",

  sortDirection:
    "desc",

  onSort: null,

  onView: null,

  onEdit: null,

  onDelete: null,

  emptyMessage:
    "No stock ledger records found.",
};

//======================================================
// Export
//======================================================

export default StockLedgerReportTable;



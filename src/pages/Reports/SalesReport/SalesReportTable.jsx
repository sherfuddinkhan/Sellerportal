//======================================================
// SalesReportTable.jsx
// Part 1A
//======================================================

import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  DeleteOutline,
  EditOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import {
  Box,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  formatCurrency,
  formatDate,
  formatNumber,
  getStatusColor,
  normalizeSalesReport,
} from "./SalesReportHelpers";

//======================================================
// SalesReportTable
//======================================================

const SalesReportTable = ({
  reports = [],
  loading = false,
  sortField = "date",
  sortDirection = "desc",
  onSort,
  onView,
  onEdit,
  onDelete,
}) => {
  //====================================================
  // Safe Reports
  //====================================================

  const safeReports = useMemo(
    () =>
      Array.isArray(reports)
        ? reports
        : [],
    [reports]
  );

  //====================================================
  // Table Columns
  //====================================================

  const columns = useMemo(
    () => [
      {
        field: "date",
        label: "Date",
      },
      {
        field: "orderNumber",
        label: "Order No.",
      },
      {
        field: "customerName",
        label: "Customer",
      },
      {
        field: "productName",
        label: "Product",
      },
      {
        field: "quantity",
        label: "Quantity",
        align: "right",
      },
      {
        field: "salesAmount",
        label: "Sales Amount",
        align: "right",
      },
      {
        field: "taxAmount",
        label: "Tax",
        align: "right",
      },
      {
        field: "totalAmount",
        label: "Total",
        align: "right",
      },
      {
        field: "status",
        label: "Status",
      },
      {
        field: "actions",
        label: "Actions",
        sortable: false,
      },
    ],
    []
  );

  //====================================================
  // Sort Handler
  //====================================================

  const handleSort = (
    field
  ) => {
    if (
      field === "actions" ||
      typeof onSort !== "function"
    ) {
      return;
    }

    onSort(field);
  };

  //====================================================
  // Status Color
  //====================================================

  const getChipColor = (
    status
  ) => {
    const color =
      getStatusColor(status);

    const supportedColors = [
      "default",
      "primary",
      "secondary",
      "error",
      "info",
      "success",
      "warning",
    ];

    return supportedColors.includes(
      color
    )
      ? color
      : "default";
  };

  //====================================================
  // Sort Indicator
  //====================================================

  const getSortIndicator = (
    field
  ) => {
    if (
      field !== sortField
    ) {
      return "";
    }

    return sortDirection ===
      "asc"
      ? " ↑"
      : " ↓";
  };

  //====================================================
  // Loading Rows
  //====================================================

  const loadingRows = useMemo(
    () =>
      Array.from(
        {
          length: 5,
        },
        (_, index) => index
      ),
    []
  );
  //====================================================
  // Render
  //====================================================

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      className="sales-report-table"
      sx={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Table
        size="small"
        stickyHeader
        aria-label="Sales reports table"
      >
        {/*==============================================
            Table Header
        ==============================================*/}

        <TableHead>
          <TableRow>
            {columns.map(
              (column) => (
                <TableCell
                  key={column.field}
                  align={
                    column.align ||
                    "left"
                  }
                  sx={{
                    fontWeight: 700,
                    whiteSpace:
                      "nowrap",
                    cursor:
                      column.sortable ===
                      false
                        ? "default"
                        : "pointer",
                    userSelect:
                      "none",
                  }}
                  onClick={() =>
                    handleSort(
                      column.field
                    )
                  }
                >
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    justifyContent={
                      column.align ===
                      "right"
                        ? "flex-end"
                        : "flex-start"
                    }
                  >
                    <Typography
                      variant="body2"
                      fontWeight={700}
                    >
                      {column.label}
                    </Typography>

                    {column.sortable !==
                      false && (
                      <Typography
                        component="span"
                        variant="caption"
                        color={
                          column.field ===
                          sortField
                            ? "primary"
                            : "text.secondary"
                        }
                      >
                        {getSortIndicator(
                          column.field
                        )}
                      </Typography>
                    )}
                  </Stack>
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>

        {/*==============================================
            Table Body
        ==============================================*/}

        <TableBody>
          {loading &&
          safeReports.length === 0 ? (
            loadingRows.map(
              (row) => (
                <TableRow
                  key={`loading-${row}`}
                >
                  {columns.map(
                    (column) => (
                      <TableCell
                        key={
                          column.field
                        }
                        align={
                          column.align ||
                          "left"
                        }
                      >
                        <Skeleton
                          variant="text"
                          width={
                            column.field ===
                            "actions"
                              ? 90
                              : "80%"
                          }
                        />
                      </TableCell>
                    )
                  )}
                </TableRow>
              )
            )
          ) : safeReports.length ===
            0 ? (
            <TableRow>
              <TableCell
                colSpan={
                  columns.length
                }
              >
                <Box
                  sx={{
                    py: 6,
                    textAlign:
                      "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    color="text.secondary"
                  >
                    No sales reports found.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            safeReports.map(
              (
                report,
                index
              ) => {
                const item =
                  normalizeSalesReport(
                    report
                  );

                const reportId =
                  item.id ??
                  item.reportId ??
                  index;

                return (
                  <TableRow
                    hover
                    key={
                      reportId
                    }
                    className="sales-report-table-row"
                  >
                    {/*================================
                        Date
                    =================================*/}

                    <TableCell
                      sx={{
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {formatDate(
                        item.date
                      )}
                    </TableCell>

                    {/*================================
                        Order Number
                    =================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {item.orderNumber ||
                          item.invoiceNumber ||
                          item.orderId ||
                          "-"}
                      </Typography>
                    </TableCell>

                    {/*================================
                        Customer
                    =================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                      >
                        {item.customerName ||
                          item.customer ||
                          "-"}
                      </Typography>
                    </TableCell>

                    {/*================================
                        Product
                    =================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          minWidth: 140,
                        }}
                      >
                        {item.productName ||
                          item.product ||
                          item.itemName ||
                          "-"}
                      </Typography>
                    </TableCell>

                    {/*================================
                        Quantity
                    =================================*/}

                    <TableCell align="right">
                      {formatNumber(
                        item.quantity ??
                          item.totalQuantity ??
                          0,
                        0
                      )}
                    </TableCell>

                    {/*================================
                        Sales Amount
                    =================================*/}

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {formatCurrency(
                          item.salesAmount ??
                            item.totalSales ??
                            item.amount ??
                            0
                        )}
                      </Typography>
                    </TableCell>

                    {/*================================
                        Tax
                    =================================*/}

                    <TableCell align="right">
                      {formatCurrency(
                        item.taxAmount ??
                          item.tax ??
                          0
                      )}
                    </TableCell>

                    {/*================================
                        Total
                    =================================*/}

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {formatCurrency(
                          item.totalAmount ??
                            item.total ??
                            item.salesAmount ??
                            0
                        )}
                      </Typography>
                    </TableCell>

                    {/*================================
                        Status
                    =================================*/}

                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          item.status ||
                          "Pending"
                        }
                        color={getChipColor(
                          item.status
                        )}
                        className="sales-report-status"
                      />
                    </TableCell>

                    {/*================================
                        Actions
                    =================================*/}

                    <TableCell
                      align="right"
                    >
                      <Stack
                        direction="row"
                        spacing={0.25}
                        justifyContent="flex-end"
                      >
                        {onView && (
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                onView(
                                  report
                                )
                              }
                              aria-label="View sales report"
                            >
                              <VisibilityOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {onEdit && (
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                onEdit(
                                  report
                                )
                              }
                              aria-label="Edit sales report"
                            >
                              <EditOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {onDelete && (
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                onDelete(
                                  report
                                )
                              }
                              aria-label="Delete sales report"
                            >
                              <DeleteOutline fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              }
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

//======================================================
// PropTypes
//======================================================

SalesReportTable.propTypes = {
  reports:
    PropTypes.array,

  loading:
    PropTypes.bool,

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
};

//======================================================
// Default Props
//======================================================

SalesReportTable.defaultProps = {
  reports: [],

  loading: false,

  sortField: "date",

  sortDirection: "desc",

  onSort: null,

  onView: null,

  onEdit: null,

  onDelete: null,
};



export default SalesReportTable;



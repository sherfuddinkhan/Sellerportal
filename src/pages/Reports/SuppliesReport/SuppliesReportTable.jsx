//======================================================
// SuppliesReportTable.jsx
// Part 1A
//======================================================

import React from "react";

import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

//======================================================
// Helpers
//======================================================

const getValue = (
  report,
  ...fields
) => {
  for (const field of fields) {
    if (
      report?.[field] !==
        undefined &&
      report?.[field] !==
        null &&
      report?.[field] !== ""
    ) {
      return report[field];
    }
  }

  return "";
};

//======================================================
// Number Formatter
//======================================================

const formatNumber = (
  value
) => {
  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    )
  ) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  ).format(number);
};

//======================================================
// Currency Formatter
//======================================================

const formatCurrency = (
  value
) => {
  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    )
  ) {
    return "₹0.00";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }
  ).format(number);
};

//======================================================
// Date Formatter
//======================================================

const formatDate = (
  value
) => {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
};

//======================================================
// Status Color
//======================================================

const getStatusColor = (
  status
) => {
  const value =
    String(
      status || ""
    ).toLowerCase();

  if (
    [
      "active",
      "approved",
      "completed",
      "success",
    ].includes(value)
  ) {
    return "success";
  }

  if (
    [
      "pending",
      "draft",
      "processing",
    ].includes(value)
  ) {
    return "warning";
  }

  if (
    [
      "cancelled",
      "rejected",
      "failed",
      "inactive",
    ].includes(value)
  ) {
    return "error";
  }

  return "default";
};

//======================================================
// Sort Icon
//======================================================

const SortIcon = ({
  field,
  sortField,
  sortDirection,
}) => {
  if (
    field !== sortField
  ) {
    return null;
  }

  if (
    sortDirection ===
    "asc"
  ) {
    return (
      <ArrowUpwardIcon
        sx={{
          fontSize: 15,
          ml: 0.5,
        }}
      />
    );
  }

  return (
    <ArrowDownwardIcon
      sx={{
        fontSize: 15,
        ml: 0.5,
      }}
    />
  );
};

//======================================================
// SuppliesReportTable
//======================================================

const SuppliesReportTable = ({
  reports = [],
  loading = false,
  onView,
  onEdit,
  onSort,
  sortField = "date",
  sortDirection = "desc",
}) => {
  const reportList =
    Array.isArray(reports)
      ? reports
      : [];

  //====================================================
  // Sort Handler
  //====================================================

  const handleSort = (
    field
  ) => {
    if (
      typeof onSort ===
      "function"
    ) {
      onSort(field);
    }
  };

  //====================================================
  // View Handler
  //====================================================

  const handleView = (
    report
  ) => {
    if (
      typeof onView ===
      "function"
    ) {
      onView(report);
    }
  };

  //====================================================
  // Edit Handler
  //====================================================

  const handleEdit = (
    report
  ) => {
    if (
      typeof onEdit ===
      "function"
    ) {
      onEdit(report);
    }
  };

  //====================================================
  // Header Cell
  //====================================================

  const SortableHeader = ({
    field,
    children,
    align = "left",
  }) => (
    <TableCell
      align={align}
      onClick={() =>
        handleSort(field)
      }
      sx={{
        cursor:
          typeof onSort ===
          "function"
            ? "pointer"
            : "default",
        userSelect:
          "none",
        whiteSpace:
          "nowrap",
        fontWeight: 700,
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {children}

        <SortIcon
          field={field}
          sortField={
            sortField
          }
          sortDirection={
            sortDirection
          }
        />
      </Box>
    </TableCell>
  );

  //====================================================
  // Empty State
  //====================================================

  if (
    !loading &&
    reportList.length === 0
  ) {
    return (
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
          fontWeight={600}
        >
          No supplies reports found
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
          }}
        >
          There are no records to display.
        </Typography>
      </Paper>
    );
  }

  //====================================================
  // Render
  //====================================================

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      className="supplies-report__table-container"
    >
      <Table
        stickyHeader
        size="small"
        className="supplies-report__table"
      >
        {/*==============================================
            Table Head
        ===============================================*/}

        <TableHead>
          <TableRow>

            <SortableHeader
              field="date"
            >
              Date
            </SortableHeader>

            <SortableHeader
              field="supplier"
            >
              Supplier
            </SortableHeader>

            <SortableHeader
              field="stockItem"
            >
              Stock Item
            </SortableHeader>

            <SortableHeader
              field="category"
            >
              Category
            </SortableHeader>

            <SortableHeader
              field="voucherNumber"
            >
              Voucher No.
            </SortableHeader>

            <SortableHeader
              field="voucherType"
            >
              Voucher Type
            </SortableHeader>

            <SortableHeader
              field="warehouse"
            >
              Warehouse
            </SortableHeader>

            <SortableHeader
              field="quantity"
              align="right"
            >
              Quantity
            </SortableHeader>

            <SortableHeader
              field="rate"
              align="right"
            >
              Rate
            </SortableHeader>

            <SortableHeader
              field="amount"
              align="right"
            >
              Amount
            </SortableHeader>

            <SortableHeader
              field="status"
            >
              Status
            </SortableHeader>

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

        {/*==============================================
            Table Body
        ===============================================*/}

        <TableBody>
          {reportList.map(
            (
              report,
              index
            ) => {
              const reportId =
                report?.id ??
                report?.reportId ??
                report?.supplyId ??
                index;

              const date =
                getValue(
                  report,
                  "date",
                  "supplyDate",
                  "transactionDate",
                  "voucherDate"
                );

              const supplier =
                getValue(
                  report,
                  "supplier",
                  "supplierName",
                  "partyName",
                  "vendorName"
                );

              const stockItem =
                getValue(
                  report,
                  "stockItem",
                  "itemName",
                  "stockItemName",
                  "item"
                );

              const category =
                getValue(
                  report,
                  "category",
                  "categoryName",
                  "itemCategory"
                );

              const voucherNumber =
                getValue(
                  report,
                  "voucherNumber",
                  "voucherNo",
                  "documentNumber",
                  "docNo"
                );

              const voucherType =
                getValue(
                  report,
                  "voucherType",
                  "documentType",
                  "docType"
                );

              const warehouse =
                getValue(
                  report,
                  "warehouse",
                  "warehouseName",
                  "godown",
                  "location"
                );

              const quantity =
                getValue(
                  report,
                  "quantity",
                  "qty",
                  "supplyQuantity"
                );

              const rate =
                getValue(
                  report,
                  "rate",
                  "unitRate",
                  "price"
                );

              const amount =
                getValue(
                  report,
                  "amount",
                  "totalAmount",
                  "value",
                  "totalValue"
                );

              const status =
                getValue(
                  report,
                  "status",
                  "state"
                );

              return (
                <TableRow
                  key={
                    reportId
                  }
                  hover
                  className="supplies-report__table-row"
                >
                  {/*====================================
                      Date
                  =====================================*/}

                  <TableCell>
                    {formatDate(
                      date
                    )}
                  </TableCell>

                  {/*====================================
                      Supplier
                  =====================================*/}

                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {supplier ||
                        "-"}
                    </Typography>
                  </TableCell>

                  {/*====================================
                      Stock Item
                  =====================================*/}

                  <TableCell>
                    {stockItem ||
                      "-"}
                  </TableCell>

                  {/*====================================
                      Category
                  =====================================*/}

                  <TableCell>
                    {category ||
                      "-"}
                  </TableCell>

                  {/*====================================
                      Voucher Number
                  =====================================*/}

                  <TableCell>
                    {voucherNumber ||
                      "-"}
                  </TableCell>

                  {/*====================================
                      Voucher Type
                  =====================================*/}

                  <TableCell>
                    {voucherType ||
                      "-"}
                  </TableCell>

                  {/*====================================
                      Warehouse
                  =====================================*/}

                  <TableCell>
                    {warehouse ||
                      "-"}
                  </TableCell>

                  {/*====================================
                      Quantity
                  =====================================*/}

                  <TableCell
                    align="right"
                  >
                    {formatNumber(
                      quantity
                    )}
                  </TableCell>

                  {/*====================================
                      Rate
                  =====================================*/}

                  <TableCell
                    align="right"
                  >
                    {formatCurrency(
                      rate
                    )}
                  </TableCell>

                  {/*====================================
                      Amount
                  =====================================*/}

                  <TableCell
                    align="right"
                  >
                    <Typography
                      variant="body2"
                      fontWeight={700}
                    >
                      {formatCurrency(
                        amount
                      )}
                    </Typography>
                  </TableCell>

                  {/*====================================
                      Status
                  =====================================*/}

                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        status ||
                        "Unknown"
                      }
                      color={getStatusColor(
                        status
                      )}
                    />
                  </TableCell>

                  {/*====================================
                      Actions
                  =====================================*/}

                  <TableCell
                    align="center"
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
                      <Tooltip
                        title="View"
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleView(
                              report
                            )
                          }
                          disabled={
                            loading
                          }
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title="Edit"
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleEdit(
                              report
                            )
                          }
                          disabled={
                            loading
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
// Export
//======================================================

export default SuppliesReportTable;

//======================================================
// Part 1A Ends Here
//======================================================
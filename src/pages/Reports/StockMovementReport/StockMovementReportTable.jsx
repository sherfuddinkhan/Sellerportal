//======================================================
// StockMovementReportTable.jsx
// Part 1A
//======================================================

import React, {
  useCallback,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  CircularProgress,
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
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

//======================================================
// Columns
//======================================================

const COLUMNS = [
  {
    field: "date",
    label: "Date",
    align: "left",
    sortable: true,
  },
  {
    field: "stockItem",
    label: "Stock Item",
    align: "left",
    sortable: true,
  },
  {
    field: "movementType",
    label: "Movement Type",
    align: "left",
    sortable: true,
  },
  {
    field: "voucherNumber",
    label: "Voucher No.",
    align: "left",
    sortable: true,
  },
  {
    field: "voucherType",
    label: "Voucher Type",
    align: "left",
    sortable: true,
  },
  {
    field: "warehouse",
    label: "Warehouse",
    align: "left",
    sortable: true,
  },
  {
    field: "quantity",
    label: "Quantity",
    align: "right",
    sortable: true,
  },
  {
    field: "rate",
    label: "Rate",
    align: "right",
    sortable: true,
  },
  {
    field: "amount",
    label: "Amount",
    align: "right",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    align: "center",
    sortable: true,
  },
];

//======================================================
// Helpers
//======================================================

const getValue = (
  row,
  field
) => {
  if (!row) {
    return "";
  }

  return (
    row[field] ??
    ""
  );
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
    !Number.isFinite(number)
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
// Movement Type
//======================================================

const getMovementClass =
  (value) => {
    const movement =
      String(
        value || ""
      )
        .trim()
        .toLowerCase();

    if (
      movement.includes(
        "inward"
      ) ||
      movement.includes(
        "receipt"
      ) ||
      movement.includes(
        "purchase"
      )
    ) {
      return "stock-movement-report__transaction--inward";
    }

    if (
      movement.includes(
        "outward"
      ) ||
      movement.includes(
        "issue"
      ) ||
      movement.includes(
        "sales"
      )
    ) {
      return "stock-movement-report__transaction--outward";
    }

    if (
      movement.includes(
        "transfer"
      )
    ) {
      return "stock-movement-report__transaction--transfer";
    }

    if (
      movement.includes(
        "adjust"
      )
    ) {
      return "stock-movement-report__transaction--adjustment";
    }

    return "";
  };

//======================================================
// Status Class
//======================================================

const getStatusClass =
  (value) => {
    const status =
      String(
        value || ""
      )
        .trim()
        .toLowerCase();

    if (
      status ===
        "active" ||
      status ===
        "completed" ||
      status ===
        "success"
    ) {
      return "stock-movement-report__status--success";
    }

    if (
      status ===
        "pending" ||
      status ===
        "processing"
    ) {
      return "stock-movement-report__status--warning";
    }

    if (
      status ===
        "cancelled" ||
      status ===
        "canceled" ||
      status ===
        "failed"
    ) {
      return "stock-movement-report__status--error";
    }

    if (
      status ===
        "info" ||
      status ===
        "new"
    ) {
      return "stock-movement-report__status--info";
    }

    return "stock-movement-report__status--default";
  };

//======================================================
// StockMovementReportTable
//======================================================

const StockMovementReportTable = ({
  reports = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onSort,
  sortConfig,
}) => {
  //====================================================
  // Sort Handler
  //====================================================

  const handleSort =
    useCallback(
      (field) => {
        if (!onSort) {
          return;
        }

        const currentField =
          sortConfig?.field;

        const currentDirection =
          sortConfig?.direction ||
          "asc";

        let direction =
          "asc";

        if (
          currentField ===
          field
        ) {
          direction =
            currentDirection ===
            "asc"
              ? "desc"
              : "asc";
        }

        onSort(
          field,
          direction
        );
      },
      [
        onSort,
        sortConfig,
      ]
    );

  //====================================================
  // Loading State
  //====================================================

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: 260,
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  //====================================================
  // Empty State
  //====================================================

  if (
    !Array.isArray(
      reports
    ) ||
    reports.length === 0
  ) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: 220,
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          textAlign: "center",
          p: 3,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          No stock movement
          records available.
        </Typography>
      </Box>
    );
  }

  //====================================================
  // Render
  //====================================================

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      className="stock-movement-report__table-container"
      sx={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Table
        stickyHeader
        size="small"
        className="stock-movement-report__table"
      >

        {/*==============================================
            Table Head
        ===============================================*/}

        <TableHead>
          <TableRow>

            {COLUMNS.map(
              (column) => {
                const active =
                  sortConfig?.field ===
                  column.field;

                const direction =
                  sortConfig?.direction;

                return (
                  <TableCell
                    key={
                      column.field
                    }
                    align={
                      column.align
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
                    onClick={() => {
                      if (
                        column.sortable
                      ) {
                        handleSort(
                          column.field
                        );
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display:
                          "inline-flex",
                        alignItems:
                          "center",
                        gap: 0.5,
                      }}
                    >
                      {column.label}

                      {column.sortable &&
                        active &&
                        (direction ===
                        "asc" ? (
                          <ArrowUpwardIcon
                            sx={{
                              fontSize:
                                16,
                            }}
                          />
                        ) : (
                          <ArrowDownwardIcon
                            sx={{
                              fontSize:
                                16,
                            }}
                          />
                        ))}
                    </Box>
                  </TableCell>
                );
              }
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

        {/*==============================================
            Table Body
        ===============================================*/}

        <TableBody>
          {reports.map(
            (report, index) => {
              const rowId =
                report.id ??
                report.stockMovementId ??
                report.stockLedgerId ??
                index;

              const movementType =
                getValue(
                  report,
                  "movementType"
                );

              const status =
                getValue(
                  report,
                  "status"
                );

              return (
                <TableRow
                  hover
                  key={rowId}
                >

                  {/*====================================
                      Date
                  =====================================*/}

                  <TableCell>
                    {formatDate(
                      getValue(
                        report,
                        "date"
                      )
                    )}
                  </TableCell>

                  {/*====================================
                      Stock Item
                  =====================================*/}

                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {getValue(
                        report,
                        "stockItem"
                      ) ||
                        getValue(
                          report,
                          "itemName"
                        ) ||
                        "-"}
                    </Typography>
                  </TableCell>

                  {/*====================================
                      Movement Type
                  =====================================*/}

                  <TableCell>
                    <Box
                      component="span"
                      className={[
                        "stock-movement-report__transaction",
                        getMovementClass(
                          movementType
                        ),
                      ]
                        .filter(
                          Boolean
                        )
                        .join(" ")}
                    >
                      {movementType ||
                        "-"}
                    </Box>
                  </TableCell>

                  {/*====================================
                      Voucher Number
                  =====================================*/}

                  <TableCell>
                    {getValue(
                      report,
                      "voucherNumber"
                    ) ||
                      getValue(
                        report,
                        "documentNumber"
                      ) ||
                      "-"}
                  </TableCell>

                  {/*====================================
                      Voucher Type
                  =====================================*/}

                  <TableCell>
                    {getValue(
                      report,
                      "voucherType"
                    ) ||
                      "-"}
                  </TableCell>

                  {/*====================================
                      Warehouse
                  =====================================*/}

                  <TableCell>
                    {getValue(
                      report,
                      "warehouse"
                    ) ||
                      getValue(
                        report,
                        "godown"
                      ) ||
                      "-"}
                  </TableCell>

                  {/*====================================
                      Quantity
                  =====================================*/}

                  <TableCell
                    align="right"
                    className="stock-movement-report__quantity"
                  >
                    {formatNumber(
                      getValue(
                        report,
                        "quantity"
                      ) ||
                        getValue(
                          report,
                          "movementQuantity"
                        )
                    )}
                  </TableCell>

                  {/*====================================
                      Rate
                  =====================================*/}

                  <TableCell
                    align="right"
                    className="stock-movement-report__quantity"
                  >
                    {formatNumber(
                      getValue(
                        report,
                        "rate"
                      )
                    )}
                  </TableCell>

                  {/*====================================
                      Amount
                  =====================================*/}

                  <TableCell
                    align="right"
                    className="stock-movement-report__quantity"
                  >
                    {formatNumber(
                      getValue(
                        report,
                        "amount"
                      ) ||
                        getValue(
                          report,
                          "totalAmount"
                        )
                    )}
                  </TableCell>

                  {/*====================================
                      Status
                  =====================================*/}

                  <TableCell
                    align="center"
                  >
                    <Box
                      component="span"
                      className={[
                        "stock-movement-report__status",
                        getStatusClass(
                          status
                        ),
                      ]
                        .filter(
                          Boolean
                        )
                        .join(" ")}
                    >
                      {status ||
                        "Unknown"}
                    </Box>
                  </TableCell>

                  {/*====================================
                      Actions
                  =====================================*/}

                  <TableCell
                    align="center"
                  >
                    <Box
                      className="stock-movement-report__actions"
                      sx={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        gap: 0.25,
                      }}
                    >

                      {/* View */}

                      {onView && (
                        <Tooltip
                          title="View"
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              onView(
                                report
                              )
                            }
                            aria-label="View stock movement"
                          >
                            <VisibilityIcon
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Edit */}

                      {onEdit && (
                        <Tooltip
                          title="Edit"
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              onEdit(
                                report
                              )
                            }
                            aria-label="Edit stock movement"
                          >
                            <EditIcon
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Delete */}

                      {onDelete && (
                        <Tooltip
                          title="Delete"
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              onDelete(
                                report
                              )
                            }
                            aria-label="Delete stock movement"
                          >
                            <DeleteIcon
                              fontSize="small"
                            />
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

StockMovementReportTable.propTypes = {
  reports:
    PropTypes.arrayOf(
      PropTypes.object
    ),

  loading:
    PropTypes.bool,

  onView:
    PropTypes.func,

  onEdit:
    PropTypes.func,

  onDelete:
    PropTypes.func,

  onSort:
    PropTypes.func,

  sortConfig:
    PropTypes.shape({
      field:
        PropTypes.string,

      direction:
        PropTypes.oneOf([
          "asc",
          "desc",
        ]),
    }),
};

//======================================================
// Default Props
//======================================================

StockMovementReportTable.defaultProps = {
  reports: [],
  loading: false,
  onView: undefined,
  onEdit: undefined,
  onDelete: undefined,
  onSort: undefined,

  sortConfig: {
    field: "date",
    direction: "desc",
  },
};

//======================================================
// Export
//======================================================

export default StockMovementReportTable;

//======================================================
// Part 1A Ends Here
//======================================================
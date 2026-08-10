import React, {
  useCallback,
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
  CircularProgress,
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
  normalizeReturnReport,
} from "./ReturnReportHelpers";

//======================================================
// ReturnReportTable
//======================================================

const ReturnReportTable = ({
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
  // Table Columns
  //====================================================

  const columns = useMemo(
    () => [
      {
        id: "returnNumber",
        label: "Return No.",
        sortable: true,
        align: "left",
      },
      {
        id: "date",
        label: "Date",
        sortable: true,
        align: "left",
      },
      {
        id: "orderNumber",
        label: "Order No.",
        sortable: true,
        align: "left",
      },
      {
        id: "customerName",
        label: "Customer",
        sortable: true,
        align: "left",
      },
      {
        id: "productName",
        label: "Product",
        sortable: true,
        align: "left",
      },
      {
        id: "quantity",
        label: "Qty",
        sortable: true,
        align: "right",
      },
      {
        id: "returnAmount",
        label: "Return Amount",
        sortable: true,
        align: "right",
      },
      {
        id: "refundAmount",
        label: "Refund",
        sortable: true,
        align: "right",
      },
      {
        id: "reason",
        label: "Reason",
        sortable: true,
        align: "left",
      },
      {
        id: "status",
        label: "Status",
        sortable: true,
        align: "center",
      },
      {
        id: "actions",
        label: "Actions",
        sortable: false,
        align: "center",
      },
    ],
    []
  );

  //====================================================
  // Safe Reports
  //====================================================

  const normalizedReports = useMemo(
    () =>
      Array.isArray(reports)
        ? reports.map((report) =>
            normalizeReturnReport(
              report
            )
          )
        : [],
    [reports]
  );

  //====================================================
  // Sort Handler
  //====================================================

  const handleSort = useCallback(
    (field) => {
      if (
        !onSort ||
        !field
      ) {
        return;
      }

      onSort(field);
    },
    [onSort]
  );

  //====================================================
  // View Handler
  //====================================================

  const handleView = useCallback(
    (report) => {
      if (onView) {
        onView(report);
      }
    },
    [onView]
  );

  //====================================================
  // Edit Handler
  //====================================================

  const handleEdit = useCallback(
    (report) => {
      if (onEdit) {
        onEdit(report);
      }
    },
    [onEdit]
  );

  //====================================================
  // Delete Handler
  //====================================================

  const handleDelete =
    useCallback(
      (report) => {
        if (onDelete) {
          onDelete(report);
        }
      },
      [onDelete]
    );

  //====================================================
  // Sort Indicator
  //====================================================

  const getSortIndicator =
    useCallback(
      (field) => {
        if (
          sortField !== field
        ) {
          return "";
        }

        return sortDirection ===
          "asc"
          ? " ↑"
          : " ↓";
      },
      [
        sortField,
        sortDirection,
      ]
    );

  //====================================================
  // Loading Rows
  //====================================================

  const loadingRows = useMemo(
    () =>
      Array.from(
        { length: 6 },
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
      className="return-report-table-container"
      elevation={0}
    >
      <Table
        className="return-report-table"
        size="small"
        stickyHeader
      >
        {/*==============================================
            Table Header
        ==============================================*/}

        <TableHead>
          <TableRow>
            {columns.map(
              (column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  onClick={
                    column.sortable
                      ? () =>
                          handleSort(
                            column.id
                          )
                      : undefined
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
                      column.sortable
                        ? "none"
                        : "auto",
                  }}
                >
                  {column.label}

                  {column.sortable &&
                    getSortIndicator(
                      column.id
                    )}
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
          normalizedReports.length ===
            0 ? (
            loadingRows.map(
              (row) => (
                <TableRow
                  key={`loading-${row}`}
                >
                  {columns.map(
                    (column) => (
                      <TableCell
                        key={
                          column.id
                        }
                      >
                        <Skeleton
                          variant="text"
                          width={
                            column.id ===
                            "actions"
                              ? 80
                              : "90%"
                          }
                        />
                      </TableCell>
                    )
                  )}
                </TableRow>
              )
            )
          ) : normalizedReports.length ===
            0 ? (
            <TableRow>
              <TableCell
                colSpan={
                  columns.length
                }
                align="center"
              >
                <Box
                  sx={{
                    py: 6,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                  >
                    No Return Reports
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                    }}
                  >
                    No return records
                    are available.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            normalizedReports.map(
              (report, index) => {
                const reportId =
                  report?.id ??
                  report?.reportId ??
                  report?.returnId ??
                  `return-${index}`;

                return (
                  <TableRow
                    hover
                    key={String(
                      reportId
                    )}
                  >
                    {/* Return Number */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                      >
                        {report.returnNumber ||
                          report.returnOrderNumber ||
                          report.id ||
                          "-"}
                      </Typography>
                    </TableCell>

                    {/* Date */}

                    <TableCell
                      sx={{
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {formatDate(
                        report.date
                      )}
                    </TableCell>

                    {/* Order Number */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                      >
                        {report.orderNumber ||
                          report.orderId ||
                          "-"}
                      </Typography>
                    </TableCell>

                    {/* Customer */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                        title={
                          report.customerName ||
                          report.customer ||
                          ""
                        }
                      >
                        {report.customerName ||
                          report.customer ||
                          "-"}
                      </Typography>
                    </TableCell>

                    {/* Product */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                        title={
                          report.productName ||
                          report.product ||
                          ""
                        }
                      >
                        {report.productName ||
                          report.product ||
                          "-"}
                      </Typography>
                    </TableCell>

                    {/* Quantity */}

                    <TableCell
                      align="right"
                    >
                      {formatNumber(
                        report.quantity
                      )}
                    </TableCell>

                    {/* Return Amount */}

                    <TableCell
                      align="right"
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {formatCurrency(
                          report.returnAmount ??
                            report.totalAmount ??
                            report.amount
                        )}
                      </Typography>
                    </TableCell>

                    {/* Refund Amount */}

                    <TableCell
                      align="right"
                    >
                      {formatCurrency(
                        report.refundAmount
                      )}
                    </TableCell>

                    {/* Reason */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                        title={
                          report.reason ||
                          ""
                        }
                        sx={{
                          maxWidth: 180,
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                        }}
                      >
                        {report.reason ||
                          "-"}
                      </Typography>
                    </TableCell>

                    {/* Status */}

                    <TableCell
                      align="center"
                    >
                      <Box
                        component="span"
                        sx={{
                          display:
                            "inline-flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          px: 1,
                          py: 0.5,
                          borderRadius:
                            1.5,
                          fontSize:
                            "0.75rem",
                          fontWeight: 600,
                          color:
                            `${getStatusColor(
                              report.status
                            )}.main`,
                          backgroundColor:
                            "action.hover",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {report.status ||
                          "Pending"}
                      </Box>
                    </TableCell>

                    {/* Actions */}

                    <TableCell
                      align="center"
                    >
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                      >
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              handleView(
                                report
                              )
                            }
                          >
                            <VisibilityOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="inherit"
                            onClick={() =>
                              handleEdit(
                                report
                              )
                            }
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDelete(
                                report
                              )
                            }
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              }
            )
          )}
        </TableBody>
      </Table>

      {/*==============================================
          Loading Indicator
      ==============================================*/}

      {loading &&
        normalizedReports.length >
          0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              py: 1,
            }}
          >
            <CircularProgress
              size={18}
            />

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Updating report...
            </Typography>
          </Box>
        )}
    </TableContainer>
  );
};

//======================================================
// PropTypes
//======================================================

ReturnReportTable.propTypes = {
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

ReturnReportTable.defaultProps = {
  reports: [],

  loading: false,

  sortField: "date",

  sortDirection: "desc",

  onSort: () => {},

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},
};

//======================================================
// Export
//======================================================

export default ReturnReportTable;



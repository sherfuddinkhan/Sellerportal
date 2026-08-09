import React, {
  useCallback,
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Chip,
  IconButton,
  Paper,
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
  Delete,
  Edit,
  Visibility,
} from "@mui/icons-material";

import {
  formatCurrency,
  formatDate,
  getChannelName,
  getCustomerName,
  getOrderDate,
  getOrderNumber,
  getOrderStatus,
  getPaymentStatus,
  getQuantity,
  getSalesAmount,
  getStatusColor,
} from "./OrderReportHelpers";

//======================================================
// OrderReportTable
//======================================================

const OrderReportTable = ({
  reports = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onSort,
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
  // Sort State Handler
  //====================================================

  const handleSort = useCallback(
    (field) => {
      if (
        typeof onSort !==
        "function"
      ) {
        return;
      }

      onSort(
        field,
        "asc"
      );
    },
    [onSort]
  );

  //====================================================
  // Report Key
  //====================================================

  const getReportKey = useCallback(
    (report, index) =>
      report?.id ??
      report?.orderId ??
      report?.reportId ??
      index,
    []
  );

  //====================================================
  // Empty State
  //====================================================

  if (
    !loading &&
    safeReports.length === 0
  ) {
    return (
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            minHeight: 220,
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            p: 3,
          }}
        >
          <Stack
            spacing={1}
            alignItems="center"
            textAlign="center"
          >
            <Typography
              variant="h6"
              fontWeight={700}
            >
              No Order Reports
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              No order report
              records were found.
            </Typography>
          </Stack>
        </Box>
      </Paper>
    );
  }

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // Table
  //====================================================

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          maxHeight: 650,
          overflowX: "auto",
        }}
      >
        <Table
          stickyHeader
          size="small"
          sx={{
            minWidth: 1150,
          }}
        >
          {/*================================================
              Table Header
          =================================================*/}

          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                S.No
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleSort(
                    "orderNumber"
                  )
                }
              >
                Order Number
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleSort(
                    "orderDate"
                  )
                }
              >
                Order Date
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Customer
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Channel
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleSort(
                    "quantity"
                  )
                }
              >
                Quantity
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleSort(
                    "salesAmount"
                  )
                }
              >
                Sales Amount
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Order Status
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Payment Status
              </TableCell>

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

          {/*================================================
              Table Body
          =================================================*/}

          <TableBody>
            {safeReports.map(
              (report, index) => {
                const orderNumber =
                  getOrderNumber(
                    report
                  );

                const orderDate =
                  getOrderDate(
                    report
                  );

                const customerName =
                  getCustomerName(
                    report
                  );

                const channel =
                  getChannelName(
                    report
                  );

                const quantity =
                  getQuantity(
                    report
                  );

                const salesAmount =
                  getSalesAmount(
                    report
                  );

                const orderStatus =
                  getOrderStatus(
                    report
                  );

                const paymentStatus =
                  getPaymentStatus(
                    report
                  );

                return (
                  <TableRow
                    hover
                    key={getReportKey(
                      report,
                      index
                    )}
                  >
                    {/* S.No */}

                    <TableCell>
                      {index + 1}
                    </TableCell>

                    {/* Order Number */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                      >
                        {orderNumber ||
                          "N/A"}
                      </Typography>
                    </TableCell>

                    {/* Order Date */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                      >
                        {formatDate(
                          orderDate
                        )}
                      </Typography>
                    </TableCell>

                    {/* Customer */}

                    <TableCell
                      sx={{
                        maxWidth: 200,
                      }}
                    >
                      <Typography
                        variant="body2"
                        noWrap
                        title={
                          customerName
                        }
                      >
                        {customerName ||
                          "N/A"}
                      </Typography>
                    </TableCell>

                    {/* Channel */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                      >
                        {channel ||
                          "N/A"}
                      </Typography>
                    </TableCell>

                    {/* Quantity */}

                    <TableCell
                      align="right"
                    >
                      {Number(
                        quantity || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </TableCell>

                    {/* Sales Amount */}

                    <TableCell
                      align="right"
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                      >
                        {formatCurrency(
                          salesAmount
                        )}
                      </Typography>
                    </TableCell>

                    {/* Order Status */}

                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          orderStatus ||
                          "Unknown"
                        }
                        color={
                          getStatusColor(
                            orderStatus
                          )
                        }
                        variant="outlined"
                      />
                    </TableCell>

                    {/* Payment Status */}

                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          paymentStatus ||
                          "Unknown"
                        }
                        color={
                          getStatusColor(
                            paymentStatus
                          )
                        }
                        variant="outlined"
                      />
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
                              onView?.(
                                report
                              )
                            }
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              onEdit?.(
                                report
                              )
                            }
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              onDelete?.(
                                report
                              )
                            }
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

//======================================================
// PropTypes
//======================================================

OrderReportTable.propTypes = {
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
};

//======================================================
// Default Props
//======================================================

OrderReportTable.defaultProps = {
  reports: [],

  loading: false,

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},

  onSort: () => {},
};

//======================================================
// Export
//======================================================

export default OrderReportTable;

//======================================================
// OrderReportTable.jsx Complete
//======================================================
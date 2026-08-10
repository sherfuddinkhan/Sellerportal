
import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Delete,
  Edit,
  MoreVert,
  Visibility,
} from "@mui/icons-material";

import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
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
  formatCurrency,
  formatDate,
  getStatusColor,
  normalizePurchaseReport,
  toNumber,
} from "./PurchaseReportHelpers";

//======================================================
// PurchaseReportTable
//======================================================

const PurchaseReportTable = ({
  reports = [],
  loading = false,
  sortField = "date",
  sortDirection = "desc",
  onSort,
  onView,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  //====================================================
  // Menu State
  //====================================================

  const [menuAnchor, setMenuAnchor] =
    React.useState(null);

  const [selectedReport, setSelectedReport] =
    React.useState(null);

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
  // Normalized Reports
  //====================================================

  const normalizedReports =
    useMemo(() => {
      return safeReports.map(
        (report) =>
          normalizePurchaseReport(
            report
          )
      );
    }, [safeReports]);

  //====================================================
  // Menu Open
  //====================================================

  const handleMenuOpen = (
    event,
    report
  ) => {
    setMenuAnchor(
      event.currentTarget
    );

    setSelectedReport(report);
  };

  //====================================================
  // Menu Close
  //====================================================

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedReport(null);
  };

  //====================================================
  // View
  //====================================================

  const handleView = () => {
    if (selectedReport) {
      onView?.(selectedReport);
    }

    handleMenuClose();
  };

  //====================================================
  // Edit
  //====================================================

  const handleEdit = () => {
    if (selectedReport) {
      onEdit?.(selectedReport);
    }

    handleMenuClose();
  };

  //====================================================
  // Delete
  //====================================================

  const handleDelete = () => {
    if (selectedReport) {
      onDelete?.(selectedReport);
    }

    handleMenuClose();
  };

  //====================================================
  // Sort
  //====================================================

  const handleSort = (field) => {
    if (loading) {
      return;
    }

    onSort?.(field);
  };

  //====================================================
  // Sort Indicator
  //====================================================

  const getSortIndicator = (
    field
  ) => {
    if (
      sortField !== field
    ) {
      return "";
    }

    return sortDirection === "asc"
      ? " ↑"
      : " ↓";
  };
  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      className="purchase-report-table"
      variant="outlined"
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      <TableContainer>
        <Table
          stickyHeader
          size="small"
        >
          {/*============================================
              Table Header
          ============================================*/}

          <TableHead>
            <TableRow>
              <TableCell
                onClick={() =>
                  handleSort("date")
                }
                sx={{
                  cursor: loading
                    ? "default"
                    : "pointer",
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Date
                {getSortIndicator(
                  "date"
                )}
              </TableCell>

              <TableCell
                onClick={() =>
                  handleSort(
                    "purchaseOrderNumber"
                  )
                }
                sx={{
                  cursor: loading
                    ? "default"
                    : "pointer",
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Purchase Order
                {getSortIndicator(
                  "purchaseOrderNumber"
                )}
              </TableCell>

              <TableCell
                onClick={() =>
                  handleSort(
                    "supplierName"
                  )
                }
                sx={{
                  cursor: loading
                    ? "default"
                    : "pointer",
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Supplier
                {getSortIndicator(
                  "supplierName"
                )}
              </TableCell>

              <TableCell
                onClick={() =>
                  handleSort(
                    "marketplace"
                  )
                }
                sx={{
                  cursor: loading
                    ? "default"
                    : "pointer",
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Marketplace
                {getSortIndicator(
                  "marketplace"
                )}
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Product
              </TableCell>

              <TableCell
                align="right"
                onClick={() =>
                  handleSort(
                    "quantity"
                  )
                }
                sx={{
                  cursor: loading
                    ? "default"
                    : "pointer",
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Quantity
                {getSortIndicator(
                  "quantity"
                )}
              </TableCell>

              <TableCell
                align="right"
                onClick={() =>
                  handleSort(
                    "unitCost"
                  )
                }
                sx={{
                  cursor: loading
                    ? "default"
                    : "pointer",
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Unit Cost
                {getSortIndicator(
                  "unitCost"
                )}
              </TableCell>

              <TableCell
                align="right"
                onClick={() =>
                  handleSort(
                    "totalAmount"
                  )
                }
                sx={{
                  cursor: loading
                    ? "default"
                    : "pointer",
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Total Amount
                {getSortIndicator(
                  "totalAmount"
                )}
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Status
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

          {/*============================================
              Table Body
          ============================================*/}

          <TableBody>
            {normalizedReports.length ===
            0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  align="center"
                >
                  <Box
                    sx={{
                      py: 5,
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={600}
                    >
                      No purchase reports
                      found
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                      }}
                    >
                      There are no
                      purchase records
                      to display.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              normalizedReports.map(
                (
                  report,
                  index
                ) => {
                  const quantity =
                    toNumber(
                      report.quantity
                    );

                  const unitCost =
                    toNumber(
                      report.unitCost
                    );

                  const totalAmount =
                    toNumber(
                      report.totalAmount ??
                        report.purchaseAmount ??
                        report.amount
                    );

                  const status =
                    report.status ||
                    "Completed";

                  return (
                    <TableRow
                      hover
                      key={
                        report.id ??
                        report.reportId ??
                        report.purchaseReportId ??
                        report.purchaseOrderNumber ??
                        index
                      }
                      className="purchase-report-table-row"
                    >
                      {/* Date */}

                      <TableCell>
                        <Typography
                          variant="body2"
                          noWrap
                        >
                          {formatDate(
                            report.date
                          )}
                        </Typography>
                      </TableCell>

                      {/* Purchase Order */}

                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          noWrap
                        >
                          {report.purchaseOrderNumber ||
                            report.orderNumber ||
                            report.orderNo ||
                            "—"}
                        </Typography>
                      </TableCell>

                      {/* Supplier */}

                      <TableCell>
                        <Typography
                          variant="body2"
                          noWrap
                        >
                          {report.supplierName ||
                            report.supplier ||
                            "—"}
                        </Typography>
                      </TableCell>

                      {/* Marketplace */}

                      <TableCell>
                        <Typography
                          variant="body2"
                          noWrap
                        >
                          {report.marketplace ||
                            "—"}
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
                            "—"}
                        </Typography>
                      </TableCell>

                      {/* Quantity */}

                      <TableCell align="right">
                        {quantity}
                      </TableCell>

                      {/* Unit Cost */}

                      <TableCell align="right">
                        {formatCurrency(
                          unitCost
                        )}
                      </TableCell>

                      {/* Total */}

                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight={700}
                        >
                          {formatCurrency(
                            totalAmount
                          )}
                        </Typography>
                      </TableCell>

                      {/* Status */}

                      <TableCell>
                        <Chip
                          size="small"
                          label={status}
                          color={getStatusColor(
                            status
                          )}
                          variant="outlined"
                        />
                      </TableCell>

                      {/* Actions */}

                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={0.25}
                          justifyContent="center"
                        >
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={() =>
                                onView?.(
                                  report
                                )
                              }
                              disabled={
                                loading
                              }
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() =>
                                onEdit?.(
                                  report
                                )
                              }
                              disabled={
                                loading
                              }
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="More">
                            <IconButton
                              size="small"
                              onClick={(
                                event
                              ) =>
                                handleMenuOpen(
                                  event,
                                  report
                                )
                              }
                              disabled={
                                loading
                              }
                            >
                              <MoreVert fontSize="small" />
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
      </TableContainer>

      {/*==============================================
          Action Menu
      ==============================================*/}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(
          menuAnchor
        )}
        onClose={
          handleMenuClose
        }
      >
        <MenuItem
          onClick={
            handleView
          }
        >
          <Visibility
            fontSize="small"
            sx={{
              mr: 1,
            }}
          />
          View
        </MenuItem>

        <MenuItem
          onClick={
            handleEdit
          }
        >
          <Edit
            fontSize="small"
            sx={{
              mr: 1,
            }}
          />
          Edit
        </MenuItem>

        <MenuItem
          onClick={
            handleDelete
          }
          sx={{
            color:
              "error.main",
          }}
        >
          <Delete
            fontSize="small"
            sx={{
              mr: 1,
            }}
          />
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
};

//======================================================
// PropTypes
//======================================================

PurchaseReportTable.propTypes = {
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

  onRefresh:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

PurchaseReportTable.defaultProps = {
  reports: [],

  loading: false,

  sortField: "date",

  sortDirection: "desc",

  onSort: () => {},

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},

  onRefresh: () => {},
};

//======================================================
// Export
//======================================================

export default PurchaseReportTable;

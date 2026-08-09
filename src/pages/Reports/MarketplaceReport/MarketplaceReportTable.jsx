import React, {useCallback,useMemo} from "react";

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
  getCategory,
  getMarketplaceName,
  getOrderNumber,
  getProductName,
  getQuantity,
  getSalesAmount,
  getShipmentStatus,
  getShipmentStatusColor,
  getSku,
  getStatus,
  getStatusColor,
} from "./MarketplaceReportHelpers";

//======================================================
// MarketplaceReportTable
//======================================================

const MarketplaceReportTable = ({
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
  // Sort Handler
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
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Stack
            spacing={1}
            alignItems="center"
          >
            <Typography
              variant="h6"
              fontWeight={600}
            >
              No Marketplace Reports
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              No marketplace report
              records were found.
            </Typography>
          </Stack>
        </Box>
      </Paper>
    );
  }

  //====================================================
  // JSX
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
            minWidth: 1200,
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
                    "marketplace"
                  )
                }
              >
                Marketplace
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
                }}
              >
                Product
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                SKU
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
                Status
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Shipment
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Category
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Date
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
                const marketplace =
                  getMarketplaceName(
                    report
                  );

                const orderNumber =
                  getOrderNumber(
                    report
                  );

                const productName =
                  getProductName(
                    report
                  );

                const sku =
                  getSku(report);

                const quantity =
                  getQuantity(
                    report
                  );

                const salesAmount =
                  getSalesAmount(
                    report
                  );

                const status =
                  getStatus(report);

                const shipmentStatus =
                  getShipmentStatus(
                    report
                  );

                const category =
                  getCategory(
                    report
                  );

                const reportDate =
                  report?.reportDate ??
                  report?.date ??
                  report?.orderDate;

                return (
                  <TableRow
                    key={
                      report?.id ??
                      report?.reportId ??
                      report?.orderId ??
                      index
                    }
                    hover
                  >
                    {/* S.No */}

                    <TableCell>
                      {index + 1}
                    </TableCell>

                    {/* Marketplace */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                      >
                        {
                          marketplace
                        }
                      </Typography>
                    </TableCell>

                    {/* Order Number */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                      >
                        {
                          orderNumber
                        }
                      </Typography>
                    </TableCell>

                    {/* Product */}

                    <TableCell
                      sx={{
                        maxWidth: 220,
                      }}
                    >
                      <Typography
                        variant="body2"
                        noWrap
                        title={
                          productName
                        }
                      >
                        {
                          productName
                        }
                      </Typography>
                    </TableCell>

                    {/* SKU */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                      >
                        {sku}
                      </Typography>
                    </TableCell>

                    {/* Quantity */}

                    <TableCell
                      align="right"
                    >
                      {Number(
                        quantity
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

                    {/* Status */}

                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          status
                        }
                        color={
                          getStatusColor(
                            status
                          )
                        }
                        variant="outlined"
                      />
                    </TableCell>

                    {/* Shipment Status */}

                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          shipmentStatus
                        }
                        color={
                          getShipmentStatusColor(
                            shipmentStatus
                          )
                        }
                        variant="outlined"
                      />
                    </TableCell>

                    {/* Category */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                      >
                        {
                          category
                        }
                      </Typography>
                    </TableCell>

                    {/* Date */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                      >
                        {formatDate(
                          reportDate
                        )}
                      </Typography>
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

MarketplaceReportTable.propTypes = {
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

MarketplaceReportTable.defaultProps = {
  reports: [],

  loading: false,

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},

  onSort: () => {},
};
export default MarketplaceReportTable;

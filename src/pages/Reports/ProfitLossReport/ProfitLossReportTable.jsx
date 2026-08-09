import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Delete,
  Edit,
  Visibility,
} from "@mui/icons-material";

import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getProfitLossId,
  getReportDate,
  getMarketplaceName,
  getProductName,
  getRevenue,
  getTotalCost,
  getGrossProfit,
  getNetProfit,
} from "./ProfitLossReportHelpers";

//======================================================
// ProfitLossReportTable
//======================================================

const ProfitLossReportTable = ({
  reports = [],
  data = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onSort,
  sortField = "date",
  sortDirection = "desc",
}) => {
  //====================================================
  // Source Data
  //====================================================

  const reportData = useMemo(
    () =>
      Array.isArray(reports)
        ? reports
        : Array.isArray(data)
          ? data
          : [],
    [reports, data]
  );

  //====================================================
  // Sort Handler
  //====================================================

  const handleSort = (
    field
  ) => {
    const nextDirection =
      sortField === field &&
      sortDirection === "asc"
        ? "desc"
        : "asc";

    onSort?.(
      field,
      nextDirection
    );
  };

  //====================================================
  // Empty State
  //====================================================

  if (
    !loading &&
    reportData.length === 0
  ) {
    return (
      <Paper
        className="profit-loss-report-table-empty"
        variant="outlined"
        sx={{
          width: "100%",
          p: 5,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
        >
          No profit & loss reports found
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          There are no records matching
          the current search and filters.
        </Typography>
      </Paper>
    );
  }

  //====================================================
  // Table
  //====================================================

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      className="profit-loss-report-table-container"
      sx={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Table
        className="profit-loss-report-table"
        size="small"
        stickyHeader
        sx={{
          minWidth: 1200,
        }}
      >
        {/*==============================================
            Table Header
        ==============================================*/}

        <TableHead>
          <TableRow>
            <TableCell>
              Report ID
            </TableCell>

            <TableCell>
              <TableSortLabel
                active={
                  sortField === "date"
                }
                direction={
                  sortField === "date"
                    ? sortDirection
                    : "asc"
                }
                onClick={() =>
                  handleSort(
                    "date"
                  )
                }
              >
                Date
              </TableSortLabel>
            </TableCell>

            <TableCell>
              Order Number
            </TableCell>

            <TableCell>
              <TableSortLabel
                active={
                  sortField ===
                  "marketplace"
                }
                direction={
                  sortField ===
                  "marketplace"
                    ? sortDirection
                    : "asc"
                }
                onClick={() =>
                  handleSort(
                    "marketplace"
                  )
                }
              >
                Marketplace
              </TableSortLabel>
            </TableCell>

            <TableCell>
              Product
            </TableCell>

            <TableCell align="right">
              <TableSortLabel
                active={
                  sortField ===
                  "revenue"
                }
                direction={
                  sortField ===
                  "revenue"
                    ? sortDirection
                    : "asc"
                }
                onClick={() =>
                  handleSort(
                    "revenue"
                  )
                }
              >
                Revenue
              </TableSortLabel>
            </TableCell>

            <TableCell align="right">
              <TableSortLabel
                active={
                  sortField ===
                  "totalCost"
                }
                direction={
                  sortField ===
                  "totalCost"
                    ? sortDirection
                    : "asc"
                }
                onClick={() =>
                  handleSort(
                    "totalCost"
                  )
                }
              >
                Total Cost
              </TableSortLabel>
            </TableCell>

            <TableCell align="right">
              Gross Profit
            </TableCell>

            <TableCell align="right">
              Net Profit
            </TableCell>

            <TableCell>
              Status
            </TableCell>

            <TableCell
              align="right"
              sx={{
                position: "sticky",
                right: 0,
                backgroundColor:
                  "background.paper",
                zIndex: 2,
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        {/*==============================================
            Table Body
        ==============================================*/}

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={11}
                align="center"
                sx={{
                  py: 6,
                }}
              >
                <CircularProgress
                  size={30}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1.5,
                  }}
                >
                  Loading profit & loss
                  reports...
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            reportData.map(
              (
                report,
                index
              ) => {
                const reportId =
                  getProfitLossId(
                    report
                  );

                const reportDate =
                  getReportDate(
                    report
                  );

                const marketplace =
                  getMarketplaceName(
                    report
                  );

                const product =
                  getProductName(
                    report
                  );

                const revenue =
                  getRevenue(
                    report
                  );

                const totalCost =
                  getTotalCost(
                    report
                  );

                const grossProfit =
                  getGrossProfit(
                    report
                  );

                const netProfit =
                  getNetProfit(
                    report
                  );

                const status =
                  report?.status ??
                  report?.profitLossStatus ??
                  "";

                //========================================
                // Part 1A Ends Here
                //========================================
                return (
                  <TableRow
                    key={
                      reportId ??
                      `profit-loss-row-${index}`
                    }
                    hover
                    className="profit-loss-report-table-row"
                  >
                    {/*==================================
                        Report ID
                    ==================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {reportId || "—"}
                      </Typography>
                    </TableCell>

                    {/*==================================
                        Date
                    ==================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        whiteSpace="nowrap"
                      >
                        {formatDate(
                          reportDate
                        )}
                      </Typography>
                    </TableCell>

                    {/*==================================
                        Order Number
                    ==================================*/}

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {report?.orderNumber ??
                          report?.orderNo ??
                          report?.orderID ??
                          "—"}
                      </Typography>
                    </TableCell>

                    {/*==================================
                        Marketplace
                    ==================================*/}

                    <TableCell>
                      <Typography variant="body2">
                        {marketplace || "—"}
                      </Typography>
                    </TableCell>

                    {/*==================================
                        Product
                    ==================================*/}

                    <TableCell
                      sx={{
                        maxWidth: 220,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace:
                            "nowrap",
                        }}
                        title={
                          product || ""
                        }
                      >
                        {product || "—"}
                      </Typography>
                    </TableCell>

                    {/*==================================
                        Revenue
                    ==================================*/}

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {formatCurrency(
                          revenue
                        )}
                      </Typography>
                    </TableCell>

                    {/*==================================
                        Total Cost
                    ==================================*/}

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {formatCurrency(
                          totalCost
                        )}
                      </Typography>
                    </TableCell>

                    {/*==================================
                        Gross Profit
                    ==================================*/}

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={
                          grossProfit >= 0
                            ? "success.main"
                            : "error.main"
                        }
                        whiteSpace="nowrap"
                      >
                        {formatCurrency(
                          grossProfit
                        )}
                      </Typography>
                    </TableCell>

                    {/*==================================
                        Net Profit
                    ==================================*/}

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={
                          netProfit >= 0
                            ? "success.main"
                            : "error.main"
                        }
                        whiteSpace="nowrap"
                      >
                        {formatCurrency(
                          netProfit
                        )}
                      </Typography>
                    </TableCell>

                    {/*==================================
                        Status
                    ==================================*/}

                    <TableCell>
                      {status ? (
                        <Chip
                          size="small"
                          label={status}
                          color={getStatusColor(
                            status
                          )}
                        />
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    {/*==================================
                        Actions
                    ==================================*/}

                    <TableCell
                      align="right"
                      sx={{
                        position: "sticky",
                        right: 0,
                        backgroundColor:
                          "background.paper",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "flex-end",
                          gap: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          title="View"
                          onClick={() =>
                            onView?.(
                              report
                            )
                          }
                        >
                          <Visibility fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="primary"
                          title="Edit"
                          onClick={() =>
                            onEdit?.(
                              report
                            )
                          }
                        >
                          <Edit fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          title="Delete"
                          onClick={() =>
                            onDelete?.(
                              report
                            )
                          }
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
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

ProfitLossReportTable.propTypes = {
  reports: PropTypes.array,

  data: PropTypes.array,

  loading: PropTypes.bool,

  onView: PropTypes.func,

  onEdit: PropTypes.func,

  onDelete: PropTypes.func,

  onSort: PropTypes.func,

  sortField: PropTypes.string,

  sortDirection:
    PropTypes.oneOf([
      "asc",
      "desc",
    ]),
};

//======================================================
// Default Props
//======================================================

ProfitLossReportTable.defaultProps = {
  reports: [],

  data: [],

  loading: false,

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},

  onSort: () => {},

  sortField: "date",

  sortDirection: "desc",
};

//======================================================
// Export
//======================================================

export default ProfitLossReportTable;



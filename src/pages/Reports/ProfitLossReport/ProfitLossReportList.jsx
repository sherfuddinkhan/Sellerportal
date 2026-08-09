import React from "react";

import PropTypes from "prop-types";

import {
  Edit,
  Visibility,
  Delete,
} from "@mui/icons-material";

import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
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
// ProfitLossReportList
//======================================================

const ProfitLossReportList = ({
  reports = [],
  data = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) => {
  //====================================================
  // Source Data
  //====================================================

  const reportData =
    Array.isArray(reports)
      ? reports
      : Array.isArray(data)
        ? data
        : [];

  //====================================================
  // Loading State
  //====================================================

  if (loading) {
    return (
      <Box
        className="profit-loss-report-list-loading"
        sx={{
          width: "100%",
          minHeight: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  //====================================================
  // Empty State
  //====================================================

  if (reportData.length === 0) {
    return (
      <Box
        className="profit-loss-report-empty"
        sx={{
          width: "100%",
          py: 5,
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
          Try changing the search or
          filter criteria.
        </Typography>
      </Box>
    );
  }

  //====================================================
  // Report Item
  //====================================================

  const renderReport = (
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

    return (
      <Card
        key={
          reportId ??
          `profit-loss-${index}`
        }
        className="profit-loss-report-list-card"
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Stack spacing={1.5}>
            {/*==========================================
                Header
            ==========================================*/}

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent:
                  "space-between",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  noWrap
                >
                  {product ||
                    "Profit & Loss Entry"}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {marketplace ||
                    "Marketplace"}{" "}
                  •{" "}
                  {formatDate(
                    reportDate
                  )}
                </Typography>
              </Box>

              {status && (
                <Chip
                  size="small"
                  label={status}
                  color={getStatusColor(
                    status
                  )}
                />
              )}
            </Box>

            <Divider />

            {/*==========================================
                Financial Details
            ==========================================*/}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 1.5,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Revenue
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {formatCurrency(
                    revenue
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Total Cost
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {formatCurrency(
                    totalCost
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Gross Profit
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={
                    grossProfit >= 0
                      ? "success.main"
                      : "error.main"
                  }
                >
                  {formatCurrency(
                    grossProfit
                  )}
                </Typography>
              </Box>

  //====================================================
  // Part 1A Ends Here
  //====================================================
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Net Profit
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={700}
                  color={
                    netProfit >= 0
                      ? "success.main"
                      : "error.main"
                  }
                >
                  {formatCurrency(
                    netProfit
                  )}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/*==========================================
                Actions
            ==========================================*/}

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "flex-end",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <IconButton
                size="small"
                color="primary"
                title="View"
                onClick={() =>
                  onView?.(report)
                }
              >
                <Visibility
                  fontSize="small"
                />
              </IconButton>

              <IconButton
                size="small"
                color="primary"
                title="Edit"
                onClick={() =>
                  onEdit?.(report)
                }
              >
                <Edit
                  fontSize="small"
                />
              </IconButton>

              <IconButton
                size="small"
                color="error"
                title="Delete"
                onClick={() =>
                  onDelete?.(report)
                }
              >
                <Delete
                  fontSize="small"
                />
              </IconButton>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="profit-loss-report-list"
      sx={{
        width: "100%",
      }}
    >
      <Stack spacing={1.5}>
        {reportData.map(
          renderReport
        )}
      </Stack>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

ProfitLossReportList.propTypes = {
  reports:
    PropTypes.array,

  data:
    PropTypes.array,

  loading:
    PropTypes.bool,

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

ProfitLossReportList.defaultProps = {
  reports: [],

  data: [],

  loading: false,

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},
};

//======================================================
// Export
//======================================================

export default ProfitLossReportList;


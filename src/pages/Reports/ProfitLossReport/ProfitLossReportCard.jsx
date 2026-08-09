import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  AccountBalance,
  AttachMoney,
  TrendingDown,
  TrendingUp,
} from "@mui/icons-material";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  formatCurrency,
  formatNumber,
} from "./ProfitLossReportHelpers";

//======================================================
// ProfitLossReportCard
//======================================================

const ProfitLossReportCard = ({
  reports = [],
  data = [],
  statistics = null,
  loading = false,
}) => {
  //====================================================
  // Source Data
  //====================================================

  const reportData =
    useMemo(
      () =>
        Array.isArray(reports)
          ? reports
          : Array.isArray(data)
            ? data
            : [],
      [reports, data]
    );

  //====================================================
  // Calculate Summary
  //====================================================

  const summary =
    useMemo(() => {
      if (statistics) {
        return {
          totalRevenue:
            Number(
              statistics.totalRevenue ??
                statistics.revenue ??
                0
            ) || 0,

          totalCost:
            Number(
              statistics.totalCost ??
                statistics.cost ??
                statistics.cogs ??
                0
            ) || 0,

          grossProfit:
            Number(
              statistics.grossProfit ??
                0
            ) || 0,

          operatingExpenses:
            Number(
              statistics.operatingExpenses ??
                statistics.expenses ??
                0
            ) || 0,

          netProfit:
            Number(
              statistics.netProfit ??
                statistics.profit ??
                0
            ) || 0,

          grossMargin:
            Number(
              statistics.grossMargin ??
                0
            ) || 0,

          netMargin:
            Number(
              statistics.netMargin ??
                0
            ) || 0,

          totalOrders:
            Number(
              statistics.totalOrders ??
                statistics.orders ??
                reportData.length
            ) || 0,
        };
      }

      const totalRevenue =
        reportData.reduce(
          (total, report) =>
            total +
            (Number(
              report?.revenue ??
                report?.totalRevenue ??
                report?.salesAmount ??
                0
            ) || 0),
          0
        );

      const totalCost =
        reportData.reduce(
          (total, report) =>
            total +
            (Number(
              report?.cost ??
                report?.totalCost ??
                report?.cogs ??
                report?.costOfGoodsSold ??
                0
            ) || 0),
          0
        );

      const grossProfit =
        reportData.reduce(
          (total, report) =>
            total +
            (Number(
              report?.grossProfit ??
                0
            ) || 0),
          0
        ) ||
        totalRevenue -
          totalCost;

      const operatingExpenses =
        reportData.reduce(
          (total, report) =>
            total +
            (Number(
              report?.operatingExpenses ??
                report?.expenses ??
                0
            ) || 0),
          0
        );

      const netProfit =
        reportData.reduce(
          (total, report) =>
            total +
            (Number(
              report?.netProfit ??
                report?.profit ??
                0
            ) || 0),
          0
        ) ||
        grossProfit -
          operatingExpenses;

      const grossMargin =
        totalRevenue > 0
          ? (grossProfit /
              totalRevenue) *
            100
          : 0;

      const netMargin =
        totalRevenue > 0
          ? (netProfit /
              totalRevenue) *
            100
          : 0;

      return {
        totalRevenue,
        totalCost,
        grossProfit,
        operatingExpenses,
        netProfit,
        grossMargin,
        netMargin,
        totalOrders:
          reportData.length,
      };
    }, [
      statistics,
      reportData,
    ]);

  //====================================================
  // Card Configuration
  //====================================================

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(
        summary.totalRevenue
      ),
      subtitle:
        `${formatNumber(
          summary.totalOrders
        )} orders`,
      icon: AttachMoney,
      type: "revenue",
    },

    {
      title: "Total Cost",
      value: formatCurrency(
        summary.totalCost
      ),
      subtitle:
        "Cost of goods sold",
      icon: AccountBalance,
      type: "cost",
    },

    {
      title: "Gross Profit",
      value: formatCurrency(
        summary.grossProfit
      ),
      subtitle:
        `${summary.grossMargin.toFixed(
          2
        )}% gross margin`,
      icon:
        summary.grossProfit >= 0
          ? TrendingUp
          : TrendingDown,
      type:
        summary.grossProfit >= 0
          ? "profit"
          : "loss",
    },

  //====================================================
  // Part 1A Ends Here
  //====================================================
    {
      title: "Operating Expenses",
      value: formatCurrency(
        summary.operatingExpenses
      ),
      subtitle:
        "Operating costs",
      icon: TrendingDown,
      type: "expense",
    },

    {
      title: "Net Profit",
      value: formatCurrency(
        summary.netProfit
      ),
      subtitle:
        `${summary.netMargin.toFixed(
          2
        )}% net margin`,
      icon:
        summary.netProfit >= 0
          ? TrendingUp
          : TrendingDown,
      type:
        summary.netProfit >= 0
          ? "profit"
          : "loss",
    },
  ];

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="profit-loss-report-card"
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
      >
        {cards.map(
          (card) => {
            const Icon =
              card.icon;

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2.4}
                key={
                  card.title
                }
              >
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Stack
                      spacing={1.5}
                    >
                      {/* Card Header */}

                      <Box
                        sx={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "space-between",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          {
                            card.title
                          }
                        </Typography>

                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius:
                              "50%",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            bgcolor:
                              "action.hover",
                          }}
                        >
                          <Icon
                            fontSize="small"
                          />
                        </Box>
                      </Box>

                      {/* Value */}

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {loading
                          ? "—"
                          : card.value}
                      </Typography>

                      {/* Subtitle */}

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {
                          card.subtitle
                        }
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          }
        )}
      </Grid>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

ProfitLossReportCard.propTypes =
  {
    reports:
      PropTypes.array,

    data:
      PropTypes.array,

    statistics:
      PropTypes.object,

    loading:
      PropTypes.bool,
  };

//======================================================
// Default Props
//======================================================

ProfitLossReportCard.defaultProps =
  {
    reports: [],

    data: [],

    statistics: null,

    loading: false,
  };

//======================================================
// Export
//======================================================

export default ProfitLossReportCard;



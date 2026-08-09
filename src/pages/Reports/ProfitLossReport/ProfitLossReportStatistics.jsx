import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  AccountBalance,
  AttachMoney,
  Percent,
  ReceiptLong,
  TrendingDown,
  TrendingUp,
} from "@mui/icons-material";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  formatCurrency,
  formatNumber,
} from "./ProfitLossReportHelpers";

//======================================================
// ProfitLossReportStatistics
//======================================================

const ProfitLossReportStatistics = ({
  statistics = null,
  reports = [],
  data = [],
  loading = false,
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
  // Calculate Statistics
  //====================================================

  const summary = useMemo(() => {
    if (statistics) {
      const totalRevenue =
        Number(
          statistics.totalRevenue ??
            statistics.revenue ??
            statistics.totalSales ??
            0
        ) || 0;

      const totalCost =
        Number(
          statistics.totalCost ??
            statistics.cost ??
            statistics.cogs ??
            statistics.costOfGoodsSold ??
            0
        ) || 0;

      const grossProfit =
        Number(
          statistics.grossProfit ??
            totalRevenue - totalCost
        ) || 0;

      const operatingExpenses =
        Number(
          statistics.operatingExpenses ??
            statistics.expenses ??
            0
        ) || 0;

      const netProfit =
        Number(
          statistics.netProfit ??
            statistics.profit ??
            grossProfit -
              operatingExpenses
        ) || 0;

      const grossMargin =
        Number(
          statistics.grossMargin ??
            (totalRevenue > 0
              ? (grossProfit /
                  totalRevenue) *
                100
              : 0)
        ) || 0;

      const netMargin =
        Number(
          statistics.netMargin ??
            (totalRevenue > 0
              ? (netProfit /
                  totalRevenue) *
                100
              : 0)
        ) || 0;

      const totalOrders =
        Number(
          statistics.totalOrders ??
            statistics.orders ??
            reportData.length
        ) || 0;

      return {
        totalRevenue,
        totalCost,
        grossProfit,
        operatingExpenses,
        netProfit,
        grossMargin,
        netMargin,
        totalOrders,
      };
    }

    const totalRevenue =
      reportData.reduce(
        (sum, report) =>
          sum +
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
        (sum, report) =>
          sum +
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
        (sum, report) =>
          sum +
          (Number(
            report?.grossProfit ??
              0
          ) || 0),
        0
      ) ||
      totalRevenue - totalCost;

    const operatingExpenses =
      reportData.reduce(
        (sum, report) =>
          sum +
          (Number(
            report?.operatingExpenses ??
              report?.expenses ??
              0
          ) || 0),
        0
      );

    const netProfit =
      reportData.reduce(
        (sum, report) =>
          sum +
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
  // Statistics Cards
  //====================================================

  const cards = [
    {
      key: "revenue",
      title: "Total Revenue",
      value: formatCurrency(
        summary.totalRevenue
      ),
      subtitle: `${formatNumber(
        summary.totalOrders
      )} orders`,
      icon: AttachMoney,
      color: "primary",
    },

    {
      key: "cost",
      title: "Total Cost",
      value: formatCurrency(
        summary.totalCost
      ),
      subtitle:
        "Cost of goods sold",
      icon: AccountBalance,
      color: "warning",
    },

    {
      key: "gross-profit",
      title: "Gross Profit",
      value: formatCurrency(
        summary.grossProfit
      ),
      subtitle: `${summary.grossMargin.toFixed(
        2
      )}% gross margin`,
      icon:
        summary.grossProfit >= 0
          ? TrendingUp
          : TrendingDown,
      color:
        summary.grossProfit >= 0
          ? "success"
          : "error",
    },

    {
      key: "expenses",
      title: "Operating Expenses",
      value: formatCurrency(
        summary.operatingExpenses
      ),
      subtitle:
        "Operating expenses",
      icon: TrendingDown,
      color: "warning",
    },

    {
      key: "net-profit",
      title: "Net Profit",
      value: formatCurrency(
        summary.netProfit
      ),
      subtitle: `${summary.netMargin.toFixed(
        2
      )}% net margin`,
      icon:
        summary.netProfit >= 0
          ? TrendingUp
          : TrendingDown,
      color:
        summary.netProfit >= 0
          ? "success"
          : "error",
    },

    {
      key: "net-margin",
      title: "Net Margin",
      value: `${summary.netMargin.toFixed(
        2
      )}%`,
      subtitle:
        "Profitability ratio",
      icon: Percent,
      color:
        summary.netMargin >= 0
          ? "success"
          : "error",
    },

    {
      key: "orders",
      title: "Total Orders",
      value: formatNumber(
        summary.totalOrders
      ),
      subtitle:
        "Reported transactions",
      icon: ReceiptLong,
      color: "info",
    },
  ];
  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="profit-loss-report-statistics"
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={card.key}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Stack spacing={1.5}>
                    {/*================================
                        Header
                    =================================*/}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "space-between",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        {card.title}
                      </Typography>

                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "center",
                          bgcolor: `${card.color}.lighter`,
                        }}
                      >
                        <Icon
                          fontSize="small"
                        />
                      </Box>
                    </Box>

                    {/*================================
                        Value
                    =================================*/}

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        minHeight: 29,
                      }}
                    >
                      {loading ? (
                        <CircularProgress
                          size={22}
                        />
                      ) : (
                        card.value
                      )}
                    </Typography>

                    {/*================================
                        Subtitle
                    =================================*/}

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {card.subtitle}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

ProfitLossReportStatistics.propTypes = {
  statistics:
    PropTypes.object,

  reports:
    PropTypes.array,

  data:
    PropTypes.array,

  loading:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

ProfitLossReportStatistics.defaultProps = {
  statistics: null,

  reports: [],

  data: [],

  loading: false,
};

//======================================================
// Export
//======================================================

export default ProfitLossReportStatistics;

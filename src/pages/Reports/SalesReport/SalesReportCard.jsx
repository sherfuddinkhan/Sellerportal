//======================================================
// SalesReportCard.jsx
// Part 1A
//======================================================

import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Assessment,
  CurrencyRupee,
  ShoppingCart,
  TrendingUp,
} from "@mui/icons-material";

import {
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import {
  formatCurrency,
  formatNumber,
} from "./SalesReportHelpers";

//======================================================
// SalesReportCard
//======================================================

const SalesReportCard = ({
  statistics = {},
  loading = false,
}) => {
  //====================================================
  // Safe Statistics
  //====================================================

  const safeStatistics = useMemo(
    () => ({
      totalSales:
        statistics?.totalSales ??
        statistics?.totalSalesAmount ??
        statistics?.salesAmount ??
        0,

      totalOrders:
        statistics?.totalOrders ??
        statistics?.orderCount ??
        statistics?.orders ??
        0,

      totalQuantity:
        statistics?.totalQuantity ??
        statistics?.quantitySold ??
        statistics?.soldQuantity ??
        0,

      averageOrderValue:
        statistics?.averageOrderValue ??
        statistics?.avgOrderValue ??
        statistics?.averageSale ??
        0,
    }),
    [statistics]
  );

  //====================================================
  // Card Configuration
  //====================================================

  const cards = useMemo(
    () => [
      {
        key: "totalSales",
        title: "Total Sales",
        value: formatCurrency(
          safeStatistics.totalSales
        ),
        icon: (
          <CurrencyRupee />
        ),
      },

      {
        key: "totalOrders",
        title: "Total Orders",
        value: formatNumber(
          safeStatistics.totalOrders,
          0
        ),
        icon: (
          <ShoppingCart />
        ),
      },

      {
        key: "totalQuantity",
        title: "Items Sold",
        value: formatNumber(
          safeStatistics.totalQuantity,
          0
        ),
        icon: (
          <Assessment />
        ),
      },

      {
        key: "averageOrderValue",
        title: "Average Order Value",
        value: formatCurrency(
          safeStatistics.averageOrderValue
        ),
        icon: (
          <TrendingUp />
        ),
      },
    ],
    [safeStatistics]
  );
  //====================================================
  // Render
  //====================================================

  return (
    <Grid
      container
      spacing={2}
      className="sales-report-card"
    >
      {cards.map((card) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          key={card.key}
        >
          <Card
            className="sales-report-statistics-card"
            variant="outlined"
            sx={{
              height: "100%",
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                {/*======================================
                    Card Information
                ======================================*/}

                <Stack spacing={0.5}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {card.title}
                  </Typography>

                  {loading ? (
                    <Skeleton
                      variant="text"
                      width={120}
                      height={38}
                    />
                  ) : (
                    <Typography
                      variant="h5"
                      fontWeight={700}
                    >
                      {card.value}
                    </Typography>
                  )}
                </Stack>

                {/*======================================
                    Card Icon
                ======================================*/}

                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    bgcolor:
                      "action.hover",
                    flexShrink: 0,
                  }}
                >
                  {card.icon}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

//======================================================
// PropTypes
//======================================================

SalesReportCard.propTypes = {
  statistics:
    PropTypes.object,

  loading:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

SalesReportCard.defaultProps = {
  statistics: {},

  loading: false,
};

//======================================================
// Export
//======================================================

export default SalesReportCard;


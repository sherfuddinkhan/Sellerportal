import React, { useMemo } from "react";
import PropTypes from "prop-types";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  People,
  Person,
  ShoppingCart,
  CurrencyRupee,
  Payments,
  AccountBalanceWallet,
  TrendingUp,
  PersonOff,
} from "@mui/icons-material";

//======================================================
// CustomerReportStatistics
//======================================================

const CustomerReportStatistics = ({
  statistics = {},
}) => {

  //====================================================
  // Statistics Values
  //====================================================

  const {
    totalCustomers = 0,
    activeCustomers = 0,
    inactiveCustomers = 0,
    totalOrders = 0,
    totalSales = 0,
    totalPaid = 0,
    totalOutstanding = 0,
    averageOrderValue = 0,
  } = statistics;

  //====================================================
  // Currency Formatter
  //====================================================

  const formatCurrency = useMemo(
    () => (value) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(Number(value) || 0),
    []
  );

  //====================================================
  // Number Formatter
  //====================================================

  const formatNumber = useMemo(
    () => (value) =>
      new Intl.NumberFormat("en-IN").format(
        Number(value) || 0
      ),
    []
  );

  //====================================================
  // Statistics Cards
  //====================================================

  const cards = useMemo(
    () => [
      {
        key: "totalCustomers",
        title: "Total Customers",
        value: formatNumber(totalCustomers),
        icon: <People />,
        color: "primary",
      },

      {
        key: "activeCustomers",
        title: "Active Customers",
        value: formatNumber(activeCustomers),
        icon: <Person />,
        color: "success",
      },

      {
        key: "inactiveCustomers",
        title: "Inactive Customers",
        value: formatNumber(inactiveCustomers),
        icon: <PersonOff />,
        color: "warning",
      },

      {
        key: "totalOrders",
        title: "Total Orders",
        value: formatNumber(totalOrders),
        icon: <ShoppingCart />,
        color: "info",
      },

      {
        key: "totalSales",
        title: "Total Sales",
        value: formatCurrency(totalSales),
        icon: <CurrencyRupee />,
        color: "success",
      },

      {
        key: "totalPaid",
        title: "Total Paid",
        value: formatCurrency(totalPaid),
        icon: <Payments />,
        color: "primary",
      },

      {
        key: "totalOutstanding",
        title: "Outstanding",
        value: formatCurrency(totalOutstanding),
        icon: <AccountBalanceWallet />,
        color: "error",
      },

      {
        key: "averageOrderValue",
        title: "Average Order Value",
        value: formatCurrency(
          averageOrderValue
        ),
        icon: <TrendingUp />,
        color: "secondary",
      },
    ],
    [
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      totalOrders,
      totalSales,
      totalPaid,
      totalOutstanding,
      averageOrderValue,
      formatCurrency,
      formatNumber,
    ]
  );

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // Statistics Cards JSX
  //====================================================

  return (
    <Box
      className="customer-report-statistics"
      sx={{ mb: 3 }}
    >

      <Grid
        container
        spacing={2}
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
              variant="outlined"
              sx={{
                height: "100%",
                borderRadius: 2,
              }}
            >

              <CardContent>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >

                  {/*====================================
                      Text
                  ====================================*/}

                  <Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {card.value}
                    </Typography>

                  </Box>

                  {/*====================================
                      Icon
                  ====================================*/}

                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: `${card.color}.lighter`,
                      color: `${card.color}.main`,
                    }}
                  >
                    {card.icon}
                  </Box>

                </Stack>

              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>

    </Box>
  );
};

export default CustomerReportStatistics;
//======================================================
// PropTypes
//======================================================

CustomerReportStatistics.propTypes = {
  statistics: PropTypes.shape({
    totalCustomers: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    activeCustomers: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    inactiveCustomers: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    totalOrders: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    totalSales: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    totalPaid: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    totalOutstanding: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    averageOrderValue: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }),
};

//======================================================
// Default Props
//======================================================

CustomerReportStatistics.defaultProps = {
  statistics: {
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    totalOrders: 0,
    totalSales: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    averageOrderValue: 0,
  },
};

//======================================================
// Export
//======================================================

export default CustomerReportStatistics;
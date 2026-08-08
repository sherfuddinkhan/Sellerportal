import React, {useMemo} from "react";
import PropTypes from "prop-types";
import {Box,Card,CardContent,CircularProgress,Grid,Stack,Typography} from "@mui/material";
import {Assessment,AttachMoney,People,ShoppingCart} from "@mui/icons-material";

//======================================================
// DashboardReportStatistics
//======================================================

const DashboardReportStatistics = ({
  statistics = null,
  reports = [],
  loading = false,
}) => {

  //====================================================
  // Safe Number
  //====================================================

  const toNumber = (value) => {

    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  };

  //====================================================
  // Calculate Statistics
  //====================================================

  const calculatedStatistics =
    useMemo(() => {

      const list =
        Array.isArray(reports)
          ? reports
          : [];

      const totalReports =
        list.length;

      const totalRecords =
        list.reduce(
          (total, report) =>
            total +
            toNumber(
              report?.totalRecords ??
              report?.recordCount ??
              report?.records
            ),
          0
        );

      const totalOrders =
        list.reduce(
          (total, report) =>
            total +
            toNumber(
              report?.totalOrders ??
              report?.orderCount ??
              report?.orders
            ),
          0
        );

      const totalAmount =
        list.reduce(
          (total, report) =>
            total +
            toNumber(
              report?.totalAmount ??
              report?.amount ??
              report?.totalSales
            ),
          0
        );

      return {
        totalReports,
        totalRecords,
        totalOrders,
        totalAmount,
      };

    }, [reports]);

  //====================================================
  // API Statistics Override
  //====================================================

  const finalStatistics =
    useMemo(() => {

      if (!statistics) {
        return calculatedStatistics;
      }

      return {
        totalReports:
          toNumber(
            statistics?.totalReports ??
            statistics?.reportCount ??
            calculatedStatistics.totalReports
          ),

        totalRecords:
          toNumber(
            statistics?.totalRecords ??
            statistics?.recordCount ??
            calculatedStatistics.totalRecords
          ),

        totalOrders:
          toNumber(
            statistics?.totalOrders ??
            statistics?.orderCount ??
            calculatedStatistics.totalOrders
          ),

        totalAmount:
          toNumber(
            statistics?.totalAmount ??
            statistics?.amount ??
            statistics?.totalSales ??
            calculatedStatistics.totalAmount
          ),
      };

    }, [
      statistics,
      calculatedStatistics,
    ]);

  //====================================================
  // Currency Formatter
  //====================================================

  const formatCurrency = (
    value
  ) => {

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(
      toNumber(value)
    );

  };

  //====================================================
  // Number Formatter
  //====================================================

  const formatNumber = (
    value
  ) => {

    return toNumber(
      value
    ).toLocaleString(
      "en-IN"
    );

  };

  //====================================================
  // Statistics Card Configuration
  //====================================================

  const statisticCards = [
    {
      key: "totalReports",
      title: "Total Reports",
      value:
        finalStatistics.totalReports,
      icon: <Assessment />,
      formatter: formatNumber,
    },
    {
      key: "totalRecords",
      title: "Total Records",
      value:
        finalStatistics.totalRecords,
      icon: <People />,
      formatter: formatNumber,
    },
    {
      key: "totalOrders",
      title: "Total Orders",
      value:
        finalStatistics.totalOrders,
      icon: <ShoppingCart />,
      formatter: formatNumber,
    },
    {
      key: "totalAmount",
      title: "Total Amount",
      value:
        finalStatistics.totalAmount,
      icon: <AttachMoney />,
      formatter: formatCurrency,
    },
  ];

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Box
      className="dashboard-report-statistics"
      sx={{
        width: "100%",
      }}
    >

      {/*================================================
          Loading State
      =================================================*/}

      {loading ? (

        <Box
          sx={{
            minHeight: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            spacing={1}
            alignItems="center"
          >
            <CircularProgress
              size={32}
            />

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Loading statistics...
            </Typography>
          </Stack>
        </Box>

      ) : (

        /*================================================
            Statistics Cards
        =================================================*/

        <Grid
          container
          spacing={2}
        >

          {statisticCards.map(
            (card) => (

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={card.key}
              >

                <Card
                  className="dashboard-report-statistics-card"
                  elevation={2}
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

                      {/*================================
                          Statistic Information
                      =================================*/}

                      <Box
                        sx={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 0.5,
                          }}
                        >
                          {card.title}
                        </Typography>

                        <Typography
                          variant="h6"
                          fontWeight={700}
                          noWrap
                          title={
                            card.formatter(
                              card.value
                            )
                          }
                        >
                          {card.formatter(
                            card.value
                          )}
                        </Typography>

                      </Box>

                      {/*================================
                          Icon
                      =================================*/}

                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          minWidth: 44,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor:
                            "action.hover",
                        }}
                      >
                        {card.icon}
                      </Box>

                    </Stack>

                  </CardContent>

                </Card>

              </Grid>

            )
          )}

        </Grid>

      )}

    </Box>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

DashboardReportStatistics.propTypes = {
  statistics: PropTypes.shape({
    totalReports: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    reportCount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    totalRecords: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    recordCount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    totalOrders: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    orderCount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    totalAmount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    amount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    totalSales: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }),

  reports: PropTypes.arrayOf(
    PropTypes.object
  ),

  loading: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

DashboardReportStatistics.defaultProps = {
  statistics: null,

  reports: [],

  loading: false,
};

//======================================================
// Export
//======================================================

export default DashboardReportStatistics;
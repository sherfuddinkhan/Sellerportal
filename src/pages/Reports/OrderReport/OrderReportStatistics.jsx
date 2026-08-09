import React, {useMemo,} from "react";
import PropTypes from "prop-types";
import {Assessment,CheckCircle,CurrencyRupee,LocalShipping,PendingActions,ShoppingCart} from "@mui/icons-material";
import {Box,Card,CardContent,Grid,Skeleton,Stack,Typography} from "@mui/material";
import {formatCurrency} from "./OrderReportHelpers";
//======================================================
// OrderReportStatistics
//======================================================
const OrderReportStatistics = ({
  statistics = {},
  loading = false,
}) => {
  //====================================================
  // Safe Statistics
  //====================================================
  const safeStatistics =
    statistics || {};
  //====================================================
  // Statistic Values
  //====================================================
  const totalOrders =
    safeStatistics.totalOrders ??
    safeStatistics.totalOrderCount ??
    safeStatistics.orders ??
    0;

  const totalQuantity =
    safeStatistics.totalQuantity ??
    safeStatistics.quantity ??
    safeStatistics.totalItems ??
    0;

  const totalSales =
    safeStatistics.totalSales ??
    safeStatistics.totalSalesAmount ??
    safeStatistics.salesAmount ??
    safeStatistics.revenue ??
    0;

  const completedOrders =
    safeStatistics.completedOrders ??
    safeStatistics.deliveredOrders ??
    safeStatistics.completed ??
    0;

  const pendingOrders =
    safeStatistics.pendingOrders ??
    safeStatistics.pending ??
    0;

  const shippedOrders =
    safeStatistics.shippedOrders ??
    safeStatistics.shipped ??
    0;

  //====================================================
  // Completion Rate
  //====================================================

  const completionRate =
    useMemo(() => {
      if (
        Number(totalOrders) <=
        0
      ) {
        return 0;
      }
      return (
        (Number(
          completedOrders
        ) /
          Number(
            totalOrders
          )) *
        100
      );
    }, [
      totalOrders,
      completedOrders,
    ]);
  //====================================================
  // Statistic Cards
  //====================================================
  const statisticCards =
    useMemo(
      () => [
        {
          key: "totalOrders",
          title: "Total Orders",
          value: Number(
            totalOrders
          ).toLocaleString(
            "en-IN"
          ),
          icon: (
            <ShoppingCart />
          ),
          color: "primary",
        },
        {
          key: "totalQuantity",
          title: "Total Quantity",
          value: Number(
            totalQuantity
          ).toLocaleString(
            "en-IN"
          ),
          icon: (
            <Assessment />
          ),
          color: "info",
        },
        {
          key: "totalSales",
          title: "Total Sales",
          value: formatCurrency(
            totalSales
          ),
          icon: (
            <CurrencyRupee />
          ),
          color: "success",
        },
        {
          key: "completedOrders",
          title: "Completed",
          value: Number(
            completedOrders
          ).toLocaleString(
            "en-IN"
          ),
          icon: (
            <CheckCircle />
          ),
          color: "success",
        },
        {
          key: "pendingOrders",
          title: "Pending",
          value: Number(
            pendingOrders
          ).toLocaleString(
            "en-IN"
          ),
          icon: (
            <PendingActions />
          ),
          color: "warning",
        },
        {
          key: "shippedOrders",
          title: "Shipped",
          value: Number(
            shippedOrders
          ).toLocaleString(
            "en-IN"
          ),
          icon: (
            <LocalShipping />
          ),
          color: "secondary",
        },
      ],
      [ totalOrders,
        totalQuantity,
        totalSales,
        completedOrders,
        pendingOrders,
        shippedOrders,
      ]
    );
    //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="order-report-statistics"
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
      >
        {statisticCards.map(
          (statistic) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={2}
              key={statistic.key}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  {loading ? (
                    <Stack
                      spacing={1}
                    >
                      <Skeleton
                        variant="circular"
                        width={38}
                        height={38}
                      />

                      <Skeleton
                        variant="text"
                        width="70%"
                      />

                      <Skeleton
                        variant="text"
                        width="90%"
                        height={32}
                      />
                    </Stack>
                  ) : (
                    <Stack
                      spacing={1.5}
                    >
                      {/* Icon */}

                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius:
                            2,
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          bgcolor:
                            `${statistic.color}.lighter`,
                          color:
                            `${statistic.color}.main`,
                        }}
                      >
                        {statistic.icon}
                      </Box>

                      {/* Title */}

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                      >
                        {
                          statistic.title
                        }
                      </Typography>

                      {/* Value */}

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        noWrap
                      >
                        {
                          statistic.value
                        }
                      </Typography>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        )}

        {/*================================================
            Completion Rate
        =================================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={2}
        >
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              borderRadius: 2,
            }}
          >
            <CardContent>
              {loading ? (
                <Stack spacing={1}>
                  <Skeleton
                    variant="circular"
                    width={38}
                    height={38}
                  />

                  <Skeleton
                    variant="text"
                    width="70%"
                  />

                  <Skeleton
                    variant="text"
                    width="90%"
                    height={32}
                  />
                </Stack>
              ) : (
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      bgcolor:
                        "success.lighter",
                      color:
                        "success.main",
                    }}
                  >
                    <CheckCircle />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                  >
                    Completion Rate
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    noWrap
                  >
                    {completionRate.toFixed(
                      1
                    )}
                    %
                  </Typography>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

OrderReportStatistics.propTypes = {
  statistics:
    PropTypes.object,

  loading:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

OrderReportStatistics.defaultProps = {
  statistics: {},

  loading: false,
};

//======================================================
// Export
//======================================================

export default OrderReportStatistics;

//======================================================
// OrderReportStatistics.jsx Complete
//======================================================
import React, {
  useCallback,
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import {
  ShoppingCart,
  CurrencyRupee,
  Inventory2,
  AssignmentReturn,
  Storefront,
} from "@mui/icons-material";

//======================================================
// MarketplaceReportStatistics
//======================================================

const MarketplaceReportStatistics = ({
  statistics = {},
  loading = false,
}) => {

  //====================================================
  // Safe Statistics
  //====================================================

  const safeStatistics =
    statistics &&
    typeof statistics === "object"
      ? statistics
      : {};

  //====================================================
  // Format Number
  //====================================================

  const formatNumber =
    useCallback((value) => {
      const number =
        Number(value);

      if (
        !Number.isFinite(number)
      ) {
        return "0";
      }

      return number.toLocaleString(
        "en-IN"
      );
    }, []);

  //====================================================
  // Format Currency
  //====================================================

  const formatCurrency =
    useCallback((value) => {
      const number =
        Number(value);

      if (
        !Number.isFinite(number)
      ) {
        return "₹0.00";
      }

      return number.toLocaleString(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        }
      );
    }, []);

  //====================================================
  // Statistics Values
  //====================================================

  const totalOrders =
    safeStatistics.totalOrders ??
    safeStatistics.orders ??
    0;

  const totalSales =
    safeStatistics.totalSales ??
    safeStatistics.salesAmount ??
    safeStatistics.totalAmount ??
    0;

  const totalProducts =
    safeStatistics.totalProducts ??
    safeStatistics.products ??
    0;

  const totalQuantity =
    safeStatistics.totalQuantity ??
    safeStatistics.quantity ??
    0;

  const totalReturns =
    safeStatistics.totalReturns ??
    safeStatistics.returns ??
    0;

  //====================================================
  // Statistics Cards
  //====================================================

  const statisticCards =
    useMemo(
      () => [
        {
          key: "orders",
          title: "Total Orders",
          value: formatNumber(
            totalOrders
          ),
          icon: ShoppingCart,
          description:
            "Marketplace orders",
        },
        {
          key: "sales",
          title: "Total Sales",
          value: formatCurrency(
            totalSales
          ),
          icon: CurrencyRupee,
          description:
            "Total marketplace sales",
        },
        {
          key: "products",
          title: "Total Products",
          value: formatNumber(
            totalProducts
          ),
          icon: Inventory2,
          description:
            "Products sold",
        },
        {
          key: "quantity",
          title: "Total Quantity",
          value: formatNumber(
            totalQuantity
          ),
          icon: Storefront,
          description:
            "Units sold",
        },
        {
          key: "returns",
          title: "Total Returns",
          value: formatNumber(
            totalReturns
          ),
          icon: AssignmentReturn,
          description:
            "Returned orders",
        },
      ],
      [
        formatNumber,
        formatCurrency,
        totalOrders,
        totalSales,
        totalProducts,
        totalQuantity,
        totalReturns,
      ]
    );

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Box
      className="marketplace-report-statistics"
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
      >
        {statisticCards.map(
          (statistic) => {
            const Icon =
              statistic.icon;

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2.4}
                key={statistic.key}
              >
                <Card
                  variant="outlined"
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                  }}
                >
                  <CardContent
                    sx={{
                      p: 2,
                      "&:last-child": {
                        pb: 2,
                      },
                    }}
                  >
                    {loading ? (
                      <Stack
                        spacing={1}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Skeleton
                            variant="text"
                            width="55%"
                          />

                          <Skeleton
                            variant="circular"
                            width={34}
                            height={34}
                          />
                        </Stack>

                        <Skeleton
                          variant="text"
                          width="75%"
                          height={34}
                        />

                        <Skeleton
                          variant="text"
                          width="65%"
                        />
                      </Stack>
                    ) : (
                      <Stack
                        spacing={1}
                      >
                        {/*================================
                            Header
                        =================================*/}

                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          spacing={1}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={600}
                          >
                            {statistic.title}
                          </Typography>

                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 2,
                              display: "flex",
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
                              color="primary"
                            />
                          </Box>
                        </Stack>

                        {/*================================
                            Value
                        =================================*/}

                        <Typography
                          variant="h5"
                          fontWeight={700}
                          sx={{
                            lineHeight: 1.2,
                          }}
                        >
                          {statistic.value}
                        </Typography>

                        {/*================================
                            Description
                        =================================*/}

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {
                            statistic.description
                          }
                        </Typography>
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          }
        )}
      </Grid>
    </Box>
  );

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

MarketplaceReportStatistics.propTypes = {
  statistics: PropTypes.shape({
    totalOrders: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    orders: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    totalSales: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    salesAmount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    totalAmount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    totalProducts: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    products: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    totalQuantity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    quantity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    totalReturns: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    returns: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }),

  loading: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

MarketplaceReportStatistics.defaultProps = {
  statistics: {},

  loading: false,
};

//======================================================
// Export
//======================================================
}
export default MarketplaceReportStatistics;
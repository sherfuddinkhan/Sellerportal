import React, {
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
  Inventory2,
  WarningAmber,
  ProductionQuantityLimits,
  TrendingDown,
  ShoppingCart,
} from "@mui/icons-material";

//======================================================
// LowStockReportStatistics
//======================================================

const LowStockReportStatistics = ({
  statistics = {},
  loading = false,
}) => {

  //====================================================
  // Normalize Statistics
  //====================================================

  const normalizedStatistics =
    useMemo(
      () => ({
        totalProducts:
          Number(
            statistics?.totalProducts ??
              statistics?.totalItems ??
              statistics?.total ??
              0
          ),

        lowStockProducts:
          Number(
            statistics?.lowStockProducts ??
              statistics?.lowStock ??
              0
          ),

        outOfStockProducts:
          Number(
            statistics?.outOfStockProducts ??
              statistics?.outOfStock ??
              0
          ),

        totalStock:
          Number(
            statistics?.totalStock ??
              statistics?.totalQuantity ??
              0
          ),

        totalReorderQuantity:
          Number(
            statistics?.totalReorderQuantity ??
              statistics?.reorderQuantity ??
              statistics?.reorderQty ??
              0
          ),
      }),
      [statistics]
    );

  //====================================================
  // Statistics Cards
  //====================================================

  const statisticCards = useMemo(
    () => [
      {
        key: "totalProducts",
        title: "Total Products",
        value:
          normalizedStatistics.totalProducts,
        icon: Inventory2,
        description:
          "Products included in the report",
      },

      {
        key: "lowStockProducts",
        title: "Low Stock",
        value:
          normalizedStatistics.lowStockProducts,
        icon: WarningAmber,
        description:
          "Products below minimum stock",
      },

      {
        key: "outOfStockProducts",
        title: "Out of Stock",
        value:
          normalizedStatistics.outOfStockProducts,
        icon: ProductionQuantityLimits,
        description:
          "Products with zero stock",
      },

      {
        key: "totalStock",
        title: "Total Stock",
        value:
          normalizedStatistics.totalStock,
        icon: TrendingDown,
        description:
          "Current available quantity",
      },

      {
        key: "reorderQuantity",
        title: "Reorder Quantity",
        value:
          normalizedStatistics.totalReorderQuantity,
        icon: ShoppingCart,
        description:
          "Suggested quantity to reorder",
      },
    ],
    [normalizedStatistics]
  );

  //====================================================
  // Format Number
  //====================================================

  const formatNumber = (
    value
  ) => {
    const numericValue =
      Number(value);

    if (
      !Number.isFinite(
        numericValue
      )
    ) {
      return "0";
    }

    return numericValue.toLocaleString(
      "en-IN"
    );
  };

  //====================================================
  // Part 1A Ends Here
  //====================================================
  //======================================================
// JSX
//======================================================

  return (
    <Box
      className="low-stock-report-statistics"
      sx={{
        width: "100%",
        mb: 2,
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
                key={
                  statistic.key
                }
              >
                <Card
                  elevation={0}
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
                          width={36}
                          height={36}
                        />

                        <Skeleton
                          variant="text"
                          width="70%"
                          height={28}
                        />

                        <Skeleton
                          variant="text"
                          width="90%"
                        />
                      </Stack>
                    ) : (
                      <Stack
                        spacing={1}
                      >
                        {/*================================
                            Icon
                        =================================*/}

                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 2,
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
                            color="primary"
                          />
                        </Box>

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
                          {formatNumber(
                            statistic.value
                          )}
                        </Typography>

                        {/*================================
                            Title
                        =================================*/}

                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                        >
                          {
                            statistic.title
                          }
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

LowStockReportStatistics.propTypes = {
  statistics: PropTypes.shape({
    totalProducts: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    totalItems: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    total: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    lowStockProducts: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    lowStock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    outOfStockProducts: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    outOfStock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    totalStock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    totalQuantity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    totalReorderQuantity:
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),

    reorderQuantity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    reorderQty: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }),

  loading: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

LowStockReportStatistics.defaultProps = {
  statistics: {
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalStock: 0,
    totalReorderQuantity: 0,
  },

  loading: false,
};

//======================================================
// Export
//======================================================
}
export default LowStockReportStatistics;
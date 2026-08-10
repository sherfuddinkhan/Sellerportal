import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  AccountBalance,
  Inventory2,
  ReceiptLong,
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
  calculatePurchaseReportStatistics,
  formatCurrency,
  formatNumber,
  toNumber,
} from "./PurchaseReportHelpers";

//======================================================
// PurchaseReportStatistics
//======================================================

const PurchaseReportStatistics = ({
  statistics = {},
  reports = [],
  loading = false,
}) => {
  //====================================================
  // Safe Statistics
  //====================================================

  const safeStatistics = useMemo(
    () => ({
      totalPurchases: toNumber(
        statistics?.totalPurchases ??
          statistics?.totalPurchase ??
          statistics?.purchaseAmount ??
          0
      ),

      totalOrders: toNumber(
        statistics?.totalOrders ??
          statistics?.purchaseOrders ??
          reports?.length ??
          0
      ),

      totalQuantity: toNumber(
        statistics?.totalQuantity ??
          statistics?.quantity ??
          0
      ),

      averagePurchase: toNumber(
        statistics?.averagePurchase ??
          statistics?.averagePurchaseValue ??
          0
      ),

      totalTax: toNumber(
        statistics?.totalTax ??
          statistics?.tax ??
          0
      ),

      totalDiscount: toNumber(
        statistics?.totalDiscount ??
          statistics?.discount ??
          0
      ),

      highestPurchase: toNumber(
        statistics?.highestPurchase ??
          statistics?.maxPurchase ??
          0
      ),

      lowestPurchase: toNumber(
        statistics?.lowestPurchase ??
          statistics?.minPurchase ??
          0
      ),
    }),
    [statistics, reports]
  );

  //====================================================
  // Calculated Statistics
  //====================================================

  const calculatedStatistics =
    useMemo(() => {
      if (
        statistics &&
        Object.keys(statistics).length > 0
      ) {
        return safeStatistics;
      }

      return {
        ...safeStatistics,
        ...calculatePurchaseReportStatistics(
          reports
        ),
      };
    }, [
      statistics,
      safeStatistics,
      reports,
    ]);

  //====================================================
  // Statistic Cards
  //====================================================

  const cards = useMemo(
    () => [
      {
        key: "totalPurchases",
        title: "Total Purchases",
        value: formatCurrency(
          calculatedStatistics.totalPurchases
        ),
        icon: <AccountBalance />,
      },
      {
        key: "totalOrders",
        title: "Purchase Orders",
        value: formatNumber(
          calculatedStatistics.totalOrders
        ),
        icon: <ReceiptLong />,
      },
      {
        key: "totalQuantity",
        title: "Total Quantity",
        value: formatNumber(
          calculatedStatistics.totalQuantity
        ),
        icon: <Inventory2 />,
      },
      {
        key: "averagePurchase",
        title: "Average Purchase",
        value: formatCurrency(
          calculatedStatistics.averagePurchase
        ),
        icon: <TrendingUp />,
      },
      {
        key: "highestPurchase",
        title: "Highest Purchase",
        value: formatCurrency(
          calculatedStatistics.highestPurchase
        ),
        icon: <TrendingUp />,
      },
      {
        key: "lowestPurchase",
        title: "Lowest Purchase",
        value: formatCurrency(
          calculatedStatistics.lowestPurchase
        ),
        icon: <TrendingDown />,
      },
    ],
    [calculatedStatistics]
  );
  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="purchase-report-statistics"
      sx={{
        width: "100%",
      }}
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
            md={4}
            lg={2}
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
                    >
                      {card.title}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "center",
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor:
                          "action.hover",
                      }}
                    >
                      {React.cloneElement(
                        card.icon,
                        {
                          fontSize:
                            "small",
                        }
                      )}
                    </Box>
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {loading
                      ? "—"
                      : card.value}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/*==============================================
          Additional Tax / Discount Summary
      ==============================================*/}

      <Grid
        container
        spacing={2}
        sx={{
          mt: 0.5,
        }}
      >
        <Grid
          item
          xs={12}
          sm={6}
        >
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    bgcolor:
                      "action.hover",
                  }}
                >
                  <TrendingUp fontSize="small" />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Total Tax
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {loading
                      ? "—"
                      : formatCurrency(
                          calculatedStatistics.totalTax
                        )}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
        >
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    bgcolor:
                      "action.hover",
                  }}
                >
                  <TrendingDown fontSize="small" />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Total Discount
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {loading
                      ? "—"
                      : formatCurrency(
                          calculatedStatistics.totalDiscount
                        )}
                  </Typography>
                </Box>
              </Stack>
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

PurchaseReportStatistics.propTypes = {
  statistics:
    PropTypes.object,

  reports:
    PropTypes.array,

  loading:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

PurchaseReportStatistics.defaultProps = {
  statistics: {},

  reports: [],

  loading: false,
};

//======================================================
// Export
//======================================================

export default PurchaseReportStatistics;


  
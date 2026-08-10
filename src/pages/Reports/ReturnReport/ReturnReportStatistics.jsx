import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  AssignmentReturn,
  CurrencyRupee,
  Inventory2,
  Replay,
} from "@mui/icons-material";

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
  formatCurrency,
  formatNumber,
  toNumber,
} from "./ReturnReportHelpers";

//======================================================
// ReturnReportStatistics
//======================================================

const ReturnReportStatistics = ({
  statistics = {},
  loading = false,
}) => {
  //====================================================
  // Normalize Statistics
  //====================================================

  const safeStatistics = useMemo(
    () =>
      statistics &&
      typeof statistics === "object"
        ? statistics
        : {},
    [statistics]
  );

  //====================================================
  // Calculate Values
  //====================================================

  const totalReturns = toNumber(
    safeStatistics.totalReturns ??
      safeStatistics.totalReturnCount ??
      safeStatistics.returnCount
  );

  const totalQuantity = toNumber(
    safeStatistics.totalQuantity ??
      safeStatistics.returnedQuantity ??
      safeStatistics.quantity
  );

  const totalReturnAmount = toNumber(
    safeStatistics.totalReturnAmount ??
      safeStatistics.returnAmount ??
      safeStatistics.totalAmount
  );

  const totalRefundAmount = toNumber(
    safeStatistics.totalRefundAmount ??
      safeStatistics.refundAmount
  );

  //====================================================
  // Statistics Cards
  //====================================================

  const cards = useMemo(
    () => [
      {
        key: "totalReturns",
        label: "Total Returns",
        value: formatNumber(
          totalReturns
        ),
        icon: (
          <AssignmentReturn />
        ),
      },
      {
        key: "totalQuantity",
        label: "Returned Quantity",
        value: formatNumber(
          totalQuantity
        ),
        icon: (
          <Inventory2 />
        ),
      },
      {
        key: "returnAmount",
        label: "Return Amount",
        value: formatCurrency(
          totalReturnAmount
        ),
        icon: (
          <CurrencyRupee />
        ),
      },
      {
        key: "refundAmount",
        label: "Refund Amount",
        value: formatCurrency(
          totalRefundAmount
        ),
        icon: (
          <Replay />
        ),
      },
    ],
    [
      totalReturns,
      totalQuantity,
      totalReturnAmount,
      totalRefundAmount,
    ]
  );
  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="return-report-statistics"
      sx={{
        width: "100%",
        mb: 2,
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
            md={3}
            key={card.key}
          >
            <Card
              className="return-report-statistics-card"
              variant="outlined"
              sx={{
                height: "100%",
              }}
            >
              <CardContent>
                {loading ? (
                  <Stack
                    spacing={1}
                  >
                    <Skeleton
                      variant="text"
                      width="55%"
                      height={22}
                    />

                    <Skeleton
                      variant="text"
                      width="75%"
                      height={34}
                    />

                    <Skeleton
                      variant="circular"
                      width={36}
                      height={36}
                    />
                  </Stack>
                ) : (
                  <Stack
                    spacing={1.5}
                  >
                    {/*================================
                        Icon
                    =================================*/}

                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        borderRadius: 2,
                        backgroundColor:
                          "action.hover",
                        color:
                          "primary.main",
                      }}
                    >
                      {card.icon}
                    </Box>

                    {/*================================
                        Label
                    =================================*/}

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {card.label}
                    </Typography>

                    {/*================================
                        Value
                    =================================*/}

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      noWrap
                    >
                      {card.value}
                    </Typography>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

ReturnReportStatistics.propTypes = {
  statistics:
    PropTypes.object,

  loading:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

ReturnReportStatistics.defaultProps = {
  statistics: {},

  loading: false,
};

//======================================================
// Export
//======================================================

export default ReturnReportStatistics;


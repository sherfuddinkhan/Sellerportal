//======================================================
// StockMovementReportStatistics.jsx
// Part 1A
//======================================================

import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

//======================================================
// Number Formatter
//======================================================

const formatNumber = (
  value
) => {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  ).format(number);
};

//======================================================
// Movement Type Checker
//======================================================

const getMovementType = (
  report
) => {
  return String(
    report?.movementType ??
      report?.transactionType ??
      report?.type ??
      ""
  )
    .trim()
    .toLowerCase();
};

//======================================================
// Quantity Getter
//======================================================

const getQuantity = (
  report
) => {
  const quantity =
    Number(
      report?.quantity ??
        report?.movementQuantity ??
        report?.qty ??
        0
    );

  return Number.isFinite(
    quantity
  )
    ? quantity
    : 0;
};

//======================================================
// Amount Getter
//======================================================

const getAmount = (
  report
) => {
  const amount =
    Number(
      report?.amount ??
        report?.totalAmount ??
        report?.value ??
        0
    );

  return Number.isFinite(
    amount
  )
    ? amount
    : 0;
};

//======================================================
// StockMovementReportStatistics
//======================================================

const StockMovementReportStatistics = ({
  reports = [],
  loading = false,
}) => {
  //====================================================
  // Normalize Reports
  //====================================================

  const reportList =
    Array.isArray(reports)
      ? reports
      : [];

  //====================================================
  // Calculate Statistics
  //====================================================

  const statistics =
    useMemo(() => {
      let totalMovements =
        reportList.length;

      let totalQuantity = 0;

      let totalAmount = 0;

      let inwardQuantity = 0;

      let outwardQuantity = 0;

      let transferQuantity = 0;

      let adjustmentQuantity = 0;

      let inwardCount = 0;

      let outwardCount = 0;

      let transferCount = 0;

      let adjustmentCount = 0;

      reportList.forEach(
        (report) => {
          const quantity =
            Math.abs(
              getQuantity(
                report
              )
            );

          const amount =
            Math.abs(
              getAmount(
                report
              )
            );

          const movementType =
            getMovementType(
              report
            );

          totalQuantity +=
            quantity;

          totalAmount +=
            amount;

          if (
            movementType.includes(
              "inward"
            ) ||
            movementType.includes(
              "receipt"
            ) ||
            movementType.includes(
              "purchase"
            ) ||
            movementType.includes(
              "receive"
            )
          ) {
            inwardQuantity +=
              quantity;

            inwardCount += 1;

            return;
          }

          if (
            movementType.includes(
              "outward"
            ) ||
            movementType.includes(
              "issue"
            ) ||
            movementType.includes(
              "sales"
            ) ||
            movementType.includes(
              "dispatch"
            )
          ) {
            outwardQuantity +=
              quantity;

            outwardCount += 1;

            return;
          }

          if (
            movementType.includes(
              "transfer"
            )
          ) {
            transferQuantity +=
              quantity;

            transferCount += 1;

            return;
          }

          if (
            movementType.includes(
              "adjust"
            )
          ) {
            adjustmentQuantity +=
              quantity;

            adjustmentCount += 1;
          }
        }
      );

      return {
        totalMovements,
        totalQuantity,
        totalAmount,
        inwardQuantity,
        outwardQuantity,
        transferQuantity,
        adjustmentQuantity,
        inwardCount,
        outwardCount,
        transferCount,
        adjustmentCount,
      };
    }, [
      reportList,
    ]);

  //====================================================
  // Statistics Cards
  //====================================================

  const cards = [
    {
      key: "total",
      title: "Total Movements",
      value:
        statistics.totalMovements,
      subtitle:
        `${formatNumber(
          statistics.totalQuantity
        )} total quantity`,
      icon: (
        <Inventory2Icon />
      ),
    },
    {
      key: "inward",
      title: "Inward",
      value:
        formatNumber(
          statistics.inwardQuantity
        ),
      subtitle:
        `${statistics.inwardCount} transactions`,
      icon: (
        <ArrowDownwardIcon />
      ),
    },
    {
      key: "outward",
      title: "Outward",
      value:
        formatNumber(
          statistics.outwardQuantity
        ),
      subtitle:
        `${statistics.outwardCount} transactions`,
      icon: (
        <ArrowUpwardIcon />
      ),
    },
    {
      key: "transfer",
      title: "Transfers",
      value:
        formatNumber(
          statistics.transferQuantity
        ),
      subtitle:
        `${statistics.transferCount} transactions`,
      icon: (
        <SwapHorizIcon />
      ),
    },
    {
      key: "value",
      title: "Movement Value",
      value:
        `₹${formatNumber(
          statistics.totalAmount
        )}`,
      subtitle:
        `${statistics.adjustmentCount} adjustments`,
      icon: (
        <CurrencyRupeeIcon />
      ),
    },
  ];

  //====================================================
  // Loading State
  //====================================================

  if (loading) {
    return (
      <Box
        className="stock-movement-report__statistics-loading"
        sx={{
          width: "100%",
          minHeight: 120,
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
        }}
      >
        <CircularProgress
          size={30}
        />
      </Box>
    );
  }

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="stock-movement-report__statistics"
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
      >
        {cards.map(
          (card) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={2.4}
              key={card.key}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    {/*================================
                        Icon
                    =================================*/}

                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 1.5,
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        flexShrink: 0,
                        backgroundColor:
                          "action.hover",
                      }}
                    >
                      {card.icon}
                    </Box>

                    {/*================================
                        Content
                    =================================*/}

                    <Box
                      sx={{
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {card.title}
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        noWrap
                      >
                        {card.value}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {card.subtitle}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

StockMovementReportStatistics.propTypes = {
  reports:
    PropTypes.arrayOf(
      PropTypes.object
    ),

  loading:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

StockMovementReportStatistics.defaultProps = {
  reports: [],
  loading: false,
};

//======================================================
// Export
//======================================================

export default StockMovementReportStatistics;

//======================================================
// Part 1A Ends Here
//======================================================
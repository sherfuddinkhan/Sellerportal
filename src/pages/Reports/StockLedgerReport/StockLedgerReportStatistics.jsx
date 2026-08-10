
//======================================================
// StockLedgerReportStatistics.jsx
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
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";

//======================================================
// Helpers
//======================================================

import {
  formatNumber,
  normalizeStockLedgerReports,
} from "./StockLedgerReportHelpers";

//======================================================
// StockLedgerReportStatistics
//======================================================

const StockLedgerReportStatistics = ({
  reports = [],
  statistics = null,
  loading = false,
}) => {
  //====================================================
  // Normalize Reports
  //====================================================

  const normalizedReports = useMemo(() => {
    if (!Array.isArray(reports)) {
      return [];
    }

    return normalizeStockLedgerReports(
      reports
    );
  }, [reports]);

  //====================================================
  // Calculate Statistics
  //====================================================

  const calculatedStatistics = useMemo(() => {
    const totalEntries =
      normalizedReports.length;

    const totalInward =
      normalizedReports.reduce(
        (sum, report) =>
          sum +
          Number(
            report?.inwardQuantity ??
              report?.receiptQuantity ??
              report?.inQuantity ??
              0
          ),
        0
      );

    const totalOutward =
      normalizedReports.reduce(
        (sum, report) =>
          sum +
          Number(
            report?.outwardQuantity ??
              report?.issueQuantity ??
              report?.outQuantity ??
              0
          ),
        0
      );

    const totalClosing =
      normalizedReports.reduce(
        (sum, report) =>
          sum +
          Number(
            report?.closingQuantity ??
              report?.closingStock ??
              report?.balanceQuantity ??
              0
          ),
        0
      );

    return {
      totalEntries,
      totalInward,
      totalOutward,
      totalClosing,
    };
  }, [normalizedReports]);

  //====================================================
  // Final Statistics
  //====================================================

  const finalStatistics = {
    ...calculatedStatistics,
    ...(statistics || {}),
  };

  //====================================================
  // Statistics Cards
  //====================================================

  const cards = [
    {
      key: "entries",
      title: "Total Entries",
      value:
        finalStatistics.totalEntries,
      icon:
        Inventory2OutlinedIcon,
      description:
        "Stock ledger transactions",
    },
    {
      key: "inward",
      title: "Total Inward",
      value:
        finalStatistics.totalInward,
      icon:
        ArrowDownwardOutlinedIcon,
      description:
        "Received stock quantity",
    },
    {
      key: "outward",
      title: "Total Outward",
      value:
        finalStatistics.totalOutward,
      icon:
        ArrowUpwardOutlinedIcon,
      description:
        "Issued stock quantity",
    },
    {
      key: "closing",
      title: "Closing Quantity",
      value:
        finalStatistics.totalClosing,
      icon:
        AccountBalanceOutlinedIcon,
      description:
        "Closing stock quantity",
    },
  ];

  //====================================================
  // Part 1A Render
  //====================================================

  return (
    <Box
      className="stock-ledger-report-statistics"
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
      >
        {cards.map((card) => {
          const Icon =
            card.icon;

          return (
            <Grid
              item
              xs={12}
              sm={6}
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
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        {card.title}
                      </Typography>

                      {loading ? (
                        <Skeleton
                          variant="text"
                          width={100}
                          height={40}
                        />
                      ) : (
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          sx={{
                            mt: 0.5,
                          }}
                        >
                          {formatNumber(
                            card.value
                          )}
                        </Typography>
                      )}

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {card.description}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: 44,
                        height: 44,
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
                        fontSize="medium"
                      />
                    </Box>
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

StockLedgerReportStatistics.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.object
  ),

  statistics: PropTypes.shape({
    totalEntries:
      PropTypes.number,

    totalInward:
      PropTypes.number,

    totalOutward:
      PropTypes.number,

    totalClosing:
      PropTypes.number,
  }),

  loading: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

StockLedgerReportStatistics.defaultProps = {
  reports: [],

  statistics: null,

  loading: false,
};

//======================================================
// Export
//======================================================

export default StockLedgerReportStatistics;



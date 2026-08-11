//======================================================
// StockLedgerReportChart.jsx
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
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  formatNumber,
  normalizeStockLedgerReports,
} from "./StockLedgerReportHelpers";

//======================================================
// Constants
//======================================================

const MAX_BAR_HEIGHT = 180;

//======================================================
// StockLedgerReportChart
//======================================================

const StockLedgerReportChart = ({
  reports = [],
  title = "Stock Movement",
  loading = false,
}) => {
  //====================================================
  // Normalize Data
  //====================================================

  const normalizedReports = useMemo(() => {
    return normalizeStockLedgerReports(
      reports
    );
  }, [reports]);

  //====================================================
  // Chart Data
  //====================================================

  const chartData = useMemo(() => {
    if (
      !Array.isArray(
        normalizedReports
      )
    ) {
      return [];
    }

    return normalizedReports
      .slice(-12)
      .map((report, index) => ({
        id:
          report.id ||
          index,

        label:
          report.voucherNumber ||
          report.date ||
          `Entry ${index + 1}`,

        date:
          report.date,

        inward:
          Number(
            report.inwardQuantity
          ) || 0,

        outward:
          Number(
            report.outwardQuantity
          ) || 0,

        closing:
          Number(
            report.closingQuantity
          ) || 0,
      }));
  }, [
    normalizedReports,
  ]);

  //====================================================
  // Maximum Value
  //====================================================

  const maxValue = useMemo(() => {
    if (
      chartData.length === 0
    ) {
      return 1;
    }

    const values =
      chartData.flatMap(
        (item) => [
          item.inward,
          item.outward,
          item.closing,
        ]
      );

    const maximum =
      Math.max(...values);

    return maximum > 0
      ? maximum
      : 1;
  }, [chartData]);

  //====================================================
  // Summary
  //====================================================

  const summary = useMemo(() => {
    return chartData.reduce(
      (result, item) => ({
        inward:
          result.inward +
          item.inward,

        outward:
          result.outward +
          item.outward,

        closing:
          item.closing,
      }),
      {
        inward: 0,
        outward: 0,
        closing: 0,
      }
    );
  }, [chartData]);

  //====================================================
  // Loading State
  //====================================================

  if (loading) {
    return (
      <Card
        variant="outlined"
        className="stock-ledger-report-chart"
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            {title}
          </Typography>

          <Box
            sx={{
              height: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Loading chart...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  //====================================================
  // Empty State
  //====================================================

  if (
    chartData.length === 0
  ) {
    return (
      <Card
        variant="outlined"
        className="stock-ledger-report-chart"
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            {title}
          </Typography>

          <Divider
            sx={{
              my: 2,
            }}
          />

          <Box
            sx={{
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              No stock ledger data
              available for the chart.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  //====================================================
  // Render
  //====================================================

  return (
    <Card
      variant="outlined"
      className="stock-ledger-report-chart"
    >
      <CardContent>

        {/*==============================================
            Header
        ===============================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          justifyContent="space-between"
          spacing={1}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Recent stock movement
              overview
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
          >
            {/* Inward */}

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Inward
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  color:
                    "success.main",
                }}
              >
                {formatNumber(
                  summary.inward
                )}
              </Typography>
            </Box>

            {/* Outward */}

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Outward
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  color:
                    "error.main",
                }}
              >
                {formatNumber(
                  summary.outward
                )}
              </Typography>
            </Box>

            {/* Closing */}

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Closing
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                {formatNumber(
                  summary.closing
                )}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <Divider
          sx={{
            my: 2,
          }}
        />

        {/*==============================================
            Chart
        ===============================================*/}

        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
          }}
        >
          <Box
            sx={{
              minWidth: Math.max(
                700,
                chartData.length * 85
              ),
              height: 300,
              display: "flex",
              alignItems: "flex-end",
              gap: 2,
              px: 2,
              pt: 2,
              pb: 5,
              position: "relative",
              boxSizing: "border-box",
            }}
          >

            {/*==========================================
                Baseline
            ===========================================*/}

            <Box
              sx={{
                position:
                  "absolute",
                left: 0,
                right: 0,
                bottom: 48,
                borderBottom:
                  "1px solid",
                borderColor:
                  "divider",
              }}
            />

            {/*==========================================
                Bars
            ===========================================*/}

            {chartData.map(
              (item) => {
                const inwardHeight =
                  Math.max(
                    2,
                    (item.inward /
                      maxValue) *
                      MAX_BAR_HEIGHT
                  );

                const outwardHeight =
                  Math.max(
                    2,
                    (item.outward /
                      maxValue) *
                      MAX_BAR_HEIGHT
                  );

                const closingHeight =
                  Math.max(
                    2,
                    (item.closing /
                      maxValue) *
                      MAX_BAR_HEIGHT
                  );

                return (
                  <Box
                    key={item.id}
                    sx={{
                      flex: "1 0 65px",
                      minWidth: 65,
                      height: 240,
                      display:
                        "flex",
                      alignItems:
                        "flex-end",
                      justifyContent:
                        "center",
                      position:
                        "relative",
                    }}
                  >

                    {/*================================
                        Bars Group
                    =================================*/}

                    <Stack
                      direction="row"
                      alignItems="flex-end"
                      justifyContent="center"
                      spacing={0.5}
                      sx={{
                        height: 210,
                        width:
                          "100%",
                      }}
                    >

                      {/* Inward */}

                      <Box
                        sx={{
                          width: 14,
                          height:
                            inwardHeight,
                          minHeight:
                            item.inward >
                            0
                              ? 3
                              : 0,
                          borderRadius:
                            "4px 4px 0 0",
                          bgcolor:
                            "success.main",
                          transition:
                            "height 0.2s ease",
                        }}
                        title={`Inward: ${formatNumber(
                          item.inward
                        )}`}
                      />

                      {/* Outward */}

                      <Box
                        sx={{
                          width: 14,
                          height:
                            outwardHeight,
                          minHeight:
                            item.outward >
                            0
                              ? 3
                              : 0,
                          borderRadius:
                            "4px 4px 0 0",
                          bgcolor:
                            "error.main",
                          transition:
                            "height 0.2s ease",
                        }}
                        title={`Outward: ${formatNumber(
                          item.outward
                        )}`}
                      />

                      {/* Closing */}

                      <Box
                        sx={{
                          width: 14,
                          height:
                            closingHeight,
                          minHeight:
                            item.closing >
                            0
                              ? 3
                              : 0,
                          borderRadius:
                            "4px 4px 0 0",
                          bgcolor:
                            "primary.main",
                          transition:
                            "height 0.2s ease",
                        }}
                        title={`Closing: ${formatNumber(
                          item.closing
                        )}`}
                      />

                    </Stack>

                    {/*================================
                        Label
                    =================================*/}

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        position:
                          "absolute",
                        bottom: 8,
                        left: 0,
                        right: 0,
                        textAlign:
                          "center",
                        overflow:
                          "hidden",
                        textOverflow:
                          "ellipsis",
                        whiteSpace:
                          "nowrap",
                      }}
                      title={
                        item.label
                      }
                    >
                      {item.label}
                    </Typography>
                  </Box>
                );
              }
            )}

          </Box>
        </Box>

        {/*==============================================
            Legend
        ===============================================*/}

        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          sx={{
            mt: 1,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: 1,
                bgcolor:
                  "success.main",
              }}
            />

            <Typography
              variant="caption"
            >
              Inward
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: 1,
                bgcolor:
                  "error.main",
              }}
            />

            <Typography
              variant="caption"
            >
              Outward
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: 1,
                bgcolor:
                  "primary.main",
              }}
            />

            <Typography
              variant="caption"
            >
              Closing
            </Typography>
          </Stack>
        </Stack>

      </CardContent>
    </Card>
  );
};

//======================================================
// PropTypes
//======================================================

StockLedgerReportChart.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.object
  ),

  title: PropTypes.string,

  loading: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

StockLedgerReportChart.defaultProps = {
  reports: [],
  title: "Stock Movement",
  loading: false,
};

//======================================================
// Export
//======================================================

export default StockLedgerReportChart;

//======================================================
// Part 1A Ends Here
//======================================================
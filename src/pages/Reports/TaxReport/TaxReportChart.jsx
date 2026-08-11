//======================================================
// TaxReportChart.jsx
// Part 1A
//======================================================

import React, { useMemo } from "react";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

//======================================================
// Number Formatter
//======================================================

const formatNumber = (value) => {
  const number = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

//======================================================
// Tax Bar
//======================================================

const TaxBar = ({
  label,
  value,
  total,
}) => {
  const numericValue = Number(value || 0);
  const numericTotal = Number(total || 0);

  const percentage =
    numericTotal > 0
      ? Math.min(
          100,
          (numericValue /
            numericTotal) *
            100
        )
      : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ mb: 0.75 }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          ₹ {formatNumber(numericValue)}
        </Typography>
      </Stack>

      <Box
        sx={{
          width: "100%",
          height: 10,
          borderRadius: 10,
          bgcolor: "action.hover",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${percentage}%`,
            height: "100%",
            borderRadius: 10,
            bgcolor: "primary.main",
            transition:
              "width 0.3s ease",
          }}
        />
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
      >
        {percentage.toFixed(1)}%
      </Typography>
    </Box>
  );
};

//======================================================
// TaxReportChart
//======================================================

const TaxReportChart = ({
  reports = [],
  statistics = {},
  loading = false,
}) => {
  //====================================================
  // Calculate Tax Data
  //====================================================

  const chartData = useMemo(() => {
    const list = Array.isArray(reports)
      ? reports
      : [];

    const cgstFromReports =
      list.reduce(
        (total, item) =>
          total +
          Number(
            item?.cgst ??
              item?.cgstAmount ??
              0
          ),
        0
      );

    const sgstFromReports =
      list.reduce(
        (total, item) =>
          total +
          Number(
            item?.sgst ??
              item?.sgstAmount ??
              0
          ),
        0
      );

    const igstFromReports =
      list.reduce(
        (total, item) =>
          total +
          Number(
            item?.igst ??
              item?.igstAmount ??
              0
          ),
        0
      );

    const cessFromReports =
      list.reduce(
        (total, item) =>
          total +
          Number(
            item?.cess ??
              item?.cessAmount ??
              0
          ),
        0
      );

    const cgst = Number(
      statistics.cgst ??
        statistics.totalCGST ??
        statistics.cgstAmount ??
        cgstFromReports
    );

    const sgst = Number(
      statistics.sgst ??
        statistics.totalSGST ??
        statistics.sgstAmount ??
        sgstFromReports
    );

    const igst = Number(
      statistics.igst ??
        statistics.totalIGST ??
        statistics.igstAmount ??
        igstFromReports
    );

    const cess = Number(
      statistics.cess ??
        statistics.totalCess ??
        statistics.cessAmount ??
        cessFromReports
    );

    const total =
      cgst +
      sgst +
      igst +
      cess;

    return {
      cgst,
      sgst,
      igst,
      cess,
      total,
    };
  }, [
    reports,
    statistics,
  ]);

  //====================================================
  // Loading
  //====================================================

  if (loading) {
    return (
      <Card
        variant="outlined"
        className="tax-report__chart"
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            gutterBottom
          >
            Tax Distribution
          </Typography>

          <Stack spacing={2.5}>
            {[1, 2, 3, 4].map(
              (item) => (
                <Box key={item}>
                  <Box
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor:
                        "action.hover",
                    }}
                  />
                </Box>
              )
            )}
          </Stack>
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
      className="tax-report__chart"
    >
      <CardContent>
        <Stack spacing={3}>

          {/*============================================
              Header
          =============================================*/}

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Tax Distribution
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Breakdown of tax collected
              by tax component.
            </Typography>
          </Box>

          {/*============================================
              Summary
          =============================================*/}

          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  CGST
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  ₹{" "}
                  {formatNumber(
                    chartData.cgst
                  )}
                </Typography>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  SGST
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  ₹{" "}
                  {formatNumber(
                    chartData.sgst
                  )}
                </Typography>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  IGST
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  ₹{" "}
                  {formatNumber(
                    chartData.igst
                  )}
                </Typography>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Cess
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  ₹{" "}
                  {formatNumber(
                    chartData.cess
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/*============================================
              Bars
          =============================================*/}

          <Stack spacing={2.5}>

            <TaxBar
              label="CGST"
              value={
                chartData.cgst
              }
              total={
                chartData.total
              }
            />

            <TaxBar
              label="SGST"
              value={
                chartData.sgst
              }
              total={
                chartData.total
              }
            />

            <TaxBar
              label="IGST"
              value={
                chartData.igst
              }
              total={
                chartData.total
              }
            />

            <TaxBar
              label="Cess"
              value={
                chartData.cess
              }
              total={
                chartData.total
              }
            />

          </Stack>

          {/*============================================
              Total
          =============================================*/}

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "action.hover",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Total Tax
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                ₹{" "}
                {formatNumber(
                  chartData.total
                )}
              </Typography>
            </Stack>
          </Box>

        </Stack>
      </CardContent>
    </Card>
  );
};

//======================================================
// Export
//======================================================

export default TaxReportChart;

//======================================================
// Part 1A Ends Here
//======================================================
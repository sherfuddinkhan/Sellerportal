//======================================================
// StockMovementReportChart.jsx
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
  Stack,
  Typography,
} from "@mui/material";

import {
  BarChart,
  LineChart,
  PieChart,
} from "@mui/x-charts";

//======================================================
// Helpers
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

const getQuantity = (
  report
) => {
  const value = Number(
    report?.quantity ??
      report?.movementQuantity ??
      report?.qty ??
      0
  );

  return Number.isFinite(value)
    ? Math.abs(value)
    : 0;
};

const getAmount = (
  report
) => {
  const value = Number(
    report?.amount ??
      report?.totalAmount ??
      report?.value ??
      0
  );

  return Number.isFinite(value)
    ? Math.abs(value)
    : 0;
};

const formatNumber = (
  value
) => {
  const number = Number(
    value
  );

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
// Get Movement Category
//======================================================

const getMovementCategory = (
  report
) => {
  const movement =
    getMovementType(
      report
    );

  if (
    movement.includes(
      "inward"
    ) ||
    movement.includes(
      "receipt"
    ) ||
    movement.includes(
      "purchase"
    ) ||
    movement.includes(
      "receive"
    )
  ) {
    return "Inward";
  }

  if (
    movement.includes(
      "outward"
    ) ||
    movement.includes(
      "issue"
    ) ||
    movement.includes(
      "sales"
    ) ||
    movement.includes(
      "dispatch"
    )
  ) {
    return "Outward";
  }

  if (
    movement.includes(
      "transfer"
    )
  ) {
    return "Transfer";
  }

  if (
    movement.includes(
      "adjust"
    )
  ) {
    return "Adjustment";
  }

  return "Other";
};

//======================================================
// StockMovementReportChart
//======================================================

const StockMovementReportChart = ({
  reports = [],
  loading = false,
  title = "Stock Movement Analysis",
  height = 320,
}) => {
  //====================================================
  // Normalize Reports
  //====================================================

  const reportList =
    Array.isArray(reports)
      ? reports
      : [];

  //====================================================
  // Movement Summary
  //====================================================

  const movementSummary =
    useMemo(() => {
      const summary = {
        Inward: {
          quantity: 0,
          amount: 0,
          count: 0,
        },

        Outward: {
          quantity: 0,
          amount: 0,
          count: 0,
        },

        Transfer: {
          quantity: 0,
          amount: 0,
          count: 0,
        },

        Adjustment: {
          quantity: 0,
          amount: 0,
          count: 0,
        },

        Other: {
          quantity: 0,
          amount: 0,
          count: 0,
        },
      };

      reportList.forEach(
        (report) => {
          const category =
            getMovementCategory(
              report
            );

          summary[
            category
          ].quantity +=
            getQuantity(
              report
            );

          summary[
            category
          ].amount +=
            getAmount(
              report
            );

          summary[
            category
          ].count += 1;
        }
      );

      return summary;
    }, [
      reportList,
    ]);

  //====================================================
  // Chart Categories
  //====================================================

  const categories = [
    "Inward",
    "Outward",
    "Transfer",
    "Adjustment",
  ];

  //====================================================
  // Quantity Data
  //====================================================

  const quantityData =
    categories.map(
      (category) =>
        movementSummary[
          category
        ].quantity
    );

  //====================================================
  // Amount Data
  //====================================================

  const amountData =
    categories.map(
      (category) =>
        movementSummary[
          category
        ].amount
    );

  //====================================================
  // Count Data
  //====================================================

  const countData =
    categories.map(
      (category) =>
        movementSummary[
          category
        ].count
    );

  //====================================================
  // Pie Data
  //====================================================

  const pieData =
    categories
      .map(
        (
          category,
          index
        ) => ({
          id: index,
          value:
            movementSummary[
              category
            ].quantity,
          label: category,
        })
      )
      .filter(
        (item) =>
          item.value > 0
      );

  //====================================================
  // Render Loading
  //====================================================

  if (loading) {
    return (
      <Card
        variant="outlined"
        className="stock-movement-report__chart"
      >
        <CardContent>
          <Box
            sx={{
              height,
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
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
  // Render Empty
  //====================================================

  if (
    reportList.length === 0
  ) {
    return (
      <Card
        variant="outlined"
        className="stock-movement-report__chart"
      >
        <CardContent>
          <Box
            sx={{
              height,
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              No stock movement
              data available for
              charting.
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
    <Box
      className="stock-movement-report__charts"
      sx={{
        width: "100%",
      }}
    >
      <Stack spacing={2}>

        {/*==============================================
            Chart Header
        ===============================================*/}

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
            Movement quantity,
            value and transaction
            distribution.
          </Typography>
        </Box>

        {/*==============================================
            Charts
        ===============================================*/}

        <Grid
          container
          spacing={2}
        >

          {/*============================================
              Movement Quantity
          =============================================*/}

          <Grid
            item
            xs={12}
            lg={8}
          >
            <Card
              variant="outlined"
              sx={{
                height: "100%",
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  gutterBottom
                >
                  Quantity by Movement Type
                </Typography>

                <BarChart
                  xAxis={[
                    {
                      scaleType:
                        "band",
                      data:
                        categories,
                    },
                  ]}
                  series={[
                    {
                      data:
                        quantityData,
                      label:
                        "Quantity",
                    },
                  ]}
                  height={height}
                  margin={{
                    left: 70,
                    right: 20,
                    top: 30,
                    bottom: 50,
                  }}
                  grid={{
                    horizontal: true,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/*============================================
              Movement Distribution
          =============================================*/}

          <Grid
            item
            xs={12}
            lg={4}
          >
            <Card
              variant="outlined"
              sx={{
                height: "100%",
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  gutterBottom
                >
                  Quantity Distribution
                </Typography>

                {pieData.length >
                0 ? (
                  <PieChart
                    series={[
                      {
                        data:
                          pieData,
                        innerRadius:
                          45,
                        outerRadius:
                          105,
                        paddingAngle:
                          2,
                        cornerRadius:
                          4,
                      },
                    ]}
                    height={
                      height
                    }
                    margin={{
                      top: 20,
                      bottom: 20,
                      left: 20,
                      right: 20,
                    }}
                    slotProps={{
                      legend: {
                        direction:
                          "row",
                        position: {
                          vertical:
                            "bottom",
                          horizontal:
                            "middle",
                        },
                      },
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      No movement
                      quantity
                      available.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/*============================================
              Movement Value
          =============================================*/}

          <Grid
            item
            xs={12}
          >
            <Card
              variant="outlined"
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  gutterBottom
                >
                  Movement Value
                </Typography>

                <LineChart
                  xAxis={[
                    {
                      scaleType:
                        "point",
                      data:
                        categories,
                    },
                  ]}
                  series={[
                    {
                      data:
                        amountData,
                      label:
                        "Amount",
                    },
                  ]}
                  height={
                    height
                  }
                  margin={{
                    left: 80,
                    right: 30,
                    top: 30,
                    bottom: 50,
                  }}
                  grid={{
                    horizontal: true,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/*============================================
              Summary
          =============================================*/}

          <Grid
            item
            xs={12}
          >
            <Card
              variant="outlined"
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  gutterBottom
                >
                  Movement Summary
                </Typography>

                <Grid
                  container
                  spacing={2}
                >
                  {categories.map(
                    (category) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={
                          category
                        }
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            border:
                              "1px solid",
                            borderColor:
                              "divider",
                            borderRadius:
                              1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {category}
                          </Typography>

                          <Typography
                            variant="h6"
                            fontWeight={700}
                          >
                            {formatNumber(
                              movementSummary[
                                category
                              ].quantity
                            )}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {movementSummary[
                              category
                            ].count}{" "}
                            transaction(s)
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mt: 0.5,
                            }}
                          >
                            ₹
                            {formatNumber(
                              movementSummary[
                                category
                              ].amount
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                    )
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Stack>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

StockMovementReportChart.propTypes = {
  reports:
    PropTypes.arrayOf(
      PropTypes.object
    ),

  loading:
    PropTypes.bool,

  title:
    PropTypes.string,

  height:
    PropTypes.number,
};

//======================================================
// Default Props
//======================================================

StockMovementReportChart.defaultProps = {
  reports: [],
  loading: false,
  title:
    "Stock Movement Analysis",
  height: 320,
};

//======================================================
// Export
//======================================================

export default StockMovementReportChart;

//======================================================
// Part 1A Ends Here
//======================================================
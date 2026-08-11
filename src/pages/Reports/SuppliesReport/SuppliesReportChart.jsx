//======================================================
// SuppliesReportChart.jsx
// Part 1A
//======================================================

import React, {
  useMemo,
} from "react";

import {
  Box,
  Card,
  CardContent,
  Grid,
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

const getValue = (
  report,
  ...fields
) => {
  for (
    const field of fields
  ) {
    if (
      report?.[field] !==
        undefined &&
      report?.[field] !==
        null &&
      report?.[field] !== ""
    ) {
      return report[field];
    }
  }

  return "";
};

//======================================================
// Number Formatter
//======================================================

const formatNumber = (
  value
) => {
  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    )
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
// SuppliesReportChart
//======================================================

const SuppliesReportChart = ({
  reports = [],
  loading = false,
}) => {
  //====================================================
  // Normalize Reports
  //====================================================

  const reportList =
    Array.isArray(
      reports
    )
      ? reports
      : [];

  //====================================================
  // Supplier Chart Data
  //====================================================

  const supplierData =
    useMemo(() => {
      const map =
        new Map();

      reportList.forEach(
        (report) => {
          const supplier =
            getValue(
              report,
              "supplier",
              "supplierName",
              "partyName",
              "vendorName"
            ) ||
            "Unknown";

          const amount =
            Number(
              getValue(
                report,
                "amount",
                "totalAmount",
                "value",
                "totalValue"
              )
            ) || 0;

          map.set(
            supplier,
            (map.get(
              supplier
            ) || 0) +
              amount
          );
        }
      );

      return Array.from(
        map.entries()
      )
        .sort(
          (
            a,
            b
          ) =>
            b[1] -
            a[1]
        )
        .slice(0, 10);
    }, [
      reportList,
    ]);

  //====================================================
  // Category Chart Data
  //====================================================

  const categoryData =
    useMemo(() => {
      const map =
        new Map();

      reportList.forEach(
        (report) => {
          const category =
            getValue(
              report,
              "category",
              "categoryName",
              "itemCategory"
            ) ||
            "Uncategorized";

          const quantity =
            Number(
              getValue(
                report,
                "quantity",
                "qty",
                "supplyQuantity"
              )
            ) || 0;

          map.set(
            category,
            (map.get(
              category
            ) || 0) +
              quantity
          );
        }
      );

      return Array.from(
        map.entries()
      )
        .sort(
          (
            a,
            b
          ) =>
            b[1] -
            a[1]
        )
        .slice(0, 8);
    }, [
      reportList,
    ]);

  //====================================================
  // Date Chart Data
  //====================================================

  const dateData =
    useMemo(() => {
      const map =
        new Map();

      reportList.forEach(
        (report) => {
          const rawDate =
            getValue(
              report,
              "date",
              "supplyDate",
              "transactionDate",
              "voucherDate"
            );

          if (!rawDate) {
            return;
          }

          const date =
            new Date(
              rawDate
            );

          if (
            Number.isNaN(
              date.getTime()
            )
          ) {
            return;
          }

          const key =
            date
              .toISOString()
              .split("T")[0];

          const amount =
            Number(
              getValue(
                report,
                "amount",
                "totalAmount",
                "value",
                "totalValue"
              )
            ) || 0;

          map.set(
            key,
            (map.get(
              key
            ) || 0) +
              amount
          );
        }
      );

      return Array.from(
        map.entries()
      )
        .sort(
          (
            a,
            b
          ) =>
            new Date(
              a[0]
            ) -
            new Date(
              b[0]
            )
        )
        .slice(-12);
    }, [
      reportList,
    ]);

  //====================================================
  // Status Data
  //====================================================

  const statusData =
    useMemo(() => {
      const map =
        new Map();

      reportList.forEach(
        (report) => {
          const status =
            getValue(
              report,
              "status",
              "state"
            ) ||
            "Unknown";

          map.set(
            status,
            (map.get(
              status
            ) || 0) + 1
          );
        }
      );

      return Array.from(
        map.entries()
      ).map(
        (
          [
            label,
            value,
          ],
          index
        ) => ({
          id: index,
          label,
          value,
        })
      );
    }, [
      reportList,
    ]);

  //====================================================
  // Empty State
  //====================================================

  if (
    !loading &&
    reportList.length === 0
  ) {
    return (
      <Card
        variant="outlined"
        className="supplies-report__chart"
      >
        <CardContent>
          <Box
            sx={{
              py: 5,
              textAlign:
                "center",
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
            >
              No chart data available
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
              }}
            >
              Supply report data will
              appear here once records
              are available.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  //====================================================
  // Loading State
  //====================================================

  if (loading) {
    return (
      <Card
        variant="outlined"
        className="supplies-report__chart"
      >
        <CardContent>
          <Box
            sx={{
              height: 350,
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
              Loading charts...
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
      className="supplies-report__charts"
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
      >

        {/*==============================================
            Supply Amount by Supplier
        ===============================================*/}

        <Grid
          item
          xs={12}
          lg={7}
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
                Supply Amount by Supplier
              </Typography>

              {supplierData.length >
              0 ? (
                <BarChart
                  height={320}
                  xAxis={[
                    {
                      scaleType:
                        "band",
                      data:
                        supplierData.map(
                          (
                            item
                          ) =>
                            item[0]
                        ),
                    },
                  ]}
                  series={[
                    {
                      data:
                        supplierData.map(
                          (
                            item
                          ) =>
                            item[1]
                        ),
                      label:
                        "Amount",
                    },
                  ]}
                  margin={{
                    left: 70,
                    right: 20,
                    top: 30,
                    bottom: 90,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: 320,
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
                    No supplier data
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/*==============================================
            Quantity by Category
        ===============================================*/}

        <Grid
          item
          xs={12}
          lg={5}
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
                Quantity by Category
              </Typography>

              {categoryData.length >
              0 ? (
                <PieChart
                  height={320}
                  series={[
                    {
                      data:
                        categoryData.map(
                          (
                            item,
                            index
                          ) => ({
                            id: index,
                            label:
                              item[0],
                            value:
                              item[1],
                          })
                        ),
                      innerRadius:
                        45,
                      outerRadius:
                        110,
                      paddingAngle:
                        2,
                    },
                  ]}
                />
              ) : (
                <Box
                  sx={{
                    height: 320,
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
                    No category data
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/*==============================================
            Supply Amount Trend
        ===============================================*/}

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
                Supply Amount Trend
              </Typography>

              {dateData.length >
              0 ? (
                <LineChart
                  height={320}
                  xAxis={[
                    {
                      scaleType:
                        "point",
                      data:
                        dateData.map(
                          (
                            item
                          ) =>
                            item[0]
                        ),
                    },
                  ]}
                  series={[
                    {
                      data:
                        dateData.map(
                          (
                            item
                          ) =>
                            item[1]
                        ),
                      label:
                        "Amount",
                      curve:
                        "linear",
                    },
                  ]}
                  margin={{
                    left: 70,
                    right: 20,
                    top: 30,
                    bottom: 60,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: 320,
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
                    No date-based data
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/*==============================================
            Status Distribution
        ===============================================*/}

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
                Status Distribution
              </Typography>

              {statusData.length >
              0 ? (
                <PieChart
                  height={320}
                  series={[
                    {
                      data:
                        statusData,
                      innerRadius:
                        50,
                      outerRadius:
                        110,
                      paddingAngle:
                        2,
                    },
                  ]}
                />
              ) : (
                <Box
                  sx={{
                    height: 320,
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
                    No status data
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/*==============================================
          Chart Data Summary
      ===============================================*/}

      <Box
        sx={{
          mt: 2,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {formatNumber(
            reportList.length
          )}{" "}
          supply records included in
          the charts.
        </Typography>
      </Box>
    </Box>
  );
};

//======================================================
// Export
//======================================================

export default SuppliesReportChart;

//======================================================
// Part 1A Ends Here
//======================================================
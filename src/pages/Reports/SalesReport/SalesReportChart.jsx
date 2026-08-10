
//======================================================
// SalesReportChart.jsx
//======================================================

import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import {
  formatCurrency,
  formatDate,
  normalizeSalesReport,
  toNumber,
} from "./SalesReportHelpers";

//======================================================
// SalesReportChart
//======================================================

const SalesReportChart = ({
  reports = [],
  title = "Sales Report",
  chartType = "bar",
  loading = false,
  height = 320,
}) => {
  //====================================================
  // Prepare Chart Data
  //====================================================

  const chartData = useMemo(() => {
    if (!Array.isArray(reports)) {
      return [];
    }

    const normalized =
      reports.map(
        normalizeSalesReport
      );

    return normalized.map(
      (report, index) => ({
        name:
          report.date
            ? formatDate(
                report.date
              )
            : report.orderNumber ||
              `Report ${index + 1}`,

        sales: toNumber(
          report.salesAmount
        ),

        tax: toNumber(
          report.taxAmount
        ),

        total: toNumber(
          report.totalAmount
        ),

        quantity: toNumber(
          report.quantity
        ),

        orderNumber:
          report.orderNumber ||
          "-",

        customer:
          report.customerName ||
          "-",
      })
    );
  }, [reports]);

  //====================================================
  // Empty State
  //====================================================

  if (
    !loading &&
    chartData.length === 0
  ) {
    return (
      <Card
        className="sales-report-chart"
        sx={{
          width: "100%",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
          >
            {title}
          </Typography>

          <Box
            sx={{
              height,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              No sales data available
              for the chart.
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
      className="sales-report-chart"
      sx={{
        width: "100%",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
        >
          {title}
        </Typography>

        <Box
          sx={{
            width: "100%",
            height,
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            {chartType ===
            "line" ? (
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  formatter={(
                    value,
                    name
                  ) => [
                    name ===
                    "quantity"
                      ? value
                      : formatCurrency(
                          value
                        ),
                    name ===
                    "sales"
                      ? "Sales"
                      : name ===
                        "tax"
                      ? "Tax"
                      : name ===
                        "total"
                      ? "Total"
                      : "Quantity",
                  ]}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="sales"
                  name="Sales"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                  }}
                />
              </LineChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  formatter={(
                    value,
                    name
                  ) => [
                    name ===
                    "quantity"
                      ? value
                      : formatCurrency(
                          value
                        ),
                    name ===
                    "sales"
                      ? "Sales"
                      : name ===
                        "tax"
                      ? "Tax"
                      : name ===
                        "total"
                      ? "Total"
                      : "Quantity",
                  ]}
                />

                <Legend />

                <Bar
                  dataKey="sales"
                  name="Sales"
                  barSize={24}
                />

                <Bar
                  dataKey="total"
                  name="Total"
                  barSize={24}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

//======================================================
// PropTypes
//======================================================

SalesReportChart.propTypes = {
  reports:
    PropTypes.arrayOf(
      PropTypes.object
    ),

  title:
    PropTypes.string,

  chartType:
    PropTypes.oneOf([
      "bar",
      "line",
    ]),

  loading:
    PropTypes.bool,

  height:
    PropTypes.number,
};

//======================================================
// Default Props
//======================================================

SalesReportChart.defaultProps = {
  reports: [],

  title:
    "Sales Report",

  chartType:
    "bar",

  loading: false,

  height: 320,
};

//======================================================
// Export
//======================================================

export default SalesReportChart;

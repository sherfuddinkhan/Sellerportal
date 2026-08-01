import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const SalesChart = ({ data }) => {

  if (!data || data.length === 0) {
    return (
      <Card elevation={3}>
        <CardContent>

          <Typography variant="h6">
            Sales
          </Typography>

          <Typography color="text.secondary">
            No Sales Data Available
          </Typography>

        </CardContent>
      </Card>
    );
  }

  const chartData = {

    labels: data.map(x => x.category),

    datasets: [
      {
        data: data.map(x => x.total),

        backgroundColor: [
          "#1976d2",
          "#2e7d32",
          "#ed6c02",
          "#9c27b0",
          "#d32f2f",
          "#0288d1"
        ],

        borderWidth: 1
      }
    ]

  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        position: "bottom"
      }

    }

  };

  return (

    <Card elevation={3}>

      <CardContent>

        <Typography
          variant="h6"
          gutterBottom
        >
          Sales By Category
        </Typography>

        <Box
          sx={{
            height: 350
          }}
        >

          <Doughnut
            data={chartData}
            options={options}
          />

        </Box>

      </CardContent>

    </Card>

  );

};

export default SalesChart;
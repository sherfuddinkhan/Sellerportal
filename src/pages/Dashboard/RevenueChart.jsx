import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = ({ data }) => {

  if (!data || data.length === 0) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6">
            Revenue
          </Typography>

          <Typography color="text.secondary">
            No Revenue Data Available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const chartData = {

    labels: data.map(x => x.month),

    datasets: [

      {
        label: "Revenue",

        data: data.map(x => x.amount),

        borderColor: "#1976d2",

        backgroundColor: "rgba(25,118,210,0.20)",

        fill: true,

        tension: 0.4
      }

    ]
  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        position: "top"
      },

      title: {
        display: true,
        text: "Monthly Revenue"
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
          Monthly Revenue
        </Typography>

        <Box
          sx={{
            height: 350
          }}
        >

          <Line
            data={chartData}
            options={options}
          />

        </Box>

      </CardContent>

    </Card>

  );

};

export default RevenueChart;
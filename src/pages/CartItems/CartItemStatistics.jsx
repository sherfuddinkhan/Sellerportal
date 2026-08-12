import React from "react";

import {
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

const StatisticCard = ({
  title,
  value,
}) => (
  <Card variant="outlined">
    <CardContent>
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {title}
      </Typography>

      <Typography
        variant="h5"
        fontWeight={700}
      >
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const CartItemStatistics = ({
  statistics = {},
}) => {
  return (
    <Grid
      container
      spacing={2}
    >
      <Grid item xs={12} sm={6} md={3}>
        <StatisticCard
          title="Total Cart Items"
          value={
            statistics.totalItems || 0
          }
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatisticCard
          title="Total Quantity"
          value={
            statistics.totalQuantity || 0
          }
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatisticCard
          title="Total Cart Value"
          value={`₹${Number(
            statistics.totalValue || 0
          ).toLocaleString("en-IN")}`}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatisticCard
          title="Unique Products"
          value={
            statistics.uniqueProducts || 0
          }
        />
      </Grid>
    </Grid>
  );
};

export default CartItemStatistics;
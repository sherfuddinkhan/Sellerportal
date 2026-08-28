import React from "react";
import { Box, Grid } from "@mui/material";

import DashboardHeader from "./DashboardHeader";
import DashboardCards from "./DashboardCards";
import RevenueChart from "./RevenueChart";
import SalesChart from "./SalesChart";
import LatestOrders from "./LatestOrders";
import RecentCustomers from "./RecentCustomers";
import TopSellingProducts from "./TopSellingProducts";
import LowStockProducts from "./LowStockProducts";

const Dashboard = () => {

  // Temporary dashboard data
  const dashboardData = {
    summary: {},
    revenue: [],
    sales: [],
    latestOrders: [],
    recentCustomers: [],
    topProducts: [],
    lowStockProducts: [],
  };

  return (
    <Box p={3}>

      <DashboardHeader
        onRefresh={() => window.location.reload()}
        onExport={() => console.log("Export Dashboard")}
      />

      <DashboardCards
        summary={dashboardData.summary}
      />

      <Grid container spacing={3} mt={1}>

        <Grid item xs={12} md={8}>
          <RevenueChart
            data={dashboardData.revenue}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <SalesChart
            data={dashboardData.sales}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <LatestOrders
            orders={dashboardData.latestOrders}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <RecentCustomers
            customers={dashboardData.recentCustomers}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TopSellingProducts
            products={dashboardData.topProducts}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LowStockProducts
            products={dashboardData.lowStockProducts}
          />
        </Grid>

      </Grid>

    </Box>
  );
};

export default Dashboard;

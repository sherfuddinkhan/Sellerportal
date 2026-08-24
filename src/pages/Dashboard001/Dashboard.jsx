import React, { useEffect, useState } from "react";
import {Box,Grid,CircularProgress,Alert} from "@mui/material";

import DashboardHeader from "./DashboardHeader";
import DashboardCards from "./DashboardCards";
import RevenueChart from "./RevenueChart";
import SalesChart from "./SalesChart";
import InventoryChart from "./InventoryChart";
import OrderChart from "./OrderChart";
import StatisticalChart from "./StatisticalChart";
import LatestOrders from "./LatestOrders";
import RecentCustomers from "./RecentCustomers";
import TopSellingProducts from "./TopSellingProducts";
import LowStockProducts from "./LowStockProducts";
import QuickActions from "./QuickActions";
import DashboardSummary from "./DashboardSummary";


const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await dashboardService.getDashboardSummary();

      setDashboardData(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={10}
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );

  return (
    <Box p={3}>

     <DashboardHeader
    onRefresh={loadDashboard}
    onExport={() => console.log("Export Dashboard")}
/>

      <StatisticsCards
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
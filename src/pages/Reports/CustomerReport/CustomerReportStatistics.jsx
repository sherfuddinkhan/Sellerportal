import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {Box,Card,CardContent,Grid,Stack,Typography} from "@mui/material";
import {normalizeCustomers,calculateCustomerStatistics,sortCustomers} from "./CustomerReportHelpers";
import {People,ShoppingCart,CurrencyRupee,AccountBalanceWallet,TrendingUp,TrendingDown} from "@mui/icons-material";
//======================================================
// CustomerReportStatistics
//======================================================
const CustomerReportStatistics = ({
  customers = [],
  loading = false,
}) => {
  //====================================================
  // Statistics Calculation
  //====================================================
  const statistics = useMemo(() => {
    const data = Array.isArray(customers) ? customers : [];
    const totalCustomers = data.length;
    const activeCustomers = data.filter((customer) => String(customer?.status || "").toLowerCase() === "active").length;
    const inactiveCustomers = data.filter((customer) => String(customer?.status || "").toLowerCase() === "inactive").length;
    const blockedCustomers = data.filter( (customer) => String(customer?.status || "").toLowerCase() === "blocked").length;
    const totalOrders = data.reduce((sum, customer) => sum + Number(customer?.totalOrders ?? customer?.orderCount ?? 0 ), 0);
    const totalSales = data.reduce( (sum, customer) => sum + Number( customer?.totalSales ?? customer?.totalAmount ?? customer?.salesAmount ?? 0 ),0);
    const totalPaid = data.reduce((sum, customer) => sum + Number(customer?.totalPaid ?? customer?.paidAmount ?? 0 ),0);
    const totalOutstanding = data.reduce( (sum, customer) => sum + Number( customer?.totalOutstanding ?? customer?.outstandingAmount ?? customer?.balance ?? 0),0);
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const averageCustomerValue = totalCustomers > 0 ? totalSales / totalCustomers : 0;
    return {
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      blockedCustomers,
      totalOrders,
      totalSales,
      totalPaid,
      totalOutstanding,
      averageOrderValue,
      averageCustomerValue,
    };

  }, [customers]);

  //====================================================
  // Currency Formatter
  //====================================================

  const formatCurrency = useMemo(
    () => (value) =>
      new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        }
      ).format(Number(value) || 0),
    []
  );

  //====================================================
  // Number Formatter
  //====================================================
  const formatNumber = useMemo(
    () => (value) =>
      new Intl.NumberFormat(
        "en-IN"
      ).format(Number(value) || 0),
    []
  );
    //====================================================
  // Statistics Card
  //====================================================

  const StatisticCard = ({
    title,
    value,
    subtitle,
    icon,
    iconColor = "primary",
    valueColor = "text.primary",
  }) => (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 2,
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              fontWeight={700}
              color={valueColor}
              sx={{ mt: 0.5 }}
            >
              {loading ? "—" : value}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              minWidth: 48,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${iconColor}.light`,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
  //====================================================
  // Statistics JSX
  //====================================================
  return (
    <Box
      className="customer-report-statistics"
      sx={{
        width: "100%",
        mb: 2,
      }}
    >

      <Grid
        container
        spacing={2}
      >
        {/*==============================================
            Total Customers
        ==============================================*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticCard
            title="Total Customers"
            value={formatNumber(
              statistics.totalCustomers
            )}
            subtitle={`${formatNumber(
              statistics.activeCustomers
            )} active`}
            icon={
              <People color="primary" />
            }
            iconColor="primary"
          />
        </Grid>
        {/*==============================================
            Active Customers
        ==============================================*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticCard
            title="Active Customers"
            value={formatNumber(
              statistics.activeCustomers
            )}
            subtitle={`${formatNumber(
              statistics.inactiveCustomers
            )} inactive`}
            icon={
              <TrendingUp color="success" />
            }
            iconColor="success"
            valueColor="success.main"
          />
        </Grid>

        {/*==============================================
            Total Orders
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticCard
            title="Total Orders"
            value={formatNumber(
              statistics.totalOrders
            )}
            subtitle={`Avg. ${formatCurrency(
              statistics.averageOrderValue
            )} / order`}
            icon={
              <ShoppingCart color="primary" />
            }
            iconColor="primary"
          />
        </Grid>

        {/*==============================================
            Total Sales
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticCard
            title="Total Sales"
            value={formatCurrency(
              statistics.totalSales
            )}
            subtitle={`Avg. ${formatCurrency(
              statistics.averageCustomerValue
            )} / customer`}
            icon={
              <CurrencyRupee color="success" />
            }
            iconColor="success"
            valueColor="success.main"
          />
        </Grid>

        {/*==============================================
            Total Paid
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <StatisticCard
            title="Total Paid"
            value={formatCurrency(
              statistics.totalPaid
            )}
            subtitle="Collected from customers"
            icon={
              <AccountBalanceWallet
                color="success"
              />
            }
            iconColor="success"
            valueColor="success.main"
          />
        </Grid>

        {/*==============================================
            Outstanding
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <StatisticCard
            title="Outstanding"
            value={formatCurrency(
              statistics.totalOutstanding
            )}
            subtitle="Pending customer balance"
            icon={
              <TrendingDown color="error" />
            }
            iconColor="error"
            valueColor={
              statistics.totalOutstanding > 0
                ? "error.main"
                : "success.main"
            }
          />
        </Grid>

        {/*==============================================
            Inactive / Blocked
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={12}
          md={4}
        >
          <StatisticCard
            title="Inactive / Blocked"
            value={formatNumber(
              statistics.inactiveCustomers +
              statistics.blockedCustomers
            )}
            subtitle={`${formatNumber(
              statistics.blockedCustomers
            )} blocked`}
            icon={
              <People color="warning" />
            }
            iconColor="warning"
            valueColor="warning.main"
          />
        </Grid>

      </Grid>

    </Box>
  );
};
//======================================================
// PropTypes
//======================================================

CustomerReportStatistics.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.object
  ),

  loading: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

CustomerReportStatistics.defaultProps = {
  customers: [],

  loading: false,
};

//======================================================
// Export
//======================================================

export default CustomerReportStatistics;
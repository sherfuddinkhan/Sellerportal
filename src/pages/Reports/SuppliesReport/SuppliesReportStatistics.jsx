//======================================================
// SuppliesReportStatistics.jsx
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
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PeopleIcon from "@mui/icons-material/People";

//======================================================
// Format Number
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
// Format Currency
//======================================================

const formatCurrency = (
  value
) => {
  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    )
  ) {
    return "₹0.00";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }
  ).format(number);
};

//======================================================
// Get Value
//======================================================

const getValue = (
  report,
  ...fields
) => {
  for (
    const field of fields
  ) {
    const value =
      report?.[field];

    if (
      value !==
        undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return 0;
};

//======================================================
// Statistic Card
//======================================================

const StatisticCard = ({
  icon,
  title,
  value,
  subtitle,
  loading,
}) => {
  return (
    <Card
      variant="outlined"
      className="supplies-report__stat-card"
      sx={{
        height: "100%",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          {/*============================================
              Icon
          =============================================*/}

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                "action.hover",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          {/*============================================
              Information
          =============================================*/}

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              className="supplies-report__stat-label"
            >
              {title}
            </Typography>

            {loading ? (
              <Skeleton
                variant="text"
                width="70%"
                height={34}
              />
            ) : (
              <Typography
                variant="h6"
                fontWeight={700}
                className="supplies-report__stat-value"
                sx={{
                  lineHeight: 1.4,
                  wordBreak:
                    "break-word",
                }}
              >
                {value}
              </Typography>
            )}

            {subtitle ? (
              <Typography
                variant="caption"
                color="text.secondary"
                className="supplies-report__stat-caption"
              >
                {subtitle}
              </Typography>
            ) : null}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

//======================================================
// SuppliesReportStatistics
//======================================================

const SuppliesReportStatistics = ({
  reports = [],
  statistics = {},
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
  // Calculate Statistics
  //====================================================

  const calculatedStatistics =
    useMemo(() => {
      //==================================================
      // Use statistics supplied by View when available
      //==================================================

      const totalReports =
        Number(
          statistics?.total
        );

      const totalQuantity =
        Number(
          statistics?.totalQuantity
        );

      const totalAmount =
        Number(
          statistics?.totalAmount
        );

      const totalSuppliers =
        Number(
          statistics?.totalSuppliers
        );

      //==================================================
      // Calculate fallback values
      //==================================================

      const fallbackQuantity =
        reportList.reduce(
          (
            total,
            report
          ) =>
            total +
            Number(
              getValue(
                report,
                "quantity",
                "qty",
                "supplyQuantity"
              )
            ),
          0
        );

      const fallbackAmount =
        reportList.reduce(
          (
            total,
            report
          ) =>
            total +
            Number(
              getValue(
                report,
                "amount",
                "totalAmount",
                "value",
                "totalValue"
              )
            ),
          0
        );

      const fallbackSuppliers =
        new Set(
          reportList
            .map(
              (report) =>
                getValue(
                  report,
                  "supplier",
                  "supplierName",
                  "partyName",
                  "vendorName"
                )
            )
            .filter(
              Boolean
            )
        ).size;

      return {
        total:
          Number.isFinite(
            totalReports
          )
            ? totalReports
            : reportList.length,

        totalQuantity:
          Number.isFinite(
            totalQuantity
          )
            ? totalQuantity
            : fallbackQuantity,

        totalAmount:
          Number.isFinite(
            totalAmount
          )
            ? totalAmount
            : fallbackAmount,

        totalSuppliers:
          Number.isFinite(
            totalSuppliers
          )
            ? totalSuppliers
            : fallbackSuppliers,
      };
    }, [
      reports,
      reportList,
      statistics,
    ]);

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="supplies-report__statistics"
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
      >

        {/*==============================================
            Total Supplies
        ===============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticCard
            icon={
              <Inventory2Icon
                fontSize="small"
              />
            }
            title="Total Supplies"
            value={formatNumber(
              calculatedStatistics.total
            )}
            subtitle="Supply transactions"
            loading={loading}
          />
        </Grid>

        {/*==============================================
            Total Quantity
        ===============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticCard
            icon={
              <LocalShippingIcon
                fontSize="small"
              />
            }
            title="Total Quantity"
            value={formatNumber(
              calculatedStatistics.totalQuantity
            )}
            subtitle="Units supplied"
            loading={loading}
          />
        </Grid>

        {/*==============================================
            Total Amount
        ===============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticCard
            icon={
              <CurrencyRupeeIcon
                fontSize="small"
              />
            }
            title="Total Amount"
            value={formatCurrency(
              calculatedStatistics.totalAmount
            )}
            subtitle="Supply value"
            loading={loading}
          />
        </Grid>

        {/*==============================================
            Total Suppliers
        ===============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticCard
            icon={
              <PeopleIcon
                fontSize="small"
              />
            }
            title="Suppliers"
            value={formatNumber(
              calculatedStatistics.totalSuppliers
            )}
            subtitle="Unique suppliers"
            loading={loading}
          />
        </Grid>

      </Grid>
    </Box>
  );
};

//======================================================
// Export
//======================================================

export default SuppliesReportStatistics;

//======================================================
// Part 1A Ends Here
//======================================================
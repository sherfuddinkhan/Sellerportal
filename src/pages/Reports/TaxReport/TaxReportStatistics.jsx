//======================================================
// TaxReportStatistics.jsx
// Part 1A
//======================================================

import React, { useMemo } from "react";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PercentIcon from "@mui/icons-material/Percent";

//======================================================
// Number Formatter
//======================================================

const formatNumber = (value) => {
  const number = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

//======================================================
// Statistics Card
//======================================================

const StatisticsCard = ({
  title,
  value,
  subtitle,
  icon,
}) => {
  return (
    <Card
      variant="outlined"
      className="tax-report__statistics-card"
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
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "action.hover",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
            >
              {title}
            </Typography>

            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                mt: 0.5,
              }}
            >
              {value}
            </Typography>

            {subtitle ? (
              <Typography
                variant="caption"
                color="text.secondary"
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
// Loading Card
//======================================================

const LoadingCard = () => {
  return (
    <Card
      variant="outlined"
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
          <Skeleton
            variant="rounded"
            width={46}
            height={46}
          />

          <Box
            sx={{
              flex: 1,
            }}
          >
            <Skeleton
              width="60%"
              height={20}
            />

            <Skeleton
              width="45%"
              height={32}
            />

            <Skeleton
              width="70%"
              height={18}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

//======================================================
// TaxReportStatistics
//======================================================

const TaxReportStatistics = ({
  statistics = {},
  reports = [],
  loading = false,
}) => {
  //====================================================
  // Safe Statistics
  //====================================================

  const stats = useMemo(() => {
    const list = Array.isArray(reports)
      ? reports
      : [];

    const totalReports = Number(
      statistics.totalReports ??
        statistics.total ??
        list.length
    );

    const taxableAmount = Number(
      statistics.taxableAmount ??
        statistics.totalTaxableAmount ??
        statistics.taxableValue ??
        0
    );

    const cgst = Number(
      statistics.cgst ??
        statistics.totalCGST ??
        statistics.cgstAmount ??
        0
    );

    const sgst = Number(
      statistics.sgst ??
        statistics.totalSGST ??
        statistics.sgstAmount ??
        0
    );

    const igst = Number(
      statistics.igst ??
        statistics.totalIGST ??
        statistics.igstAmount ??
        0
    );

    const cess = Number(
      statistics.cess ??
        statistics.totalCess ??
        statistics.cessAmount ??
        0
    );

    const totalTax = Number(
      statistics.totalTax ??
        statistics.taxAmount ??
        cgst +
          sgst +
          igst +
          cess
    );

    const invoiceTotal = Number(
      statistics.invoiceTotal ??
        statistics.totalAmount ??
        statistics.grandTotal ??
        0
    );

    return {
      totalReports,
      taxableAmount,
      cgst,
      sgst,
      igst,
      cess,
      totalTax,
      invoiceTotal,
    };
  }, [
    statistics,
    reports,
  ]);

  //====================================================
  // Loading
  //====================================================

  if (loading) {
    return (
      <Box
        className="tax-report__statistics"
        sx={{
          width: "100%",
        }}
      >
        <Grid
          container
          spacing={2}
        >
          {[1, 2, 3, 4].map(
            (item) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={item}
              >
                <LoadingCard />
              </Grid>
            )
          )}
        </Grid>
      </Box>
    );
  }

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="tax-report__statistics"
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
      >
        {/*==============================================
            Total Reports
        ===============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticsCard
            title="Tax Records"
            value={formatNumber(
              stats.totalReports
            )}
            subtitle="Total records"
            icon={
              <ReceiptLongIcon />
            }
          />
        </Grid>

        {/*==============================================
            Taxable Amount
        ===============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticsCard
            title="Taxable Amount"
            value={`₹ ${formatNumber(
              stats.taxableAmount
            )}`}
            subtitle="Total taxable value"
            icon={
              <CurrencyRupeeIcon />
            }
          />
        </Grid>

        {/*==============================================
            Total Tax
        ===============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticsCard
            title="Total Tax"
            value={`₹ ${formatNumber(
              stats.totalTax
            )}`}
            subtitle="CGST + SGST + IGST + Cess"
            icon={
              <AccountBalanceIcon />
            }
          />
        </Grid>

        {/*==============================================
            Invoice Total
        ===============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticsCard
            title="Invoice Total"
            value={`₹ ${formatNumber(
              stats.invoiceTotal
            )}`}
            subtitle="Total invoice value"
            icon={
              <PercentIcon />
            }
          />
        </Grid>
      </Grid>

      {/*==============================================
          Tax Component Breakdown
      ===============================================*/}

      <Grid
        container
        spacing={2}
        sx={{
          mt: 0,
        }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticsCard
            title="CGST"
            value={`₹ ${formatNumber(
              stats.cgst
            )}`}
            subtitle="Central GST"
            icon={
              <Typography
                fontWeight={700}
              >
                C
              </Typography>
            }
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticsCard
            title="SGST"
            value={`₹ ${formatNumber(
              stats.sgst
            )}`}
            subtitle="State GST"
            icon={
              <Typography
                fontWeight={700}
              >
                S
              </Typography>
            }
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticsCard
            title="IGST"
            value={`₹ ${formatNumber(
              stats.igst
            )}`}
            subtitle="Integrated GST"
            icon={
              <Typography
                fontWeight={700}
              >
                I
              </Typography>
            }
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <StatisticsCard
            title="Cess"
            value={`₹ ${formatNumber(
              stats.cess
            )}`}
            subtitle="Additional cess"
            icon={
              <Typography
                fontWeight={700}
              >
                C
              </Typography>
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

//======================================================
// Export
//======================================================

export default TaxReportStatistics;

//======================================================
// Part 1A Ends Here
//======================================================
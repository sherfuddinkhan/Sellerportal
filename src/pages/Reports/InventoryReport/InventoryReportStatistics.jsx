import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import {
  Assessment,
  Inventory2,
  MonetizationOn,
  Storage,
} from "@mui/icons-material";

//======================================================
// InventoryReportStatistics
//======================================================

const InventoryReportStatistics = ({
  reports = [],
  loading = false,
}) => {

  //====================================================
  // Safe Reports
  //====================================================

  const safeReports = useMemo(
    () =>
      Array.isArray(reports)
        ? reports
        : [],
    [reports]
  );

  //====================================================
  // Statistics
  //====================================================

  const statistics = useMemo(() => {

    let totalRecords = 0;
    let totalStock = 0;
    let totalValue = 0;

    let activeReports = 0;
    let inactiveReports = 0;
    let draftReports = 0;

    safeReports.forEach(
      (report) => {

        totalRecords +=
          Number(
            report?.totalRecords ??
            report?.recordCount ??
            report?.records ??
            0
          ) || 0;

        totalStock +=
          Number(
            report?.totalStock ??
            report?.stockQuantity ??
            report?.quantity ??
            0
          ) || 0;

        totalValue +=
          Number(
            report?.totalValue ??
            report?.inventoryValue ??
            report?.stockValue ??
            0
          ) || 0;

        const status =
          String(
            report?.status ??
            report?.reportStatus ??
            ""
          ).toLowerCase();

        if (status === "active") {
          activeReports += 1;
        }

        if (status === "inactive") {
          inactiveReports += 1;
        }

        if (status === "draft") {
          draftReports += 1;
        }

      }
    );

    return {
      totalReports:
        safeReports.length,

      totalRecords,

      totalStock,

      totalValue,

      activeReports,

      inactiveReports,

      draftReports,
    };

  }, [safeReports]);

  //====================================================
  // Format Number
  //====================================================

  const formatNumber = (
    value
  ) =>
    Number(value).toLocaleString(
      "en-IN"
    );

  //====================================================
  // Format Currency
  //====================================================

  const formatCurrency = (
    value
  ) =>
    new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(
      Number(value) || 0
    );

  //====================================================
  // Statistics Card Configuration
  //====================================================

  const cards = [
    {
      key: "totalReports",

      title: "Total Reports",

      value:
        formatNumber(
          statistics.totalReports
        ),

      icon: (
        <Assessment />
      ),

      description:
        "Inventory reports",
    },

    {
      key: "activeReports",

      title: "Active Reports",

      value:
        formatNumber(
          statistics.activeReports
        ),

      icon: (
        <Inventory2 />
      ),

      description:
        "Currently active",
    },

    {
      key: "totalRecords",

      title: "Total Records",

      value:
        formatNumber(
          statistics.totalRecords
        ),

      icon: (
        <Storage />
      ),

      description:
        "Inventory records",
    },

    {
      key: "totalValue",

      title: "Inventory Value",

      value:
        formatCurrency(
          statistics.totalValue
        ),

      icon: (
        <MonetizationOn />
      ),

      description:
        "Total stock value",
    },
  ];

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Box
      className="inventory-report-statistics"
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
      >

        {cards.map((card) => (

          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={card.key}
          >
            <Card
              variant="outlined"
              sx={{
                height: "100%",
              }}
            >
              <CardContent>

                {loading ? (

                  <Stack spacing={1}>

                    <Skeleton
                      variant="text"
                      width="60%"
                      height={24}
                    />

                    <Skeleton
                      variant="text"
                      width="80%"
                      height={38}
                    />

                    <Skeleton
                      variant="text"
                      width="50%"
                      height={20}
                    />

                  </Stack>

                ) : (

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}
                  >

                    {/*================================
                        Statistics Information
                    =================================*/}

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
                        {card.title}
                      </Typography>

                      <Typography
                        variant="h5"
                        fontWeight={600}
                        sx={{
                          mt: 0.5,
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {card.value}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {card.description}
                      </Typography>

                    </Box>

                    {/*================================
                        Icon
                    =================================*/}

                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor:
                          "action.hover",
                        color:
                          "primary.main",
                        flexShrink: 0,
                      }}
                    >
                      {card.icon}
                    </Box>

                  </Stack>

                )}

              </CardContent>
            </Card>
          </Grid>

        ))}

      </Grid>

      {/*================================================
          Secondary Statistics
      =================================================*/}

      {!loading && (
        <Grid
          container
          spacing={2}
          sx={{ mt: 0.5 }}
        >

          {/*==============================================
              Total Stock
          ==============================================*/}

          <Grid
            item
            xs={12}
            sm={4}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor:
                  "action.hover",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Total Stock Quantity
              </Typography>

              <Typography
                variant="h6"
                fontWeight={600}
              >
                {formatNumber(
                  statistics.totalStock
                )}
              </Typography>
            </Box>
          </Grid>

          {/*==============================================
              Inactive Reports
          ==============================================*/}

          <Grid
            item
            xs={12}
            sm={4}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor:
                  "action.hover",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Inactive Reports
              </Typography>

              <Typography
                variant="h6"
                fontWeight={600}
              >
                {formatNumber(
                  statistics.inactiveReports
                )}
              </Typography>
            </Box>
          </Grid>

          {/*==============================================
              Draft Reports
          ==============================================*/}

          <Grid
            item
            xs={12}
            sm={4}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor:
                  "action.hover",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Draft Reports
              </Typography>

              <Typography
                variant="h6"
                fontWeight={600}
              >
                {formatNumber(
                  statistics.draftReports
                )}
              </Typography>
            </Box>
          </Grid>

        </Grid>
      )}

    </Box>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================

//======================================================
// PropTypes
//======================================================

InventoryReportStatistics.propTypes = {
  reports: PropTypes.array,

  loading: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

InventoryReportStatistics.defaultProps = {
  reports: [],

  loading: false,
};

//======================================================
// Export
//======================================================

export default InventoryReportStatistics;
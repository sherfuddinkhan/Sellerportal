import React from "react";
import {Box,Chip,Divider,Grid,IconButton,Paper,Stack,Typography} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import {Assessment,CalendarToday,Person,Storage} from "@mui/icons-material";

//======================================================
// DashboardReportView
//======================================================

const DashboardReportView = ({
  open = false,
  report = {},
  onClose,
}) => {

  //====================================================
  // Safe Report Values
  //====================================================

  const reportId =
    report?.id ??
    report?.reportId ??
    report?.dashboardReportId ??
    "";

  const reportName =
    report?.reportName ||
    report?.name ||
    report?.title ||
    "Dashboard Report";

  const reportType =
    report?.reportType ||
    report?.type ||
    "Dashboard";

  const status =
    report?.status ||
    report?.reportStatus ||
    "Active";

  const description =
    report?.description ||
    report?.remarks ||
    report?.summary ||
    "No description available.";

  const createdBy =
    report?.createdByName ||
    report?.createdBy ||
    report?.ownerName ||
    report?.owner ||
    "System";

  const createdDate =
    report?.createdDate ||
    report?.createdAt ||
    report?.created_date ||
    "";

  const updatedDate =
    report?.updatedDate ||
    report?.updatedAt ||
    report?.updated_date ||
    "";

  //====================================================
  // Report Statistics
  //====================================================

  const totalRecords =
    Number(
      report?.totalRecords ??
      report?.recordCount ??
      report?.records ??
      0
    );

  const totalAmount =
    Number(
      report?.totalAmount ??
      report?.amount ??
      report?.totalSales ??
      0
    );

  const totalOrders =
    Number(
      report?.totalOrders ??
      report?.orderCount ??
      report?.orders ??
      0
    );

  //====================================================
  // Currency Formatter
  //====================================================

  const formatCurrency = (
    value
  ) => {

    if (
      !Number.isFinite(value)
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
    ).format(value);
  };

  //====================================================
  // Date Formatter
  //====================================================

  const formatDate = (
    value
  ) => {

    if (!value) {
      return "-";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return String(value);
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  //====================================================
  // Status Color
  //====================================================

  const getStatusColor = () => {

    switch (
      String(status)
        .toLowerCase()
    ) {

      case "active":
        return "success";

      case "inactive":
        return "warning";

      case "draft":
        return "default";

      case "archived":
        return "secondary";

      case "deleted":
        return "error";

      default:
        return "primary";
    }
  };

  //====================================================
  // Close Handler
  //====================================================

  const handleClose = () => {

    if (
      typeof onClose === "function"
    ) {
      onClose();
    }

  };

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  if (!open) {
    return null;
  }

  return (
    <Paper
      className="dashboard-report-view"
      elevation={0}
      sx={{
        width: "100%",
        p: {
          xs: 2,
          sm: 3,
        },
        borderRadius: 2,
      }}
    >

      {/*================================================
          Header
      =================================================*/}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        sx={{
          mb: 3,
        }}
      >

        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              wordBreak: "break-word",
            }}
          >
            {reportName}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Report ID:{" "}
            {reportId || "-"}
          </Typography>
        </Box>

        <Chip
          label={status}
          color={getStatusColor()}
          size="medium"
        />

      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/*================================================
          Summary Statistics
      =================================================*/}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 3,
        }}
      >

        {/*==============================================
            Total Records
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              height: "100%",
              borderRadius: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <Storage
                color="primary"
              />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Total Records
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={600}
                >
                  {totalRecords.toLocaleString(
                    "en-IN"
                  )}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/*==============================================
            Total Orders
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              height: "100%",
              borderRadius: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <Assessment
                color="success"
              />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Total Orders
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={600}
                >
                  {totalOrders.toLocaleString(
                    "en-IN"
                  )}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/*==============================================
            Total Amount
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={12}
          md={4}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              height: "100%",
              borderRadius: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <Assessment
                color="warning"
              />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Total Amount
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={600}
                >
                  {formatCurrency(
                    totalAmount
                  )}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

      </Grid>

      {/*================================================
          Report Information
      =================================================*/}

      <Paper
        variant="outlined"
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
          mb: 3,
          borderRadius: 2,
        }}
      >

        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            mb: 2,
          }}
        >
          Report Information
        </Typography>

        <Grid
          container
          spacing={2}
        >

          {/*============================================
              Report Type
          ============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Report Type
            </Typography>

            <Typography
              variant="body1"
            >
              {reportType}
            </Typography>
          </Grid>

          {/*============================================
              Created By
          ============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <Person
                fontSize="small"
                color="action"
              />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Created By
                </Typography>

                <Typography
                  variant="body1"
                >
                  {createdBy}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/*============================================
              Created Date
          ============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <CalendarToday
                fontSize="small"
                color="action"
              />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Created Date
                </Typography>

                <Typography
                  variant="body1"
                >
                  {formatDate(
                    createdDate
                  )}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/*============================================
              Updated Date
          ============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <CalendarToday
                fontSize="small"
                color="action"
              />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Updated Date
                </Typography>

                <Typography
                  variant="body1"
                >
                  {formatDate(
                    updatedDate
                  )}
                </Typography>
              </Box>
            </Stack>
          </Grid>

        </Grid>

      </Paper>

      {/*================================================
          Description
      =================================================*/}

      <Paper
        variant="outlined"
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
          mb: 3,
          borderRadius: 2,
        }}
      >

        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            mb: 1,
          }}
        >
          Description
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {description}
        </Typography>

      </Paper>

      {/*================================================
          Close Button
      =================================================*/}

      <Stack
        direction="row"
        justifyContent="flex-end"
      >
        <button
          type="button"
          onClick={handleClose}
          className="dashboard-report-view-close"
        >
          Close
        </button>
      </Stack>

    </Paper>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

DashboardReportView.propTypes = {
  open: PropTypes.bool,

  report: PropTypes.object,

  onClose: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

DashboardReportView.defaultProps = {
  open: false,

  report: {},

  onClose: () => {},
};

//======================================================
// Export
//======================================================

export default DashboardReportView;
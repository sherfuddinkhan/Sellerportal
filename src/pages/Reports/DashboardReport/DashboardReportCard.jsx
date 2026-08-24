import React from "react";
import PropTypes from "prop-types";
import {Box,Card,CardContent,Chip,Divider,IconButton,Stack,Tooltip,Typography} from "@mui/material";
import {Delete,Visibility} from "@mui/icons-material";

//======================================================
// DashboardReportCard
//======================================================

const DashboardReportCard = ({
  report = {},
  onView,
  onDelete,
}) => {

  //====================================================
  // Safe Report ID
  //====================================================

  const reportId =
    report?.id ??
    report?.reportId ??
    report?.dashboardReportId ??
    "";

  //====================================================
  // Report Name
  //====================================================

  const reportName =
    report?.reportName ||
    report?.name ||
    report?.title ||
    "Dashboard Report";

  //====================================================
  // Report Type
  //====================================================

  const reportType =
    report?.reportType ||
    report?.type ||
    "Dashboard";

  //====================================================
  // Report Status
  //====================================================

  const reportStatus =
    report?.status ||
    report?.reportStatus ||
    "Active";

  //====================================================
  // Description
  //====================================================

  const description =
    report?.description ||
    report?.remarks ||
    report?.summary ||
    "No description available.";

  //====================================================
  // Created Date
  //====================================================

  const createdDate =
    report?.createdDate ||
    report?.createdAt ||
    report?.created_date ||
    "";

  //====================================================
  // Updated Date
  //====================================================

  const updatedDate =
    report?.updatedDate ||
    report?.updatedAt ||
    report?.updated_date ||
    "";

  //====================================================
  // Report Owner
  //====================================================

  const owner =
    report?.ownerName ||
    report?.createdByName ||
    report?.createdBy ||
    report?.owner ||
    "System";

  //====================================================
  // Statistics
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

  //====================================================
  // Status Color
  //====================================================

  const getStatusColor = () => {

    switch (
      String(reportStatus)
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
  // View Handler
  //====================================================

  const handleView = () => {

    if (
      typeof onView === "function"
    ) {
      onView(report);
    }

  };

  //====================================================
  // Delete Handler
  //====================================================

  const handleDelete = () => {

    if (
      typeof onDelete === "function"
    ) {
      onDelete(report);
    }

  };

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Card
      className="dashboard-report-card"
      elevation={2}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/*================================================
          Card Header
      =================================================*/}

      <CardContent
        sx={{
          pb: 1,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1}
        >

          {/*============================================
              Report Information
          ============================================*/}

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >

            <Typography
              variant="h6"
              fontWeight={600}
              noWrap
              title={reportName}
            >
              {reportName}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
              noWrap
              title={reportType}
            >
              {reportType}
            </Typography>

          </Box>

          {/*============================================
              Status
          ============================================*/}

          <Chip
            label={reportStatus}
            color={getStatusColor()}
            size="small"
            sx={{
              flexShrink: 0,
            }}
          />

        </Stack>
      </CardContent>

      <Divider />

      {/*================================================
          Description
      =================================================*/}

      <CardContent
        sx={{
          flexGrow: 1,
        }}
      >

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>

        {/*==============================================
            Statistics
        ==============================================*/}

        <Stack
          direction="row"
          spacing={2}
          sx={{
            mb: 2,
          }}
        >

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Records
            </Typography>

            <Typography
              variant="subtitle1"
              fontWeight={600}
            >
              {totalRecords.toLocaleString(
                "en-IN"
              )}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Amount
            </Typography>

            <Typography
              variant="subtitle1"
              fontWeight={600}
              noWrap
            >
              {formatCurrency(
                totalAmount
              )}
            </Typography>
          </Box>

        </Stack>

        {/*==============================================
            Owner
        ==============================================*/}

        <Box
          sx={{
            mb: 1,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Created By
          </Typography>

          <Typography
            variant="body2"
            noWrap
            title={owner}
          >
            {owner}
          </Typography>
        </Box>

        {/*==============================================
            Dates
        ==============================================*/}

        <Stack
          spacing={0.5}
        >

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Created:{" "}
            {formatDate(
              createdDate
            )}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Updated:{" "}
            {formatDate(
              updatedDate
            )}
          </Typography>

        </Stack>

      </CardContent>

      <Divider />

      {/*================================================
          Card Actions
      =================================================*/}

      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 0.5,
        }}
      >

        {/*==============================================
            View
        ==============================================*/}

        <Tooltip title="View Report">
          <IconButton
            color="primary"
            size="small"
            onClick={handleView}
            aria-label={
              `View ${reportName}`
            }
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>

        {/*==============================================
            Delete
        ==============================================*/}

        <Tooltip title="Delete Report">
          <IconButton
            color="error"
            size="small"
            onClick={handleDelete}
            aria-label={
              `Delete ${reportName}`
            }
            disabled={!reportId}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>

      </Box>

    </Card>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

DashboardReportCard.propTypes = {
  report: PropTypes.object,

  onView: PropTypes.func,

  onDelete: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

DashboardReportCard.defaultProps = {
  report: {},

  onView: () => {},

  onDelete: () => {},
};

//======================================================
// Export
//======================================================



//======================================================
// PropTypes
//======================================================

DashboardReportCard.propTypes = {
  report: PropTypes.object,

  onView: PropTypes.func,

  onDelete: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

DashboardReportCard.defaultProps = {
  report: {},

  onView: () => {},

  onDelete: () => {},
};

//======================================================
// Export
//======================================================

export default DashboardReportCard;
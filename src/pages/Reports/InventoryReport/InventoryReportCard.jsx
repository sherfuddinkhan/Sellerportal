import React, {useMemo} from "react";
import PropTypes from "prop-types";
import {Box,Chip,Divider,Grid,IconButton,Paper,Stack,Typography} from "@mui/material";
import {CheckCircle,Delete,Edit,Visibility,Block} from "@mui/icons-material";

//======================================================
// InventoryReportCard
//======================================================

const InventoryReportCard = ({
  report = null,
  selected = false,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
}) => {

  //====================================================
  // Report ID
  //====================================================

  const reportId = useMemo(
    () =>
      report?.id ??
      report?.reportId ??
      report?.inventoryReportId ??
      "",
    [report]
  );

  //====================================================
  // Report Name
  //====================================================

  const reportName =
    report?.reportName ||
    report?.name ||
    report?.title ||
    "Inventory Report";

  //====================================================
  // Report Type
  //====================================================

  const reportType =
    report?.reportType ||
    report?.type ||
    "Inventory";

  //====================================================
  // Status
  //====================================================

  const status =
    report?.status ||
    report?.reportStatus ||
    "Active";

  //====================================================
  // Description
  //====================================================

  const description =
    report?.description ||
    report?.summary ||
    report?.remarks ||
    "No description available.";

  //====================================================
  // Created By
  //====================================================

  const createdBy =
    report?.createdByName ||
    report?.createdBy ||
    report?.ownerName ||
    report?.owner ||
    "System";

  //====================================================
  // Created Date
  //====================================================

  const createdDate =
    report?.createdDate ||
    report?.createdAt ||
    "";

  //====================================================
  // Total Records
  //====================================================

  const totalRecords =
    Number(
      report?.totalRecords ??
      report?.recordCount ??
      report?.records ??
      0
    ) || 0;

  //====================================================
  // Total Stock
  //====================================================

  const totalStock =
    Number(
      report?.totalStock ??
      report?.stockQuantity ??
      report?.quantity ??
      0
    ) || 0;

  //====================================================
  // Total Value
  //====================================================

  const totalValue =
    Number(
      report?.totalValue ??
      report?.inventoryValue ??
      report?.stockValue ??
      0
    ) || 0;

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
  // Format Date
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

  const statusColor = useMemo(() => {

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

  }, [status]);

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
  // Edit Handler
  //====================================================

  const handleEdit = () => {

    if (
      typeof onEdit === "function"
    ) {
      onEdit(report);
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
  // Activate Handler
  //====================================================

  const handleActivate = () => {

    if (
      typeof onActivate === "function"
    ) {
      onActivate(report);
    }

  };

  //====================================================
  // Deactivate Handler
  //====================================================

  const handleDeactivate = () => {

    if (
      typeof onDeactivate === "function"
    ) {
      onDeactivate(report);
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
      className="inventory-report-card"
      variant="outlined"
      sx={{
        width: "100%",
        mb: 2,
        borderColor: selected
          ? "primary.main"
          : "divider",
        boxShadow: selected
          ? 3
          : 0,
        transition:
          "all 0.2s ease",
      }}
    >

      <CardContent>

        {/*================================================
            Header
        =================================================*/}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >

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
            >
              {reportName}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              ID: {reportId || "-"}
            </Typography>
          </Box>

          <Chip
            label={status}
            color={statusColor}
            size="small"
          />

        </Stack>

        <Divider sx={{ my: 2 }} />

        {/*================================================
            Report Information
        =================================================*/}

        <Stack spacing={1.5}>

          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Report Type
            </Typography>

            <Typography
              variant="body2"
              fontWeight={500}
            >
              {reportType}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Created By
            </Typography>

            <Typography
              variant="body2"
              fontWeight={500}
            >
              {createdBy}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Created Date
            </Typography>

            <Typography
              variant="body2"
              fontWeight={500}
            >
              {formatDate(createdDate)}
            </Typography>
          </Stack>

        </Stack>

        {/*================================================
            Description
        =================================================*/}

        <Box sx={{ mt: 2 }}>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 0.5,
            }}
          >
            Description
          </Typography>

          <Typography
            variant="body2"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </Typography>

        </Box>

        {/*================================================
            Statistics
        =================================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.5}
          sx={{
            mt: 2,
          }}
        >

          <Box
            sx={{
              flex: 1,
              p: 1.5,
              borderRadius: 1,
              bgcolor: "action.hover",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Records
            </Typography>

            <Typography
              variant="h6"
              fontWeight={600}
            >
              {formatNumber(
                totalRecords
              )}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              p: 1.5,
              borderRadius: 1,
              bgcolor: "action.hover",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Stock Quantity
            </Typography>

            <Typography
              variant="h6"
              fontWeight={600}
            >
              {formatNumber(
                totalStock
              )}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              p: 1.5,
              borderRadius: 1,
              bgcolor: "action.hover",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Stock Value
            </Typography>

            <Typography
              variant="h6"
              fontWeight={600}
            >
              {formatCurrency(
                totalValue
              )}
            </Typography>
          </Box>

        </Stack>

        {/*================================================
            Actions
        =================================================*/}

        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={0.5}
          sx={{
            mt: 2,
          }}
        >

          {/*==============================================
              View
          ==============================================*/}

          <Tooltip title="View report">
            <IconButton
              color="primary"
              onClick={handleView}
              disabled={loading}
              aria-label="view inventory report"
            >
              <Visibility />
            </IconButton>
          </Tooltip>

          {/*==============================================
              Edit
          ==============================================*/}

          <Tooltip title="Edit report">
            <IconButton
              color="primary"
              onClick={handleEdit}
              disabled={loading}
              aria-label="edit inventory report"
            >
              <Edit />
            </IconButton>
          </Tooltip>

          {/*==============================================
              Activate / Deactivate
          ==============================================*/}

          {String(status).toLowerCase() ===
          "active" ? (

            <Tooltip title="Deactivate report">
              <IconButton
                color="warning"
                onClick={
                  handleDeactivate
                }
                disabled={loading}
                aria-label="deactivate inventory report"
              >
                <Block />
              </IconButton>
            </Tooltip>

          ) : (

            <Tooltip title="Activate report">
              <IconButton
                color="success"
                onClick={
                  handleActivate
                }
                disabled={loading}
                aria-label="activate inventory report"
              >
                <CheckCircle />
              </IconButton>
            </Tooltip>

          )}

          {/*==============================================
              Delete
          ==============================================*/}

          <Tooltip title="Delete report">
            <IconButton
              color="error"
              onClick={handleDelete}
              disabled={loading}
              aria-label="delete inventory report"
            >
              <Delete />
            </IconButton>
          </Tooltip>

        </Stack>

      </CardContent>

    </Card>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

InventoryReportCard.propTypes = {
  report: PropTypes.object,

  selected: PropTypes.bool,

  loading: PropTypes.bool,

  onView: PropTypes.func,

  onEdit: PropTypes.func,

  onDelete: PropTypes.func,

  onActivate: PropTypes.func,

  onDeactivate: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

InventoryReportCard.defaultProps = {
  report: null,

  selected: false,

  loading: false,

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},

  onActivate: () => {},

  onDeactivate: () => {},
};

//======================================================
// Export
//======================================================

export default InventoryReportCard;
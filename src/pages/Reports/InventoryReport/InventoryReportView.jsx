import React, {useMemo} from "react";
import PropTypes from "prop-types";
import {Box,Chip,Divider,Grid,IconButton,Paper,Stack,Typography} from "@mui/material";
import {Close,Inventory2} from "@mui/icons-material";

//======================================================
// InventoryReportView
//======================================================
const InventoryReportView = ({open = false,report = null,onClose,loading = false,
}) => {
  //====================================================
  // Report ID
  //====================================================
  const reportId = useMemo(
    () =>
      report?.id ??
      report?.reportId ??
      report?.inventoryReportId ??
      "-",
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
    null;

  //====================================================
  // Updated Date
  //====================================================

  const updatedDate =
    report?.updatedDate ||
    report?.updatedAt ||
    null;

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

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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
  // No Report
  //====================================================

  if (!open || !report) {
    return null;
  }

  //====================================================
  // JSX
  //====================================================

  return (
    <Paper
      className="inventory-report-view"
      elevation={3}
      sx={{
        width: "100%",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        mt: 2,
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
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
      >

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <Inventory2
            color="primary"
            fontSize="large"
          />

          <Box>
            <Typography
              variant="h5"
              fontWeight={600}
            >
              {reportName}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Report ID: {reportId}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >

          <Chip
            label={status}
            color={statusColor}
            size="small"
          />

          <IconButton
            onClick={handleClose}
            disabled={loading}
            aria-label="close inventory report"
          >
            <Close />
          </IconButton>

        </Stack>

      </Stack>

      <Divider sx={{ my: 3 }} />

      {/*================================================
          Basic Information
      =================================================*/}

      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        Report Information
      </Typography>

      <Grid
        container
        spacing={2}
      >

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Report Type
          </Typography>

          <Typography
            variant="body1"
            fontWeight={500}
          >
            {reportType}
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Created By
          </Typography>

          <Typography
            variant="body1"
            fontWeight={500}
          >
            {createdBy}
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Created Date
          </Typography>

          <Typography
            variant="body1"
            fontWeight={500}
          >
            {formatDate(createdDate)}
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Updated Date
          </Typography>

          <Typography
            variant="body1"
            fontWeight={500}
          >
            {formatDate(updatedDate)}
          </Typography>
        </Grid>

      </Grid>

      {/*================================================
          Description
      =================================================*/}

      <Box sx={{ mt: 3 }}>

        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ mb: 1 }}
        >
          Description
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace: "pre-wrap",
          }}
        >
          {description}
        </Typography>

      </Box>

      <Divider sx={{ my: 3 }} />

      {/*================================================
          Inventory Statistics
      =================================================*/}

      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        Inventory Summary
      </Typography>

      <Grid
        container
        spacing={2}
      >

        {/*==============================================
            Total Records
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={4}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "action.hover",
              height: "100%",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Total Records
            </Typography>

            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ mt: 0.5 }}
            >
              {formatNumber(
                totalRecords
              )}
            </Typography>
          </Box>
        </Grid>

        {/*==============================================
            Stock Quantity
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={4}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "action.hover",
              height: "100%",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Total Stock Quantity
            </Typography>

            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ mt: 0.5 }}
            >
              {formatNumber(
                totalStock
              )}
            </Typography>
          </Box>
        </Grid>

        {/*==============================================
            Stock Value
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={4}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "action.hover",
              height: "100%",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Total Inventory Value
            </Typography>

            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ mt: 0.5 }}
            >
              {formatCurrency(
                totalValue
              )}
            </Typography>
          </Box>
        </Grid>

      </Grid>

      {/*================================================
          Additional Report Fields
      =================================================*/}

      <Divider sx={{ my: 3 }} />

      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        Additional Details
      </Typography>

      <Grid
        container
        spacing={2}
      >

        {Object.entries(report)
          .filter(
            ([key]) =>
              ![
                "id",
                "reportId",
                "inventoryReportId",
                "reportName",
                "name",
                "title",
                "reportType",
                "type",
                "status",
                "reportStatus",
                "description",
                "summary",
                "remarks",
                "createdByName",
                "createdBy",
                "ownerName",
                "owner",
                "createdDate",
                "createdAt",
                "updatedDate",
                "updatedAt",
                "totalRecords",
                "recordCount",
                "records",
                "totalStock",
                "stockQuantity",
                "quantity",
                "totalValue",
                "inventoryValue",
                "stockValue",
              ].includes(key)
          )
          .map(
            ([key, value]) => (

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={key}
              >

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    textTransform:
                      "capitalize",
                  }}
                >
                  {key
                    .replace(
                      /([A-Z])/g,
                      " $1"
                    )
                    .replace(
                      /^./,
                      (char) =>
                        char.toUpperCase()
                    )}
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    wordBreak:
                      "break-word",
                  }}
                >
                  {value === null ||
                  value === undefined ||
                  value === ""
                    ? "-"
                    : typeof value ===
                      "object"
                    ? JSON.stringify(
                        value
                      )
                    : String(value)}
                </Typography>

              </Grid>

            )
          )}

      </Grid>

      {/*================================================
          Footer
      =================================================*/}

      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{ mt: 3 }}
      >

        <IconButton
          onClick={handleClose}
          disabled={loading}
          aria-label="close inventory report"
        >
          <Close />
        </IconButton>

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

InventoryReportView.propTypes = {
  open: PropTypes.bool,

  report: PropTypes.object,

  onClose: PropTypes.func,

  loading: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

InventoryReportView.defaultProps = {
  open: false,

  report: null,

  onClose: () => {},

  loading: false,
};

//======================================================
// Export
//======================================================

export default InventoryReportView;
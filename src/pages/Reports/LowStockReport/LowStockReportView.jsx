import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  Inventory2,
  Warning,
  ErrorOutline,
} from "@mui/icons-material";

//======================================================
// LowStockReportView
//======================================================

const LowStockReportView = ({
  report = {},
  loading = false,
}) => {

  //====================================================
  // Normalize Report
  //====================================================

  const data = useMemo(
    () => ({
      id:
        report?.id ??
        report?.reportId ??
        report?.inventoryId ??
        "-",

      productName:
        report?.productName ??
        report?.itemName ??
        report?.name ??
        "Unknown Product",

      productCode:
        report?.productCode ??
        report?.itemCode ??
        report?.sku ??
        "-",

      category:
        report?.categoryName ??
        report?.category ??
        "-",

      currentStock: Number(
        report?.currentStock ??
        report?.stockQuantity ??
        report?.quantity ??
        0
      ),

      minimumStock: Number(
        report?.minimumStock ??
        report?.minStock ??
        report?.reorderLevel ??
        0
      ),

      reorderQuantity: Number(
        report?.reorderQuantity ??
        report?.reorderQty ??
        0
      ),

      unit:
        report?.unit ??
        report?.uom ??
        "Units",

      warehouse:
        report?.warehouseName ??
        report?.warehouse ??
        "-",

      location:
        report?.location ??
        report?.warehouseLocation ??
        "-",

      status:
        report?.status ??
        "Low",

      supplier:
        report?.supplierName ??
        report?.supplier ??
        "-",

      supplierCode:
        report?.supplierCode ??
        "-",

      lastUpdated:
        report?.lastUpdated ??
        report?.updatedAt ??
        report?.updatedDate ??
        "-",

      createdAt:
        report?.createdAt ??
        report?.createdDate ??
        "-",

      notes:
        report?.notes ??
        report?.remarks ??
        "-",
    }),
    [report]
  );

  //====================================================
  // Stock Severity
  //====================================================

  const severity = useMemo(() => {

    if (
      data.currentStock <= 0
    ) {
      return "critical";
    }

    if (
      data.currentStock <
      data.minimumStock
    ) {
      return "warning";
    }

    return "normal";

  }, [
    data.currentStock,
    data.minimumStock,
  ]);

  //====================================================
  // Stock Percentage
  //====================================================

  const stockPercentage =
    useMemo(() => {

      if (
        data.minimumStock <= 0
      ) {
        return data.currentStock > 0
          ? 100
          : 0;
      }

      return Math.min(
        100,
        Math.max(
          0,
          (
            data.currentStock /
            data.minimumStock
          ) * 100
        )
      );

    }, [
      data.currentStock,
      data.minimumStock,
    ]);

  //====================================================
  // Status Color
  //====================================================

  const statusColor =
    severity === "critical"
      ? "error"
      : severity === "warning"
      ? "warning"
      : "success";

  //====================================================
  // Status Label
  //====================================================

  const statusLabel =
    severity === "critical"
      ? "Out of Stock"
      : severity === "warning"
      ? "Low Stock"
      : "Stock OK";

  //====================================================
  // Status Icon
  //====================================================

  const StatusIcon =
    severity === "critical"
      ? ErrorOutline
      : severity === "warning"
      ? Warning
      : Inventory2;

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  if (loading) {
    return (
      <Box
        className="low-stock-report-loading"
        sx={{
          width: "100%",
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Loading low stock report...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      className="low-stock-report-view"
      sx={{
        width: "100%",
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
        sx={{
          mb: 2,
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <StatusIcon
            color={statusColor}
            fontSize="large"
          />

          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
            >
              {data.productName}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Product Code:{" "}
              {data.productCode}
            </Typography>
          </Box>
        </Stack>

        <Chip
          color={statusColor}
          icon={<StatusIcon />}
          label={
            data.status &&
            data.status !== "Low"
              ? data.status
              : statusLabel
          }
        />
      </Stack>

      <Divider
        sx={{
          mb: 3,
        }}
      />

      {/*================================================
          Stock Summary
      =================================================*/}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 3,
        }}
      >
        {/* Current Stock */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card
            variant="outlined"
            sx={{
              height: "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Current Stock
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
                color={
                  severity === "critical"
                    ? "error.main"
                    : severity === "warning"
                    ? "warning.main"
                    : "success.main"
                }
                sx={{
                  mt: 0.5,
                }}
              >
                {data.currentStock}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {data.unit}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Minimum Stock */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card
            variant="outlined"
            sx={{
              height: "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Minimum Stock
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mt: 0.5,
                }}
              >
                {data.minimumStock}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {data.unit}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Reorder Quantity */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card
            variant="outlined"
            sx={{
              height: "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Reorder Quantity
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mt: 0.5,
                }}
              >
                {data.reorderQuantity}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {data.unit}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Stock Level */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card
            variant="outlined"
            sx={{
              height: "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Stock Level
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mt: 0.5,
                }}
              >
                {Math.round(
                  stockPercentage
                )}
                %
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  height: 6,
                  mt: 1,
                  borderRadius: 3,
                  bgcolor:
                    "action.hover",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${stockPercentage}%`,
                    height: "100%",
                    bgcolor:
                      severity ===
                      "critical"
                        ? "error.main"
                        : severity ===
                          "warning"
                        ? "warning.main"
                        : "success.main",
                    borderRadius: 3,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/*================================================
          Product Information
      =================================================*/}

      <Card
        variant="outlined"
        sx={{
          mb: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              mb: 2,
            }}
          >
            Product Information
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
                Product Name
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
              >
                {data.productName}
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
                Product Code
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
              >
                {data.productCode}
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
                Category
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
              >
                {data.category}
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
                Unit
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
              >
                {data.unit}
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
                Report ID
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
              >
                {data.id}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/*================================================
          Warehouse Information
      =================================================*/}

      <Card
        variant="outlined"
        sx={{
          mb: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              mb: 2,
            }}
          >
            Warehouse Information
          </Typography>

          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Warehouse
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
              >
                {data.warehouse}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Location
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
              >
                {data.location}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/*================================================
          Supplier Information
      =================================================*/}

      <Card
        variant="outlined"
        sx={{
          mb: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              mb: 2,
            }}
          >
            Supplier Information
          </Typography>

          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Supplier
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
              >
                {data.supplier}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Supplier Code
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
              >
                {data.supplierCode}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/*================================================
          Additional Information
      =================================================*/}

      <Card
        variant="outlined"
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              mb: 2,
            }}
          >
            Additional Information
          </Typography>

          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Last Updated
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
              >
                {data.lastUpdated}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Created At
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
              >
                {data.createdAt}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Notes
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
              >
                {data.notes}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  //====================================================
  // Part 1B Ends Here
  //====================================================
  //======================================================
// PropTypes
//======================================================

LowStockReportView.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    reportId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    inventoryId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    productName: PropTypes.string,

    itemName: PropTypes.string,

    name: PropTypes.string,

    productCode: PropTypes.string,

    itemCode: PropTypes.string,

    sku: PropTypes.string,

    categoryName: PropTypes.string,

    category: PropTypes.string,

    currentStock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    stockQuantity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    quantity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    minimumStock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    minStock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    reorderLevel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    reorderQuantity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    reorderQty: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    unit: PropTypes.string,

    uom: PropTypes.string,

    warehouseName: PropTypes.string,

    warehouse: PropTypes.string,

    location: PropTypes.string,

    warehouseLocation: PropTypes.string,

    status: PropTypes.string,

    supplierName: PropTypes.string,

    supplier: PropTypes.string,

    supplierCode: PropTypes.string,

    lastUpdated: PropTypes.string,

    updatedAt: PropTypes.string,

    updatedDate: PropTypes.string,

    createdAt: PropTypes.string,

    createdDate: PropTypes.string,

    notes: PropTypes.string,

    remarks: PropTypes.string,
  }),

  loading: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

LowStockReportView.defaultProps = {
  report: {},

  loading: false,
};

//======================================================
// Export
//======================================================
}
export default LowStockReportView;

import React, {
  useCallback,
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  Storefront,
  ShoppingCart,
  Inventory2,
  CurrencyRupee,
  LocalShipping,
} from "@mui/icons-material";

//======================================================
// MarketplaceReportCard
//======================================================

const MarketplaceReportCard = ({
  report = {},
  onClick,
  compact = false,
}) => {

  //====================================================
  // Safe Report
  //====================================================

  const safeReport =
    report && typeof report === "object"
      ? report
      : {};

  //====================================================
  // Get Marketplace
  //====================================================

  const marketplace =
    safeReport.marketplaceName ??
    safeReport.marketplace ??
    safeReport.channelName ??
    safeReport.channel ??
    "Marketplace";

  //====================================================
  // Get Order Number
  //====================================================

  const orderNumber =
    safeReport.orderNumber ??
    safeReport.orderNo ??
    safeReport.orderId ??
    safeReport.id ??
    "—";

  //====================================================
  // Get Product Name
  //====================================================

  const productName =
    safeReport.productName ??
    safeReport.itemName ??
    safeReport.product ??
    safeReport.name ??
    "—";

  //====================================================
  // Get SKU
  //====================================================

  const sku =
    safeReport.sku ??
    safeReport.productCode ??
    safeReport.itemCode ??
    "—";

  //====================================================
  // Get Quantity
  //====================================================

  const quantity =
    Number(
      safeReport.quantity ??
      safeReport.qty ??
      safeReport.totalQuantity ??
      0
    ) || 0;

  //====================================================
  // Get Sales Amount
  //====================================================

  const salesAmount =
    Number(
      safeReport.totalAmount ??
      safeReport.salesAmount ??
      safeReport.orderAmount ??
      safeReport.amount ??
      safeReport.total ??
      0
    ) || 0;

  //====================================================
  // Get Status
  //====================================================

  const status =
    safeReport.status ??
    safeReport.orderStatus ??
    safeReport.paymentStatus ??
    "—";

  //====================================================
  // Get Shipment Status
  //====================================================

  const shipmentStatus =
    safeReport.shipmentStatus ??
    safeReport.shippingStatus ??
    safeReport.deliveryStatus ??
    "—";

  //====================================================
  // Format Currency
  //====================================================

  const formatCurrency =
    useCallback(
      (value) =>
        Number(value).toLocaleString(
          "en-IN",
          {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
          }
        ),
      []
    );

  //====================================================
  // Status Color
  //====================================================

  const statusColor =
    useMemo(() => {
      const normalized =
        String(status)
          .toLowerCase()
          .trim();

      if (
        [
          "cancelled",
          "canceled",
          "failed",
          "rejected",
        ].includes(normalized)
      ) {
        return "error";
      }

      if (
        [
          "pending",
          "processing",
          "packed",
        ].includes(normalized)
      ) {
        return "warning";
      }

      if (
        [
          "completed",
          "delivered",
          "confirmed",
          "paid",
        ].includes(normalized)
      ) {
        return "success";
      }

      return "default";
    }, [status]);

  //====================================================
  // Shipment Color
  //====================================================

  const shipmentColor =
    useMemo(() => {
      const normalized =
        String(shipmentStatus)
          .toLowerCase()
          .trim();

      if (
        [
          "cancelled",
          "failed",
          "returned",
        ].includes(normalized)
      ) {
        return "error";
      }

      if (
        [
          "pending",
          "processing",
          "packed",
          "shipped",
          "in transit",
        ].includes(normalized)
      ) {
        return "warning";
      }

      if (
        [
          "delivered",
          "completed",
        ].includes(normalized)
      ) {
        return "success";
      }

      return "default";
    }, [shipmentStatus]);

  //====================================================
  // Handle Click
  //====================================================

  const handleClick =
    useCallback(() => {
      if (
        typeof onClick === "function"
      ) {
        onClick(safeReport);
      }
    }, [
      onClick,
      safeReport,
    ]);

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Card
      className="marketplace-report-card"
      variant="outlined"
      elevation={0}
      onClick={handleClick}
      sx={{
        height: "100%",
        borderRadius: 2,
        cursor:
          typeof onClick === "function"
            ? "pointer"
            : "default",
        transition:
          "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover":
          typeof onClick === "function"
            ? {
                boxShadow: 3,
                transform:
                  "translateY(-2px)",
              }
            : {},
      }}
    >
      <CardContent
        sx={{
          p: compact ? 1.5 : 2,
          "&:last-child": {
            pb: compact ? 1.5 : 2,
          },
        }}
      >
        <Stack spacing={1.5}>

          {/*================================================
              Header
          =================================================*/}

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              minWidth={0}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor:
                    "action.hover",
                  flexShrink: 0,
                }}
              >
                <Storefront
                  fontSize="small"
                  color="primary"
                />
              </Box>

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  noWrap
                >
                  {marketplace}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                >
                  Order: {orderNumber}
                </Typography>
              </Box>
            </Stack>

            <Chip
              label={status}
              size="small"
              color={statusColor}
              variant={
                statusColor === "default"
                  ? "outlined"
                  : "filled"
              }
            />
          </Stack>

          <Divider />

          {/*================================================
              Product
          =================================================*/}

          <Box>
            <Typography
              variant="body2"
              fontWeight={600}
              noWrap={!compact}
            >
              {productName}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              SKU: {sku}
            </Typography>
          </Box>

          {/*================================================
              Details
          =================================================*/}

          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            useFlexGap
          >
            {/*==============================================
                Quantity
            ==============================================*/}

            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
            >
              <Inventory2
                fontSize="small"
                color="action"
              />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Quantity
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {quantity.toLocaleString(
                    "en-IN"
                  )}
                </Typography>
              </Box>
            </Stack>

            {/*==============================================
                Sales Amount
            ==============================================*/}

            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
            >
              <CurrencyRupee
                fontSize="small"
                color="action"
              />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Sales
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={700}
                >
                  {formatCurrency(
                    salesAmount
                  )}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          {/*================================================
              Shipment
          =================================================*/}

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
            >
              <LocalShipping
                fontSize="small"
                color="action"
              />

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Shipment
              </Typography>
            </Stack>

            <Chip
              label={
                shipmentStatus
              }
              size="small"
              color={
                shipmentColor
              }
              variant={
                shipmentColor ===
                "default"
                  ? "outlined"
                  : "filled"
              }
            />
          </Stack>

          {/*================================================
              Footer
          =================================================*/}

          {!compact && (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                pt: 0.5,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Marketplace Report
              </Typography>

              <ShoppingCart
                fontSize="small"
                color="disabled"
              />
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

MarketplaceReportCard.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    orderId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    orderNumber: PropTypes.string,

    orderNo: PropTypes.string,

    marketplaceName:
      PropTypes.string,

    marketplace:
      PropTypes.string,

    channelName:
      PropTypes.string,

    channel:
      PropTypes.string,

    productName:
      PropTypes.string,

    itemName:
      PropTypes.string,

    product:
      PropTypes.string,

    name:
      PropTypes.string,

    sku:
      PropTypes.string,

    productCode:
      PropTypes.string,

    itemCode:
      PropTypes.string,

    quantity:
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),

    qty:
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),

    totalQuantity:
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),

    totalAmount:
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),

    salesAmount:
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),

    orderAmount:
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),

    amount:
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),

    total:
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),

    status:
      PropTypes.string,

    orderStatus:
      PropTypes.string,

    paymentStatus:
      PropTypes.string,

    shipmentStatus:
      PropTypes.string,

    shippingStatus:
      PropTypes.string,

    deliveryStatus:
      PropTypes.string,
  }),

  onClick: PropTypes.func,

  compact: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

MarketplaceReportCard.defaultProps = {
  report: {},

  onClick: () => {},

  compact: false,
};

//======================================================
// Export
//======================================================
}
export default MarketplaceReportCard;
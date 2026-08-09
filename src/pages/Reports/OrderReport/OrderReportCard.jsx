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
  Stack,
  Typography,
} from "@mui/material";

import {
  Assignment,
  CalendarToday,
  CurrencyRupee,
  Person,
  ShoppingCart,
  Store,
} from "@mui/icons-material";

import {
  formatCurrency,
  formatDate,
  getChannelName,
  getCustomerName,
  getOrderDate,
  getOrderNumber,
  getOrderStatus,
  getPaymentStatus,
  getQuantity,
  getSalesAmount,
  getStatusColor,
} from "./OrderReportHelpers";

//======================================================
// OrderReportCard
//======================================================

const OrderReportCard = ({
  order,
  onClick,
  onView,
  loading = false,
}) => {
  //====================================================
  // Safe Order
  //====================================================

  const safeOrder =
    order || {};

  //====================================================
  // Order Information
  //====================================================

  const orderNumber =
    getOrderNumber(
      safeOrder
    );

  const customerName =
    getCustomerName(
      safeOrder
    );

  const channel =
    getChannelName(
      safeOrder
    );

  const orderDate =
    getOrderDate(
      safeOrder
    );

  const orderStatus =
    getOrderStatus(
      safeOrder
    );

  const paymentStatus =
    getPaymentStatus(
      safeOrder
    );

  const quantity =
    getQuantity(
      safeOrder
    );

  const salesAmount =
    getSalesAmount(
      safeOrder
    );

  //====================================================
  // Status Colors
  //====================================================

  const orderStatusColor =
    useMemo(
      () =>
        getStatusColor(
          orderStatus
        ),
      [orderStatus]
    );

  const paymentStatusColor =
    useMemo(
      () =>
        getStatusColor(
          paymentStatus
        ),
      [paymentStatus]
    );

  //====================================================
  // Card Click
  //====================================================

  const handleClick =
    () => {
      if (
        typeof onClick ===
        "function"
      ) {
        onClick(
          safeOrder
        );
      }
    };

  //====================================================
  // View Click
  //====================================================

  const handleView =
    (event) => {
      event.stopPropagation();

      if (
        typeof onView ===
        "function"
      ) {
        onView(
          safeOrder
        );
      }
    };

  //====================================================
  // Part 1A Ends Here
  //====================================================
  //======================================================
// Render
//======================================================

return (
  <Card
    variant="outlined"
    onClick={handleClick}
    sx={{
      width: "100%",
      borderRadius: 2,
      cursor: onClick
        ? "pointer"
        : "default",
      transition:
        "box-shadow 0.2s ease, transform 0.2s ease",
      "&:hover": onClick
        ? {
            boxShadow: 3,
            transform:
              "translateY(-1px)",
          }
        : {},
    }}
  >
    <CardContent>
      <Stack spacing={2}>

        {/*================================================
            Header
        =================================================*/}

        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent:
              "space-between",
            gap: 1,
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <Assignment
                fontSize="small"
                color="primary"
              />

              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                {orderNumber ||
                  "Order"}
              </Typography>
            </Stack>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Order Report
            </Typography>
          </Box>

          <Chip
            size="small"
            label={
              orderStatus ||
              "Unknown"
            }
            color={
              orderStatusColor
            }
            variant="outlined"
          />
        </Box>

        <Divider />

        {/*================================================
            Order Details
        =================================================*/}

        <Stack spacing={1.5}>

          {/* Customer */}

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1,
            }}
          >
            <Person
              fontSize="small"
              color="action"
            />

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Customer
              </Typography>

              <Typography
                variant="body2"
                fontWeight={600}
              >
                {customerName ||
                  "N/A"}
              </Typography>
            </Box>
          </Box>

          {/* Channel */}

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1,
            }}
          >
            <Store
              fontSize="small"
              color="action"
            />

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Channel
              </Typography>

              <Typography
                variant="body2"
                fontWeight={600}
              >
                {channel ||
                  "N/A"}
              </Typography>
            </Box>
          </Box>

          {/* Order Date */}

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1,
            }}
          >
            <CalendarToday
              fontSize="small"
              color="action"
            />

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Order Date
              </Typography>

              <Typography
                variant="body2"
              >
                {formatDate(
                  orderDate
                )}
              </Typography>
            </Box>
          </Box>

          {/* Quantity */}

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1,
            }}
          >
            <ShoppingCart
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
                {Number(
                  quantity || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </Typography>
            </Box>
          </Box>

        </Stack>

        <Divider />

        {/*================================================
            Amount and Payment
        =================================================*/}

        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent:
              "space-between",
            gap: 2,
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1,
            }}
          >
            <CurrencyRupee
              fontSize="small"
              color="success"
            />

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Sales Amount
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {formatCurrency(
                  salesAmount
                )}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Payment
            </Typography>

            <Chip
              size="small"
              label={
                paymentStatus ||
                "Unknown"
              }
              color={
                paymentStatusColor
              }
              variant="outlined"
            />
          </Box>
        </Box>

        {/*================================================
            View Action
        =================================================*/}

        {typeof onView ===
          "function" && (
          <Box
            sx={{
              display: "flex",
              justifyContent:
                "flex-end",
            }}
          >
            <Typography
              component="button"
              type="button"
              onClick={
                handleView
              }
              disabled={loading}
              sx={{
                border: 0,
                background:
                  "transparent",
                color:
                  "primary.main",
                cursor:
                  loading
                    ? "default"
                    : "pointer",
                fontWeight: 600,
                fontSize:
                  "0.875rem",
                padding: 0,
                "&:hover": {
                  textDecoration:
                    "underline",
                },
              }}
            >
              View Details
            </Typography>
          </Box>
        )}

      </Stack>
    </CardContent>
  </Card>
);

//======================================================
// PropTypes
//======================================================

OrderReportCard.propTypes = {
  order:
    PropTypes.object,

  onClick:
    PropTypes.func,

  onView:
    PropTypes.func,

  loading:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

OrderReportCard.defaultProps = {
  order: null,

  onClick: null,

  onView: null,

  loading: false,
};

//======================================================
// Export
//======================================================
}
export default OrderReportCard;


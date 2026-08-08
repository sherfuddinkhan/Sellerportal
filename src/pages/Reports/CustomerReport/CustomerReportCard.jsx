import React, { useMemo } from "react";
import PropTypes from "prop-types";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  ShoppingCart,
  CurrencyRupee,
  CalendarToday,
  Email,
  Phone,
  Store,
} from "@mui/icons-material";

//======================================================
// CustomerReportCard
//======================================================

const CustomerReportCard = ({
  customer = null,

  onView,
  onEdit,
  onDelete,
}) => {

  //====================================================
  // No Customer
  //====================================================

  if (!customer) {
    return null;
  }

  //====================================================
  // Customer Values
  //====================================================

  const {
    customerId,
    customerName,
    name,
    email,
    phone,
    mobile,
    customerType,
    marketplace,
    status,
    totalOrders,
    orderCount,
    totalSales,
    totalAmount,
    totalPaid,
    paidAmount,
    totalOutstanding,
    outstandingAmount,
    balance,
    lastOrderDate,
    createdDate,
    createdAt,
    avatar,
    profileImage,
  } = customer;

  //====================================================
  // Normalized Values
  //====================================================

  const displayName =
    customerName ||
    name ||
    "Unknown Customer";

  const displayPhone =
    phone ||
    mobile ||
    "-";

  const displayCustomerType =
    customerType ||
    "Individual";

  const displayMarketplace =
    marketplace ||
    "-";

  const displayStatus =
    status ||
    "Active";

  const orders = Number(
    totalOrders ??
    orderCount ??
    0
  );

  const sales = Number(
    totalSales ??
    totalAmount ??
    0
  );

  const paid = Number(
    totalPaid ??
    paidAmount ??
    0
  );

  const outstanding = Number(
    totalOutstanding ??
    outstandingAmount ??
    balance ??
    0
  );

  const image =
    avatar ||
    profileImage ||
    "";

  //====================================================
  // Currency Formatter
  //====================================================

  const formatCurrency = useMemo(
    () => (value) =>
      new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        }
      ).format(Number(value) || 0),
    []
  );

  //====================================================
  // Number Formatter
  //====================================================

  const formatNumber = useMemo(
    () => (value) =>
      new Intl.NumberFormat(
        "en-IN"
      ).format(Number(value) || 0),
    []
  );

  //====================================================
  // Date Formatter
  //====================================================

  const formatDate = useMemo(
    () => (value) => {

      if (!value) {
        return "-";
      }

      const date = new Date(value);

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
    },
    []
  );

  //====================================================
  // Status Color
  //====================================================

  const statusColor =
    String(displayStatus)
      .toLowerCase() === "active"
      ? "success"
      : "warning";

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // Card JSX
  //====================================================

  return (
    <Card
      className="customer-report-card"
      variant="outlined"
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 2,
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >

      <CardContent>

        {/*================================================
            Customer Header
        =================================================*/}

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
              minWidth: 0,
            }}
          >

            <Avatar
              src={image}
              alt={displayName}
              sx={{
                width: 48,
                height: 48,
              }}
            >
              {!image &&
                displayName
                  .charAt(0)
                  .toUpperCase()}
            </Avatar>

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
                {displayName}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
              >
                ID: {customerId || "-"}
              </Typography>

            </Box>

          </Stack>

          <Chip
            size="small"
            label={displayStatus}
            color={statusColor}
            variant="outlined"
          />

        </Stack>

        <Divider sx={{ my: 2 }} />

        {/*================================================
            Customer Contact Information
        =================================================*/}

        <Stack
          spacing={1}
        >

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >

            <Email
              fontSize="small"
              color="action"
            />

            <Typography
              variant="body2"
              noWrap
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {email || "-"}
            </Typography>

          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >

            <Phone
              fontSize="small"
              color="action"
            />

            <Typography
              variant="body2"
            >
              {displayPhone}
            </Typography>

          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >

            <Store
              fontSize="small"
              color="action"
            />

            <Typography
              variant="body2"
            >
              {displayMarketplace}
            </Typography>

            <Chip
              size="small"
              label={displayCustomerType}
              variant="outlined"
            />

          </Stack>

        </Stack>

        <Divider sx={{ my: 2 }} />

        {/*================================================
            Customer Statistics
        =================================================*/}

        <Stack
          direction="row"
          spacing={1}
          justifyContent="space-between"
        >

          <Box
            sx={{
              flex: 1,
              textAlign: "center",
            }}
          >

            <ShoppingCart
              fontSize="small"
              color="action"
            />

            <Typography
              variant="body2"
              fontWeight={700}
            >
              {formatNumber(orders)}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Orders
            </Typography>

          </Box>

          <Box
            sx={{
              flex: 1,
              textAlign: "center",
            }}
          >

            <CurrencyRupee
              fontSize="small"
              color="success"
            />

            <Typography
              variant="body2"
              fontWeight={700}
              color="success.main"
            >
              {formatCurrency(sales)}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Sales
            </Typography>

          </Box>

          <Box
            sx={{
              flex: 1,
              textAlign: "center",
            }}
          >

            <CurrencyRupee
              fontSize="small"
              color={
                outstanding > 0
                  ? "error"
                  : "success"
              }
            />

            <Typography
              variant="body2"
              fontWeight={700}
              color={
                outstanding > 0
                  ? "error.main"
                  : "success.main"
              }
            >
              {formatCurrency(outstanding)}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Outstanding
            </Typography>

          </Box>

        </Stack>

        <Divider sx={{ my: 2 }} />

        {/*================================================
            Payment Information
        =================================================*/}

        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
        >

          <Box>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Paid
            </Typography>

            <Typography
              variant="body2"
              fontWeight={600}
              color="success.main"
            >
              {formatCurrency(paid)}
            </Typography>

          </Box>

          <Box
            sx={{
              textAlign: "right",
            }}
          >

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Last Order
            </Typography>

            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              justifyContent="flex-end"
            >

              <CalendarToday
                sx={{
                  fontSize: 14,
                }}
                color="action"
              />

              <Typography
                variant="body2"
                fontWeight={600}
              >
                {formatDate(lastOrderDate)}
              </Typography>

            </Stack>

          </Box>

        </Stack>

        <Divider sx={{ my: 2 }} />

        {/*================================================
            Actions
        =================================================*/}

        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
        >

          <Box
            component="button"
            type="button"
            onClick={() => {
              if (onView) {
                onView(customer);
              }
            }}
            sx={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
              color: "primary.main",
              fontWeight: 600,
              px: 1,
              py: 0.5,
            }}
          >
            View
          </Box>

          <Box
            component="button"
            type="button"
            onClick={() => {
              if (onEdit) {
                onEdit(customer);
              }
            }}
            sx={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
              color: "info.main",
              fontWeight: 600,
              px: 1,
              py: 0.5,
            }}
          >
            Edit
          </Box>

          <Box
            component="button"
            type="button"
            onClick={() => {
              if (onDelete) {
                onDelete(customer);
              }
            }}
            sx={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
              color: "error.main",
              fontWeight: 600,
              px: 1,
              py: 0.5,
            }}
          >
            Delete
          </Box>

        </Stack>

      </CardContent>

    </Card>
  );
};
//======================================================
// PropTypes
//======================================================

CustomerReportCard.propTypes = {
  customer: PropTypes.shape({
    customerId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    customerName: PropTypes.string,

    name: PropTypes.string,

    email: PropTypes.string,

    phone: PropTypes.string,

    mobile: PropTypes.string,

    customerType: PropTypes.string,

    marketplace: PropTypes.string,

    status: PropTypes.string,

    totalOrders: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    orderCount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    totalSales: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    totalAmount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    totalPaid: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    paidAmount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    totalOutstanding: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    outstandingAmount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    balance: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    lastOrderDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),

    createdDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),

    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),

    avatar: PropTypes.string,

    profileImage: PropTypes.string,
  }),

  onView: PropTypes.func,

  onEdit: PropTypes.func,

  onDelete: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

CustomerReportCard.defaultProps = {
  customer: null,

  onView: () => {},

  onEdit: () => {},

  onDelete: () => {},
};

//======================================================
// Export
//======================================================

export default CustomerReportCard;
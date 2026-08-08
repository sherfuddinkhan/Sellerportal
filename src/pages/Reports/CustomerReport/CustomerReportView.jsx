import React, { useMemo } from "react";
import PropTypes from "prop-types";

import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  Person,
  Email,
  Phone,
  LocationOn,
  Store,
  ShoppingCart,
  CurrencyRupee,
  CalendarToday,
  Business,
  ReceiptLong,
} from "@mui/icons-material";

//======================================================
// CustomerReportView
//======================================================

const CustomerReportView = ({
  customer = null,
  onClose,
}) => {

  //====================================================
  // No Customer
  //====================================================

  if (!customer) {
    return null;
  }

  //====================================================
  // Customer Information
  //====================================================

  const {
    customerId,
    customerName,
    name,

    email,
    customerEmail,

    phone,
    mobile,
    mobileNumber,

    customerType,

    marketplace,

    status,

    gstin,
    pan,

    address,
    address1,
    address2,

    city,
    state,
    stateCode,
    pincode,
    postalCode,

    country,

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
    lastOrder,

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

  const displayEmail =
    email ||
    customerEmail ||
    "-";

  const displayPhone =
    phone ||
    mobile ||
    mobileNumber ||
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

  const displayAddress =
    address ||
    address1 ||
    "-";

  const displayCity =
    city ||
    "-";

  const displayState =
    state ||
    "-";

  const displayPincode =
    pincode ||
    postalCode ||
    "-";

  const displayCountry =
    country ||
    "India";

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
  // JSX
  //====================================================

  return (
    <Box
      className="customer-report-view"
      sx={{
        width: "100%",
      }}
    >

      {/*================================================
          Customer Header
      =================================================*/}

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 2,
        }}
      >

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          justifyContent="space-between"
        >

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >

            <Avatar
              src={image}
              alt={displayName}
              sx={{
                width: 72,
                height: 72,
                fontSize: "1.5rem",
              }}
            >
              {!image &&
                displayName
                  .charAt(0)
                  .toUpperCase()}
            </Avatar>

            <Box>

              <Typography
                variant="h5"
                fontWeight={700}
              >
                {displayName}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Customer ID:{" "}
                {customerId || "-"}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 1 }}
                flexWrap="wrap"
              >

                <Chip
                  size="small"
                  label={displayStatus}
                  color={statusColor}
                  variant="outlined"
                />

                <Chip
                  size="small"
                  label={displayCustomerType}
                  variant="outlined"
                />

                <Chip
                  size="small"
                  icon={<Store />}
                  label={displayMarketplace}
                  variant="outlined"
                />

              </Stack>

            </Box>

          </Stack>

        </Stack>

      </Paper>

      {/*================================================
          Contact + Business Information
      =================================================*/}

      <Grid
        container
        spacing={2}
      >

        {/*================================================
            Contact Information
        =================================================*/}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              height: "100%",
              borderRadius: 2,
            }}
          >

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >

              <Person color="primary" />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Contact Information
              </Typography>

            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>

              {/* Email */}

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
              >

                <Email
                  color="action"
                  fontSize="small"
                />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Email
                  </Typography>

                  <Typography variant="body2">
                    {displayEmail}
                  </Typography>
                </Box>

              </Stack>

              {/* Phone */}

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
              >

                <Phone
                  color="action"
                  fontSize="small"
                />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Phone
                  </Typography>

                  <Typography variant="body2">
                    {displayPhone}
                  </Typography>
                </Box>

              </Stack>

              {/* Address */}

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="flex-start"
              >

                <LocationOn
                  color="action"
                  fontSize="small"
                />

                <Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Address
                  </Typography>

                  <Typography variant="body2">
                    {displayAddress}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {displayCity}
                    {displayState !== "-" &&
                      `, ${displayState}`}
                    {displayPincode !== "-" &&
                      ` - ${displayPincode}`}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {displayCountry}
                  </Typography>

                </Box>

              </Stack>

            </Stack>

          </Paper>

        </Grid>

        {/*================================================
            Business Information
        =================================================*/}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              height: "100%",
              borderRadius: 2,
            }}
          >

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >

              <Business color="primary" />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Business Information
              </Typography>

            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>

              {/* GSTIN */}

              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  GSTIN
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {gstin || "-"}
                </Typography>

              </Stack>

              {/* PAN */}

              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  PAN
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {pan || "-"}
                </Typography>

              </Stack>

              {/* State Code */}

              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  State Code
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {stateCode || "-"}
                </Typography>

              </Stack>

              {/* Marketplace */}

              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Marketplace
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {displayMarketplace}
                </Typography>

              </Stack>

            </Stack>

          </Paper>

        </Grid>

        {/*================================================
            Financial Summary
        =================================================*/}

        <Grid
          item
          xs={12}
        >

          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2,
            }}
          >

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >

              <CurrencyRupee color="primary" />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Financial Summary
              </Typography>

            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Grid
              container
              spacing={2}
            >

              {/* Total Orders */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor:
                      "action.hover",
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >

                    <ShoppingCart
                      color="primary"
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
                        fontWeight={700}
                      >
                        {formatNumber(orders)}
                      </Typography>

                    </Box>

                  </Stack>

                </Box>

              </Grid>

              {/* Total Sales */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor:
                      "action.hover",
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >

                    <CurrencyRupee
                      color="success"
                    />

                    <Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Total Sales
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="success.main"
                      >
                        {formatCurrency(sales)}
                      </Typography>

                    </Box>

                  </Stack>

                </Box>

              </Grid>

              {/* Total Paid */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor:
                      "action.hover",
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >

                    <ReceiptLong
                      color="primary"
                    />

                    <Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Total Paid
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="success.main"
                      >
                        {formatCurrency(paid)}
                      </Typography>

                    </Box>

                  </Stack>

                </Box>

              </Grid>

              {/* Outstanding */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor:
                      "action.hover",
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >

                    <CurrencyRupee
                      color={
                        outstanding > 0
                          ? "error"
                          : "success"
                      }
                    />

                    <Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Outstanding
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color={
                          outstanding > 0
                            ? "error.main"
                            : "success.main"
                        }
                      >
                        {formatCurrency(
                          outstanding
                        )}
                      </Typography>

                    </Box>

                  </Stack>

                </Box>

              </Grid>

            </Grid>

          </Paper>

        </Grid>

        {/*================================================
            Dates
        =================================================*/}

        <Grid
          item
          xs={12}
        >

          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2,
            }}
          >

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >

              <CalendarToday
                color="primary"
              />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Customer Activity
              </Typography>

            </Stack>

            <Divider sx={{ mb: 2 }} />

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
                  Last Order Date
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={600}
                >
                  {formatDate(
                    lastOrderDate ||
                    lastOrder
                  )}
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
                  Customer Since
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={600}
                >
                  {formatDate(
                    createdDate ||
                    createdAt
                  )}
                </Typography>

              </Grid>

            </Grid>

          </Paper>

        </Grid>

      </Grid>

    </Box>
  );
};
//======================================================
// PropTypes
//======================================================

CustomerReportView.propTypes = {
  customer: PropTypes.shape({
    customerId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    customerName: PropTypes.string,

    name: PropTypes.string,

    email: PropTypes.string,

    customerEmail: PropTypes.string,

    phone: PropTypes.string,

    mobile: PropTypes.string,

    mobileNumber: PropTypes.string,

    customerType: PropTypes.string,

    marketplace: PropTypes.string,

    status: PropTypes.string,

    gstin: PropTypes.string,

    pan: PropTypes.string,

    address: PropTypes.string,

    address1: PropTypes.string,

    address2: PropTypes.string,

    city: PropTypes.string,

    state: PropTypes.string,

    stateCode: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    pincode: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    postalCode: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    country: PropTypes.string,

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

    lastOrder: PropTypes.oneOfType([
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

  onClose: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

CustomerReportView.defaultProps = {
  customer: null,

  onClose: () => {},
};

//======================================================
// Export
//======================================================

export default CustomerReportView;
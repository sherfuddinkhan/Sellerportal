//======================================================
// SuppliesReportCard.jsx
// Part 1A
//======================================================

import React from "react";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

//======================================================
// Helpers
//======================================================

const getValue = (
  report,
  ...fields
) => {
  for (const field of fields) {
    if (
      report?.[field] !==
        undefined &&
      report?.[field] !==
        null &&
      report?.[field] !== ""
    ) {
      return report[field];
    }
  }

  return "";
};

//======================================================
// Format Number
//======================================================

const formatNumber = (
  value
) => {
  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    )
  ) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  ).format(number);
};

//======================================================
// Format Currency
//======================================================

const formatCurrency = (
  value
) => {
  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    )
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
  ).format(number);
};

//======================================================
// Format Date
//======================================================

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
      month: "2-digit",
      year: "numeric",
    }
  );
};

//======================================================
// Status Color
//======================================================

const getStatusColor = (
  status
) => {
  const value =
    String(
      status || ""
    ).toLowerCase();

  if (
    value === "active" ||
    value === "approved" ||
    value === "completed" ||
    value === "success"
  ) {
    return "success";
  }

  if (
    value === "pending" ||
    value === "draft"
  ) {
    return "warning";
  }

  if (
    value === "cancelled" ||
    value === "rejected" ||
    value === "failed" ||
    value === "inactive"
  ) {
    return "error";
  }

  return "default";
};

//======================================================
// SuppliesReportCard
//======================================================

const SuppliesReportCard = ({
  report = {},
  onView,
  onEdit,
  loading = false,
}) => {
  //====================================================
  // Report Values
  //====================================================

  const date =
    getValue(
      report,
      "date",
      "supplyDate",
      "transactionDate",
      "voucherDate"
    );

  const supplier =
    getValue(
      report,
      "supplier",
      "supplierName",
      "partyName",
      "vendorName"
    );

  const stockItem =
    getValue(
      report,
      "stockItem",
      "itemName",
      "stockItemName",
      "item"
    );

  const category =
    getValue(
      report,
      "category",
      "categoryName",
      "itemCategory"
    );

  const voucherNumber =
    getValue(
      report,
      "voucherNumber",
      "voucherNo",
      "documentNumber",
      "docNo"
    );

  const voucherType =
    getValue(
      report,
      "voucherType",
      "documentType",
      "docType"
    );

  const warehouse =
    getValue(
      report,
      "warehouse",
      "warehouseName",
      "godown",
      "location"
    );

  const quantity =
    getValue(
      report,
      "quantity",
      "qty",
      "supplyQuantity"
    );

  const rate =
    getValue(
      report,
      "rate",
      "unitRate",
      "price"
    );

  const amount =
    getValue(
      report,
      "amount",
      "totalAmount",
      "value",
      "totalValue"
    );

  const status =
    getValue(
      report,
      "status",
      "state"
    );

  const remarks =
    getValue(
      report,
      "remarks",
      "notes",
      "comment"
    );

  //====================================================
  // Handlers
  //====================================================

  const handleView =
    () => {
      if (
        typeof onView ===
        "function"
      ) {
        onView(report);
      }
    };

  const handleEdit =
    () => {
      if (
        typeof onEdit ===
        "function"
      ) {
        onEdit(report);
      }
    };

  //====================================================
  // Render
  //====================================================

  return (
    <Card
      className="supplies-report__card"
      variant="outlined"
    >
      <CardContent>
        <Stack spacing={2}>

          {/*============================================
              Header
          =============================================*/}

          <Box
            className="supplies-report__card-header"
          >
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                {supplier ||
                  "Unknown Supplier"}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {stockItem ||
                  "No stock item"}
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={0.5}
            >
              <Tooltip
                title="View"
              >
                <IconButton
                  size="small"
                  onClick={
                    handleView
                  }
                  disabled={
                    loading
                  }
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip
                title="Edit"
              >
                <IconButton
                  size="small"
                  onClick={
                    handleEdit
                  }
                  disabled={
                    loading
                  }
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          <Divider />

          {/*============================================
              Basic Information
          =============================================*/}

          <Box>
            <Stack
              spacing={1}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                gap={2}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Supply Date
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {formatDate(
                    date
                  )}
                </Typography>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                gap={2}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Category
                </Typography>

                <Typography
                  variant="body2"
                >
                  {category ||
                    "-"}
                </Typography>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                gap={2}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Warehouse
                </Typography>

                <Typography
                  variant="body2"
                >
                  {warehouse ||
                    "-"}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/*============================================
              Voucher Information
          =============================================*/}

          <Box>
            <Stack
              spacing={1}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                gap={2}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Voucher Number
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {voucherNumber ||
                    "-"}
                </Typography>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                gap={2}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Voucher Type
                </Typography>

                <Typography
                  variant="body2"
                >
                  {voucherType ||
                    "-"}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/*============================================
              Quantity / Rate / Amount
          =============================================*/}

          <Box>
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Quantity
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={700}
                >
                  {formatNumber(
                    quantity
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Rate
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={700}
                >
                  {formatCurrency(
                    rate
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Amount
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={700}
                >
                  {formatCurrency(
                    amount
                  )}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/*============================================
              Footer
          =============================================*/}

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
          >
            <Chip
              size="small"
              label={
                status ||
                "Unknown"
              }
              color={
                getStatusColor(
                  status
                )
              }
            />

            {remarks ? (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  maxWidth:
                    "65%",
                  overflow:
                    "hidden",
                  textOverflow:
                    "ellipsis",
                  whiteSpace:
                    "nowrap",
                }}
              >
                {remarks}
              </Typography>
            ) : null}
          </Box>

        </Stack>
      </CardContent>
    </Card>
  );
};

//======================================================
// Export
//======================================================

export default SuppliesReportCard;

//======================================================
// Part 1A Ends Here
//======================================================
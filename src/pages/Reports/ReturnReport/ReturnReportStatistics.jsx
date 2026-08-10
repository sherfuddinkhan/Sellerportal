import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  AssignmentReturn,
  CurrencyRupee,
  Inventory2,
  Replay,
} from "@mui/icons-material";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import {
  formatCurrency,
  formatNumber,
  toNumber,
} from "./ReturnReportHelpers";

//======================================================
// ReturnReportStatistics
//======================================================

const ReturnReportStatistics = ({
  statistics = {},
  loading = false,
}) => {
  //====================================================
  // Normalize Statistics
  //====================================================

  const safeStatistics = useMemo(
    () =>
      statistics &&
      typeof statistics === "object"
        ? statistics
        : {},
    [statistics]
  );

  //====================================================
  // Calculate Values
  //====================================================

  const totalReturns = toNumber(
    safeStatistics.totalReturns ??
      safeStatistics.totalReturnCount ??
      safeStatistics.returnCount
  );

  const totalQuantity = toNumber(
    safeStatistics.totalQuantity ??
      safeStatistics.returnedQuantity ??
      safeStatistics.quantity
  );

  const totalReturnAmount = toNumber(
    safeStatistics.totalReturnAmount ??
      safeStatistics.returnAmount ??
      safeStatistics.totalAmount
  );

  const totalRefundAmount = toNumber(
    safeStatistics.totalRefundAmount ??
      safeStatistics.refundAmount
  );

  //====================================================
  // Statistics Cards
  //====================================================

  const cards = useMemo(
    () => [
      {
        key: "totalReturns",
        label: "Total Returns",
        value: formatNumber(
          totalReturns
        ),
        icon: (
          <AssignmentReturn />
        ),
      },
      {
        key: "totalQuantity",
        label: "Returned Quantity",
        value: formatNumber(
          totalQuantity
        ),
        icon: (
          <Inventory2 />
        ),
      },
      {
        key: "returnAmount",
        label: "Return Amount",
        value: formatCurrency(
          totalReturnAmount
        ),
        icon: (
          <CurrencyRupee />
        ),
      },
      {
        key: "refundAmount",
        label: "Refund Amount",
        value: formatCurrency(
          totalRefundAmount
        ),
        icon: (
          <Replay />
        ),
      },
    ],
    [
      totalReturns,
      totalQuantity,
      totalReturnAmount,
      totalRefundAmount,
    ]
  );


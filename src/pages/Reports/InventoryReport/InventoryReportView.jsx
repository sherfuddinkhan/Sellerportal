import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  Close,
  Inventory2,
} from "@mui/icons-material";

//======================================================
// InventoryReportView
//======================================================

const InventoryReportView = ({
  open = false,
  report = null,
  onClose,
  loading = false,
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
  
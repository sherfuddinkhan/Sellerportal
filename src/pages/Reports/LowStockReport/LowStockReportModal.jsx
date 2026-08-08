import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Close,
  Delete,
  Save,
} from "@mui/icons-material";

import {
  createLowStockReport,
  updateLowStockReport,
} from "./LowStockReportService";

//======================================================
// LowStockReportModal
//======================================================

const LowStockReportModal = ({
  open = false,
  mode = "view",
  report = null,
  onClose,
  onConfirmDelete,
  onSaved,
}) => {

  //====================================================
  // Form State
  //====================================================

  const [formData, setFormData] =
    useState({
      productName: "",
      productCode: "",
      category: "",
      warehouse: "",
      currentStock: "",
      minimumStock: "",
      reorderQuantity: "",
      unit: "Units",
      supplierName: "",
      notes: "",
    });

  //====================================================
  // Loading State
  //====================================================

  const [saving, setSaving] =
    useState(false);

  //====================================================
  // Error State
  //====================================================

  const [error, setError] =
    useState("");

  //====================================================
  // Initialize Form
  //====================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    setError("");

    if (report) {
      setFormData({
        productName:
          report?.productName ??
          report?.itemName ??
          report?.name ??
          "",

        productCode:
          report?.productCode ??
          report?.itemCode ??
          report?.sku ??
          "",

        category:
          report?.categoryName ??
          report?.category ??
          "",

        warehouse:
          report?.warehouseName ??
          report?.warehouse ??
          "",

        currentStock:
          report?.currentStock ??
          report?.stockQuantity ??
          report?.quantity ??
          "",

        minimumStock:
          report?.minimumStock ??
          report?.minStock ??
          report?.reorderLevel ??
          "",

        reorderQuantity:
          report?.reorderQuantity ??
          report?.reorderQty ??
          "",

        unit:
          report?.unit ??
          report?.uom ??
          "Units",

        supplierName:
          report?.supplierName ??
          report?.supplier ??
          "",

        notes:
          report?.notes ??
          report?.remarks ??
          "",
      });

      return;
    }

    setFormData({
      productName: "",
      productCode: "",
      category: "",
      warehouse: "",
      currentStock: "",
      minimumStock: "",
      reorderQuantity: "",
      unit: "Units",
      supplierName: "",
      notes: "",
    });
  }, [
    open,
    report,
  ]);

  //====================================================
  // Handle Field Change
  //====================================================

  const handleChange =
    useCallback(
      (event) => {
        const {
          name,
          value,
        } = event.target;

        setFormData(
          (previous) => ({
            ...previous,
            [name]: value,
          })
        );
      },
      []
    );

  //====================================================
  // Handle Close
  //====================================================

  const handleClose =
    useCallback(() => {
      if (saving) {
        return;
      }

      setError("");

      if (
        typeof onClose ===
        "function"
      ) {
        onClose();
      }
    }, [
      saving,
      onClose,
    ]);

  //====================================================
  // Validate Form
  //====================================================

  const validateForm =
    useCallback(() => {

      if (
        !formData.productName
          .trim()
      ) {
        return "Product name is required.";
      }

      if (
        formData.currentStock ===
        ""
      ) {
        return "Current stock is required.";
      }

      if (
        formData.minimumStock ===
        ""
      ) {
        return "Minimum stock is required.";
      }

      const currentStock =
        Number(
          formData.currentStock
        );

      const minimumStock =
        Number(
          formData.minimumStock
        );

      if (
        !Number.isFinite(
          currentStock
        ) ||
        currentStock < 0
      ) {
        return "Current stock must be a valid non-negative number.";
      }

      if (
        !Number.isFinite(
          minimumStock
        ) ||
        minimumStock < 0
      ) {
        return "Minimum stock must be a valid non-negative number.";
      }

      if (
        formData.reorderQuantity !==
        ""
      ) {
        const reorderQuantity =
          Number(
            formData.reorderQuantity
          );

        if (
          !Number.isFinite(
            reorderQuantity
          ) ||
          reorderQuantity < 0
        ) {
          return "Reorder quantity must be a valid non-negative number.";
        }
      }

      return "";
    }, [
      formData,
    ]);

  //====================================================
  // Part 1A Ends Here
  //====================================================
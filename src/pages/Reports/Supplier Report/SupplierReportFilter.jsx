//======================================================
// SuppliesReportFilter.jsx
// Part 1A
//======================================================

import React from "react";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearAllIcon from "@mui/icons-material/ClearAll";

//======================================================
// SuppliesReportFilter
//======================================================

const SuppliesReportFilter = ({
  filters = {},
  onChange,
  onFiltersChange,
  onClear,
  disabled = false,
}) => {
  //====================================================
  // Local Filters
  //====================================================

  const localFilters = {
    search: filters?.search || "",
    startDate: filters?.startDate || "",
    endDate: filters?.endDate || "",
    supplier: filters?.supplier || "",
    stockItem: filters?.stockItem || "",
    category: filters?.category || "",
    warehouse: filters?.warehouse || "",
    status: filters?.status || "",
  };

  //====================================================
  // Field Change
  //====================================================

  const handleFieldChange = (
    field,
    value
  ) => {
    if (
      typeof onChange ===
      "function"
    ) {
      onChange(
        field,
        value
      );
    }

    if (
      typeof onFiltersChange ===
      "function"
    ) {
      onFiltersChange({
        [field]: value,
      });
    }
  };

  //====================================================
  // Clear Filters
  //====================================================

  const handleClear = () => {
    if (
      typeof onClear ===
      "function"
    ) {
      onClear();
      return;
    }

    if (
      typeof onFiltersChange ===
      "function"
    ) {
      onFiltersChange({
        startDate: "",
        endDate: "",
        supplier: "",
        stockItem: "",
        category: "",
        warehouse: "",
        status: "",
      });
    }
  };

  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      variant="outlined"
      className="supplies-report__filter"
      sx={{
        width: "100%",
        p: 2,
      }}
    >
      <Stack
        spacing={2}
      >

        {/*==============================================
            Filter Fields
        ===============================================*/}

        <Grid
          container
          spacing={2}
        >

          {/*============================================
              Start Date
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Start Date"
              value={
                localFilters.startDate
              }
              onChange={(
                event
              ) =>
                handleFieldChange(
                  "startDate",
                  event.target.value
                )
              }
              disabled={
                disabled
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/*============================================
              End Date
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <TextField
              fullWidth
              size="small"
              type="date"
              label="End Date"
              value={
                localFilters.endDate
              }
              onChange={(
                event
              ) =>
                handleFieldChange(
                  "endDate",
                  event.target.value
                )
              }
              disabled={
                disabled
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/*============================================
              Supplier
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <TextField
              fullWidth
              size="small"
              label="Supplier"
              placeholder="Supplier name"
              value={
                localFilters.supplier
              }
              onChange={(
                event
              ) =>
                handleFieldChange(
                  "supplier",
                  event.target.value
                )
              }
              disabled={
                disabled
              }
            />
          </Grid>

          {/*============================================
              Stock Item
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <TextField
              fullWidth
              size="small"
              label="Stock Item"
              placeholder="Stock item"
              value={
                localFilters.stockItem
              }
              onChange={(
                event
              ) =>
                handleFieldChange(
                  "stockItem",
                  event.target.value
                )
              }
              disabled={
                disabled
              }
            />
          </Grid>

          {/*============================================
              Category
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <TextField
              fullWidth
              size="small"
              label="Category"
              placeholder="Category"
              value={
                localFilters.category
              }
              onChange={(
                event
              ) =>
                handleFieldChange(
                  "category",
                  event.target.value
                )
              }
              disabled={
                disabled
              }
            />
          </Grid>

          {/*============================================
              Warehouse
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <TextField
              fullWidth
              size="small"
              label="Warehouse"
              placeholder="Warehouse / Godown"
              value={
                localFilters.warehouse
              }
              onChange={(
                event
              ) =>
                handleFieldChange(
                  "warehouse",
                  event.target.value
                )
              }
              disabled={
                disabled
              }
            />
          </Grid>

          {/*============================================
              Status
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={
                localFilters.status
              }
              onChange={(
                event
              ) =>
                handleFieldChange(
                  "status",
                  event.target.value
                )
              }
              disabled={
                disabled
              }
            >
              <MenuItem value="">
                All Statuses
              </MenuItem>

              <MenuItem value="active">
                Active
              </MenuItem>

              <MenuItem value="approved">
                Approved
              </MenuItem>

              <MenuItem value="pending">
                Pending
              </MenuItem>

              <MenuItem value="completed">
                Completed
              </MenuItem>

              <MenuItem value="draft">
                Draft
              </MenuItem>

              <MenuItem value="cancelled">
                Cancelled
              </MenuItem>

              <MenuItem value="rejected">
                Rejected
              </MenuItem>
            </TextField>
          </Grid>

        </Grid>

        {/*==============================================
            Filter Actions
        ===============================================*/}

        <Box>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
            justifyContent="flex-end"
          >

            <Button
              variant="outlined"
              size="small"
              startIcon={
                <ClearAllIcon />
              }
              onClick={
                handleClear
              }
              disabled={
                disabled
              }
            >
              Clear Filters
            </Button>

            <Button
              variant="contained"
              size="small"
              startIcon={
                <FilterAltIcon />
              }
              disabled={
                disabled
              }
            >
              Apply Filters
            </Button>

          </Stack>
        </Box>

      </Stack>
    </Paper>
  );
};

//======================================================
// Export
//======================================================

export default SuppliesReportFilter;

//======================================================
// Part 1A Ends Here
//======================================================
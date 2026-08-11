//======================================================
// TaxReportFilter.jsx
// Part 1A
//======================================================

import React, {
  useEffect,
  useState,
} from "react";

import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearAllIcon from "@mui/icons-material/ClearAll";

//======================================================
// Default Filters
//======================================================

const DEFAULT_FILTERS = {
  startDate: "",
  endDate: "",
  taxType: "all",
  status: "all",
  partyType: "all",
};

//======================================================
// TaxReportFilter
//======================================================

const TaxReportFilter = ({
  filters = {},
  onChange,
  onFiltersChange,
  onClear,
  disabled = false,
}) => {
  //====================================================
  // Local Filters
  //====================================================

  const [localFilters, setLocalFilters] =
    useState({
      ...DEFAULT_FILTERS,
      ...filters,
    });

  //====================================================
  // Sync Parent Filters
  //====================================================

  useEffect(() => {
    setLocalFilters({
      ...DEFAULT_FILTERS,
      ...(filters || {}),
    });
  }, [filters]);

  //====================================================
  // Field Change
  //====================================================

  const handleFieldChange = (
    field,
    value
  ) => {
    const nextFilters = {
      ...localFilters,
      [field]: value,
    };

    setLocalFilters(nextFilters);

    if (
      typeof onChange === "function"
    ) {
      onChange(field, value);
    }
  };

  //====================================================
  // Apply Filters
  //====================================================

  const handleApply = () => {
    if (
      disabled
    ) {
      return;
    }

    if (
      typeof onFiltersChange ===
      "function"
    ) {
      onFiltersChange(
        localFilters
      );
    }
  };

  //====================================================
  // Clear Filters
  //====================================================

  const handleClear = () => {
    if (
      disabled
    ) {
      return;
    }

    const clearedFilters = {
      ...DEFAULT_FILTERS,
    };

    setLocalFilters(
      clearedFilters
    );

    if (
      typeof onClear === "function"
    ) {
      onClear();
      return;
    }

    if (
      typeof onFiltersChange ===
      "function"
    ) {
      onFiltersChange(
        clearedFilters
      );
    }
  };

  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      variant="outlined"
      className="tax-report__filter"
      sx={{
        width: "100%",
        p: 2,
      }}
    >
      <Stack spacing={2}>

        {/*==============================================
            Filter Header
        ===============================================*/}

        <Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <FilterAltIcon
              fontSize="small"
            />

            <Typography
              variant="subtitle1"
              fontWeight={700}
            >
              Tax Report Filters
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Filter tax records by
            date, tax type, status
            and party type.
          </Typography>
        </Box>

        <Divider />

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
            md={3}
          >
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Start Date"
              value={
                localFilters.startDate ||
                ""
              }
              onChange={(event) =>
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
            md={3}
          >
            <TextField
              fullWidth
              size="small"
              type="date"
              label="End Date"
              value={
                localFilters.endDate ||
                ""
              }
              onChange={(event) =>
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
              Tax Type
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <TextField
              fullWidth
              select
              size="small"
              label="Tax Type"
              value={
                localFilters.taxType ||
                "all"
              }
              onChange={(event) =>
                handleFieldChange(
                  "taxType",
                  event.target.value
                )
              }
              disabled={
                disabled
              }
            >
              <MenuItem value="all">
                All Tax Types
              </MenuItem>

              <MenuItem value="cgst">
                CGST
              </MenuItem>

              <MenuItem value="sgst">
                SGST
              </MenuItem>

              <MenuItem value="igst">
                IGST
              </MenuItem>

              <MenuItem value="cess">
                Cess
              </MenuItem>
            </TextField>
          </Grid>

          {/*============================================
              Status
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <TextField
              fullWidth
              select
              size="small"
              label="Status"
              value={
                localFilters.status ||
                "all"
              }
              onChange={(event) =>
                handleFieldChange(
                  "status",
                  event.target.value
                )
              }
              disabled={
                disabled
              }
            >
              <MenuItem value="all">
                All Statuses
              </MenuItem>

              <MenuItem value="paid">
                Paid
              </MenuItem>

              <MenuItem value="approved">
                Approved
              </MenuItem>

              <MenuItem value="completed">
                Completed
              </MenuItem>

              <MenuItem value="pending">
                Pending
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

          {/*============================================
              Party Type
          =============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <TextField
              fullWidth
              select
              size="small"
              label="Party Type"
              value={
                localFilters.partyType ||
                "all"
              }
              onChange={(event) =>
                handleFieldChange(
                  "partyType",
                  event.target.value
                )
              }
              disabled={
                disabled
              }
            >
              <MenuItem value="all">
                All Parties
              </MenuItem>

              <MenuItem value="customer">
                Customer
              </MenuItem>

              <MenuItem value="supplier">
                Supplier
              </MenuItem>
            </TextField>
          </Grid>

        </Grid>

        {/*==============================================
            Actions
        ===============================================*/}

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
            onClick={
              handleApply
            }
            disabled={
              disabled
            }
          >
            Apply Filters
          </Button>

        </Stack>

      </Stack>
    </Paper>
  );
};

//======================================================
// Export
//======================================================

export default TaxReportFilter;

//======================================================
// Part 1A Ends Here
//======================================================
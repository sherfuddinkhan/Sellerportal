import React, {
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Add,
  Delete,
  FilterAlt,
  Refresh,
  RestartAlt,
} from "@mui/icons-material";

//======================================================
// InventoryReportToolbar
//======================================================

const InventoryReportToolbar = ({
  filters = {},
  selectedRows = [],
  loading = false,
  onRefresh,
  onAdd,
  onResetFilters,
  onDeleteSelected,
  onFilter,
}) => {

  //====================================================
  // Filter Visibility
  //====================================================

  const [filterOpen, setFilterOpen] =
    useState(false);

  //====================================================
  // Selected Count
  //====================================================

  const selectedCount =
    Array.isArray(selectedRows)
      ? selectedRows.length
      : 0;

  //====================================================
  // Toggle Filters
  //====================================================

  const handleToggleFilter = () => {

    setFilterOpen(
      (previous) => !previous
    );

  };

  //====================================================
  // Refresh
  //====================================================

  const handleRefresh = () => {

    if (
      typeof onRefresh ===
      "function"
    ) {
      onRefresh();
    }

  };

  //====================================================
  // Add Report
  //====================================================

  const handleAdd = () => {

    if (
      typeof onAdd ===
      "function"
    ) {
      onAdd();
    }

  };

  //====================================================
  // Reset Filters
  //====================================================

  const handleResetFilters = () => {

    if (
      typeof onResetFilters ===
      "function"
    ) {
      onResetFilters();
    }

  };

  //====================================================
  // Delete Selected
  //====================================================

  const handleDeleteSelected = () => {

    if (
      typeof onDeleteSelected ===
      "function"
    ) {
      onDeleteSelected();
    }

  };

  //====================================================
  // Filter Change
  //====================================================

  const handleFilterChange = (
    nextFilters
  ) => {

    if (
      typeof onFilter ===
      "function"
    ) {
      onFilter(
        nextFilters
      );
    }

  };

  //====================================================
  // Active Filter Count
  //====================================================

  const activeFilterCount = Object.values(
    filters || {}
  ).filter(
    (value) =>
      value !== "" &&
      value !== null &&
      value !== undefined
  ).length;

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Box
      className="inventory-report-toolbar"
      sx={{
        width: "100%",
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >

      {/*================================================
          Main Toolbar
      =================================================*/}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        spacing={1.5}
      >

        {/*================================================
            Left Actions
        =================================================*/}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          flexWrap="wrap"
        >

          {/* Add */}

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAdd}
            disabled={loading}
          >
            Add Report
          </Button>

          {/* Delete Selected */}

          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={
              handleDeleteSelected
            }
            disabled={
              loading ||
              selectedCount === 0
            }
          >
            Delete Selected
            {selectedCount > 0 &&
              ` (${selectedCount})`}
          </Button>

        </Stack>

        {/*================================================
            Right Actions
        =================================================*/}

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={0.5}
        >

          {/* Filter */}

          <Tooltip
            title={
              filterOpen
                ? "Hide filters"
                : "Show filters"
            }
          >
            <IconButton
              color={
                filterOpen ||
                activeFilterCount > 0
                  ? "primary"
                  : "default"
              }
              onClick={
                handleToggleFilter
              }
              disabled={loading}
              aria-label="toggle inventory report filters"
            >
              <FilterAlt />
            </IconButton>
          </Tooltip>

          {/* Reset */}

          <Tooltip title="Reset filters">
            <IconButton
              onClick={
                handleResetFilters
              }
              disabled={
                loading ||
                activeFilterCount === 0
              }
              aria-label="reset inventory report filters"
            >
              <RestartAlt />
            </IconButton>
          </Tooltip>

          {/* Refresh */}

          <Tooltip title="Refresh reports">
            <IconButton
              color="primary"
              onClick={handleRefresh}
              disabled={loading}
              aria-label="refresh inventory reports"
            >
              <Refresh />
            </IconButton>
          </Tooltip>

        </Stack>

      </Stack>

      {/*================================================
          Selection Information
      =================================================*/}

      {selectedCount > 0 && (
        <Box
          sx={{
            mt: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: 1,
            bgcolor: "action.hover",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {selectedCount} inventory report
            {selectedCount !== 1
              ? "s"
              : ""} selected
          </Typography>
        </Box>
      )}

      {/*================================================
          Filter Panel
      =================================================*/}

      {filterOpen && (
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            flexWrap="wrap"
          >

            {/*============================================
                Status Filter
            ============================================*/}

            <Box
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 180,
                },
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 0.5 }}
              >
                Status
              </Typography>

              <select
                value={
                  filters?.status || ""
                }
                onChange={(event) =>
                  handleFilterChange({
                    ...filters,
                    status:
                      event.target.value,
                  })
                }
                disabled={loading}
                style={{
                  width: "100%",
                  height: 40,
                  padding:
                    "0 10px",
                  border:
                    "1px solid #ccc",
                  borderRadius: 4,
                  background:
                    "transparent",
                }}
              >
                <option value="">
                  All Statuses
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>

                <option value="draft">
                  Draft
                </option>

                <option value="archived">
                  Archived
                </option>
              </select>
            </Box>

            {/*============================================
                Report Type
            ============================================*/}

            <Box
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 180,
                },
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 0.5 }}
              >
                Report Type
              </Typography>

              <select
                value={
                  filters?.reportType || ""
                }
                onChange={(event) =>
                  handleFilterChange({
                    ...filters,
                    reportType:
                      event.target.value,
                  })
                }
                disabled={loading}
                style={{
                  width: "100%",
                  height: 40,
                  padding:
                    "0 10px",
                  border:
                    "1px solid #ccc",
                  borderRadius: 4,
                  background:
                    "transparent",
                }}
              >
                <option value="">
                  All Report Types
                </option>

                <option value="inventory">
                  Inventory
                </option>

                <option value="stock">
                  Stock
                </option>

                <option value="valuation">
                  Valuation
                </option>

                <option value="movement">
                  Stock Movement
                </option>
              </select>
            </Box>

            {/*============================================
                Date From
            ============================================*/}

            <Box
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 170,
                },
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 0.5 }}
              >
                From Date
              </Typography>

              <input
                type="date"
                value={
                  filters?.dateFrom || ""
                }
                onChange={(event) =>
                  handleFilterChange({
                    ...filters,
                    dateFrom:
                      event.target.value,
                  })
                }
                disabled={loading}
                style={{
                  width: "100%",
                  height: 40,
                  padding:
                    "0 10px",
                  border:
                    "1px solid #ccc",
                  borderRadius: 4,
                  background:
                    "transparent",
                  boxSizing:
                    "border-box",
                }}
              />
            </Box>

            {/*============================================
                Date To
            ============================================*/}

            <Box
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 170,
                },
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 0.5 }}
              >
                To Date
              </Typography>

              <input
                type="date"
                value={
                  filters?.dateTo || ""
                }
                onChange={(event) =>
                  handleFilterChange({
                    ...filters,
                    dateTo:
                      event.target.value,
                  })
                }
                disabled={loading}
                style={{
                  width: "100%",
                  height: 40,
                  padding:
                    "0 10px",
                  border:
                    "1px solid #ccc",
                  borderRadius: 4,
                  background:
                    "transparent",
                  boxSizing:
                    "border-box",
                }}
              />
            </Box>

          </Stack>

          {/*==============================================
              Active Filters
          ==============================================*/}

          {activeFilterCount > 0 && (
            <Box sx={{ mt: 2 }}>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {activeFilterCount} active filter
                {activeFilterCount !== 1
                  ? "s"
                  : ""}
              </Typography>

            </Box>
          )}

        </Box>
      )}

    </Box>
  );

//======================================================
// Part 1B Ends Here
//======================================================

//======================================================
// PropTypes
//======================================================

InventoryReportToolbar.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string,

    reportType: PropTypes.string,

    dateFrom: PropTypes.string,

    dateTo: PropTypes.string,
  }),

  selectedRows: PropTypes.array,

  loading: PropTypes.bool,

  onRefresh: PropTypes.func,

  onAdd: PropTypes.func,

  onResetFilters: PropTypes.func,

  onDeleteSelected:
    PropTypes.func,

  onFilter: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

InventoryReportToolbar.defaultProps = {
  filters: {
    status: "",
    reportType: "",
    dateFrom: "",
    dateTo: "",
  },

  selectedRows: [],

  loading: false,

  onRefresh: () => {},

  onAdd: () => {},

  onResetFilters: () => {},

  onDeleteSelected: () => {},

  onFilter: () => {},
};

//======================================================
// Export
//======================================================
}
export default InventoryReportToolbar;
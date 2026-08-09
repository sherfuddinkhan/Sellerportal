import React, {
  useCallback,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Button,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Add,
  Delete,
  FilterAlt,
  Refresh,
} from "@mui/icons-material";

//======================================================
// MarketplaceReportToolbar
//======================================================

const MarketplaceReportToolbar = ({
  selectedRows = [],
  totalRecords = 0,
  loading = false,
  onRefresh,
  onAdd,
  onDeleteSelected,
  onToggleFilter,
  filterOpen = false,
}) => {

  //====================================================
  // Selected Count
  //====================================================

  const selectedCount =
    Array.isArray(selectedRows)
      ? selectedRows.length
      : 0;

  //====================================================
  // Handle Refresh
  //====================================================

  const handleRefresh =
    useCallback(() => {
      if (
        typeof onRefresh ===
        "function"
      ) {
        onRefresh();
      }
    }, [onRefresh]);

  //====================================================
  // Handle Add
  //====================================================

  const handleAdd =
    useCallback(() => {
      if (
        typeof onAdd ===
        "function"
      ) {
        onAdd();
      }
    }, [onAdd]);

  //====================================================
  // Handle Delete Selected
  //====================================================

  const handleDeleteSelected =
    useCallback(() => {
      if (selectedCount === 0) {
        return;
      }

      if (
        typeof onDeleteSelected ===
        "function"
      ) {
        onDeleteSelected(
          selectedRows
        );
      }
    }, [
      selectedCount,
      selectedRows,
      onDeleteSelected,
    ]);

  //====================================================
  // Handle Filter
  //====================================================

  const handleToggleFilter =
    useCallback(() => {
      if (
        typeof onToggleFilter ===
        "function"
      ) {
        onToggleFilter();
      }
    }, [
      onToggleFilter,
    ]);

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Box
      className="marketplace-report-toolbar"
      sx={{
        width: "100%",
        mb: 2,
      }}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        justifyContent="space-between"
      >
        {/*================================================
            Title / Summary
        =================================================*/}

        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Marketplace Report
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {Number(
              totalRecords || 0
            ).toLocaleString("en-IN")}{" "}
            {totalRecords === 1
              ? "record"
              : "records"}{" "}
            found
            {selectedCount > 0 &&
              ` • ${selectedCount} selected`}
          </Typography>
        </Box>

        {/*================================================
            Toolbar Actions
        =================================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1}
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
        >
          {/*==============================================
              Filter
          ==============================================*/}

          <Tooltip
            title={
              filterOpen
                ? "Hide filters"
                : "Show filters"
            }
          >
            <span>
              <Button
                variant={
                  filterOpen
                    ? "contained"
                    : "outlined"
                }
                color="primary"
                startIcon={
                  <FilterAlt />
                }
                onClick={
                  handleToggleFilter
                }
                disabled={loading}
              >
                Filters
              </Button>
            </span>
          </Tooltip>

          {/*==============================================
              Refresh
          ==============================================*/}

          <Tooltip
            title="Refresh marketplace report"
          >
            <span>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={
                  <Refresh />
                }
                onClick={
                  handleRefresh
                }
                disabled={loading}
              >
                Refresh
              </Button>
            </span>
          </Tooltip>

          {/*==============================================
              Add
          ==============================================*/}

          <Tooltip
            title="Add marketplace report"
          >
            <span>
              <Button
                variant="contained"
                color="primary"
                startIcon={
                  <Add />
                }
                onClick={
                  handleAdd
                }
                disabled={loading}
              >
                Add
              </Button>
            </span>
          </Tooltip>

          {/*==============================================
              Delete Selected
          ==============================================*/}

          {selectedCount > 0 && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              />

              <Tooltip
                title={`Delete ${selectedCount} selected ${
                  selectedCount === 1
                    ? "record"
                    : "records"
                }`}
              >
                <span>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={
                      <Delete />
                    }
                    onClick={
                      handleDeleteSelected
                    }
                    disabled={loading}
                  >
                    Delete Selected
                  </Button>
                </span>
              </Tooltip>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

MarketplaceReportToolbar.propTypes = {
  selectedRows: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  ),

  totalRecords: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  loading: PropTypes.bool,

  onRefresh: PropTypes.func,

  onAdd: PropTypes.func,

  onDeleteSelected: PropTypes.func,

  onToggleFilter: PropTypes.func,

  filterOpen: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

MarketplaceReportToolbar.defaultProps = {
  selectedRows: [],

  totalRecords: 0,

  loading: false,

  onRefresh: () => {},

  onAdd: () => {},

  onDeleteSelected: () => {},

  onToggleFilter: () => {},

  filterOpen: false,
};

//======================================================
// Export
//======================================================
}
export default MarketplaceReportToolbar;
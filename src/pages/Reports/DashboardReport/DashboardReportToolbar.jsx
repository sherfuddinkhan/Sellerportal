import React, {useMemo} from "react";
import PropTypes from "prop-types";
import {Box,Button,Stack,Tooltip} from "@mui/material";
import {Add,FilterAltOff,Refresh} from "@mui/icons-material";

//======================================================
// DashboardReportToolbar
//======================================================

const DashboardReportToolbar = ({
  filters = {},
  selectedRows = [],
  loading = false,
  onRefresh,
  onAdd,
  onResetFilters,
}) => {

  //====================================================
  // Check Active Filters
  //====================================================

  const hasActiveFilters =
    useMemo(() => {

      return Boolean(
        filters?.search ||
        filters?.searchTerm ||
        filters?.status ||
        filters?.reportType ||
        filters?.dateFrom ||
        filters?.dateTo
      );

    }, [filters]);

  //====================================================
  // Selected Row Count
  //====================================================

  const selectedCount =
    Array.isArray(selectedRows)
      ? selectedRows.length
      : 0;

  //====================================================
  // Refresh Handler
  //====================================================

  const handleRefresh = async () => {

    if (
      typeof onRefresh ===
      "function"
    ) {
      await onRefresh();
    }

  };

  //====================================================
  // Add Handler
  //====================================================

  const handleAdd = () => {

    if (
      typeof onAdd === "function"
    ) {
      onAdd();
    }

  };

  //====================================================
  // Reset Filters Handler
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
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Box
      className="dashboard-report-toolbar"
      sx={{
        width: "100%",
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={1.5}
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        justifyContent="space-between"
      >

        {/*==============================================
            Left Side
        ==============================================*/}

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

          {/*============================================
              Add Report
          ============================================*/}

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAdd}
            disabled={loading}
          >
            Add Report
          </Button>

          {/*============================================
              Reset Filters
          ============================================*/}

          {hasActiveFilters && (
            <Tooltip title="Clear all filters">
              <Button
                variant="outlined"
                color="secondary"
                startIcon={
                  <FilterAltOff />
                }
                onClick={
                  handleResetFilters
                }
                disabled={loading}
              >
                Reset Filters
              </Button>
            </Tooltip>
          )}

        </Stack>

        {/*==============================================
            Right Side
        ==============================================*/}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={{
            xs: "space-between",
            sm: "flex-end",
          }}
        >

          {/*============================================
              Selected Rows
          ============================================*/}

          {selectedCount > 0 && (
            <Box
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: 1,
                backgroundColor:
                  "action.selected",
              }}
            >
              <Typography
                variant="body2"
                color="primary"
                fontWeight={600}
              >
                {selectedCount}{" "}
                {selectedCount === 1
                  ? "selected"
                  : "selected"}
              </Typography>
            </Box>
          )}

          {/*============================================
              Refresh
          ============================================*/}

          <Tooltip title="Refresh reports">
            <span>
              <Button
                variant="outlined"
                color="primary"
                startIcon={
                  <Refresh />
                }
                onClick={
                  handleRefresh
                }
                disabled={loading}
              >
                {loading
                  ? "Refreshing..."
                  : "Refresh"}
              </Button>
            </span>
          </Tooltip>

        </Stack>

      </Stack>
    </Box>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

DashboardReportToolbar.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    searchTerm: PropTypes.string,
    status: PropTypes.string,
    reportType: PropTypes.string,
    dateFrom: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    dateTo: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  }),

  selectedRows: PropTypes.array,

  loading: PropTypes.bool,

  onRefresh: PropTypes.func,

  onAdd: PropTypes.func,

  onResetFilters: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

DashboardReportToolbar.defaultProps = {
  filters: {},

  selectedRows: [],

  loading: false,

  onRefresh: () => {},

  onAdd: () => {},

  onResetFilters: () => {},
};

//======================================================
// Export
//======================================================

export default DashboardReportToolbar;
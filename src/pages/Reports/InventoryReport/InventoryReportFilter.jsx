import React, {
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  FilterAlt,
  RestartAlt,
} from "@mui/icons-material";

//======================================================
// InventoryReportFilter
//======================================================

const InventoryReportFilter = ({
  filters = {},
  loading = false,
  reports = [],
  onFilterChange,
  onApply,
  onReset,
}) => {

  //====================================================
  // Default Filters
  //====================================================

  const defaultFilters = {
    search: "",
    status: "",
    reportType: "",
    dateFrom: "",
    dateTo: "",
    createdBy: "",
    minValue: "",
    maxValue: "",
  };

  //====================================================
  // Safe Filter State
  //====================================================

  const currentFilters = useMemo(
    () => ({
      ...defaultFilters,
      ...(filters || {}),
    }),
    [filters]
  );

  //====================================================
  // Safe Reports
  //====================================================

  const safeReports = useMemo(
    () =>
      Array.isArray(reports)
        ? reports
        : [],
    [reports]
  );

  //====================================================
  // Unique Report Types
  //====================================================

  const reportTypes = useMemo(() => {

    return [
      ...new Set(
        safeReports
          .map(
            (report) =>
              report?.reportType ??
              report?.type ??
              ""
          )
          .filter(Boolean)
      ),
    ];

  }, [safeReports]);

  //====================================================
  // Unique Created By
  //====================================================

  const createdByList = useMemo(() => {

    return [
      ...new Set(
        safeReports
          .map(
            (report) =>
              report?.createdByName ??
              report?.createdBy ??
              ""
          )
          .filter(Boolean)
      ),
    ];

  }, [safeReports]);

  //====================================================
  // Handle Field Change
  //====================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    const nextFilters = {
      ...currentFilters,
      [name]: value,
    };

    if (
      typeof onFilterChange ===
      "function"
    ) {
      onFilterChange(
        nextFilters
      );
    }
  };

  //====================================================
  // Apply Filters
  //====================================================

  const handleApply = () => {

    if (
      typeof onApply ===
      "function"
    ) {
      onApply(
        currentFilters
      );
    }
  };

  //====================================================
  // Reset Filters
  //====================================================

  const handleReset = () => {

    const resetFilters = {
      ...defaultFilters,
    };

    if (
      typeof onReset ===
      "function"
    ) {
      onReset(
        resetFilters
      );
    }

    if (
      typeof onFilterChange ===
      "function"
    ) {
      onFilterChange(
        resetFilters
      );
    }
  };

  //====================================================
  // Active Filter Count
  //====================================================

  const activeFilterCount =
    Object.entries(
      currentFilters
    ).filter(
      ([key, value]) =>
        key !== "search" &&
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
      className="inventory-report-filter"
      sx={{
        width: "100%",
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >

      {/*================================================
          Filter Header
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
        spacing={1}
        sx={{ mb: 2 }}
      >

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <FilterAlt
            color="primary"
          />

          <Typography
            variant="subtitle1"
            fontWeight={600}
          >
            Inventory Report Filters
          </Typography>

          {activeFilterCount > 0 && (
            <Typography
              variant="caption"
              color="primary"
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor:
                  "primary.50",
              }}
            >
              {activeFilterCount} active
            </Typography>
          )}
        </Stack>

        <Button
          size="small"
          variant="text"
          startIcon={<RestartAlt />}
          onClick={handleReset}
          disabled={
            loading ||
            activeFilterCount === 0
          }
        >
          Reset
        </Button>

      </Stack>

      {/*================================================
          Filter Fields
      =================================================*/}

      <Grid
        container
        spacing={2}
      >

        {/*==============================================
            Search
        ==============================================*/}

        <Grid
          item
          xs={12}
          md={6}
        >
          <TextField
            fullWidth
            size="small"
            label="Search"
            name="search"
            value={
              currentFilters.search
            }
            onChange={
              handleChange
            }
            disabled={loading}
            placeholder="Search report name, ID, type..."
          />
        </Grid>

        {/*==============================================
            Status
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <FormControl
            fullWidth
            size="small"
          >
            <InputLabel>
              Status
            </InputLabel>

            <Select
              label="Status"
              name="status"
              value={
                currentFilters.status
              }
              onChange={
                handleChange
              }
              disabled={loading}
            >
              <MenuItem value="">
                All Statuses
              </MenuItem>

              <MenuItem value="active">
                Active
              </MenuItem>

              <MenuItem value="inactive">
                Inactive
              </MenuItem>

              <MenuItem value="draft">
                Draft
              </MenuItem>

              <MenuItem value="archived">
                Archived
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/*==============================================
            Report Type
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <FormControl
            fullWidth
            size="small"
          >
            <InputLabel>
              Report Type
            </InputLabel>

            <Select
              label="Report Type"
              name="reportType"
              value={
                currentFilters.reportType
              }
              onChange={
                handleChange
              }
              disabled={loading}
            >
              <MenuItem value="">
                All Types
              </MenuItem>

              {reportTypes.map(
                (type) => (
                  <MenuItem
                    key={type}
                    value={type}
                  >
                    {type}
                  </MenuItem>
                )
              )}

            </Select>
          </FormControl>
        </Grid>

        {/*==============================================
            Date From
        ==============================================*/}

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
            label="Date From"
            name="dateFrom"
            value={
              currentFilters.dateFrom
            }
            onChange={
              handleChange
            }
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        {/*==============================================
            Date To
        ==============================================*/}

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
            label="Date To"
            name="dateTo"
            value={
              currentFilters.dateTo
            }
            onChange={
              handleChange
            }
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        {/*==============================================
            Created By
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <FormControl
            fullWidth
            size="small"
          >
            <InputLabel>
              Created By
            </InputLabel>

            <Select
              label="Created By"
              name="createdBy"
              value={
                currentFilters.createdBy
              }
              onChange={
                handleChange
              }
              disabled={loading}
            >
              <MenuItem value="">
                All Users
              </MenuItem>

              {createdByList.map(
                (user) => (
                  <MenuItem
                    key={user}
                    value={user}
                  >
                    {user}
                  </MenuItem>
                )
              )}

            </Select>
          </FormControl>
        </Grid>

        {/*==============================================
            Minimum Value
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Minimum Value"
            name="minValue"
            value={
              currentFilters.minValue
            }
            onChange={
              handleChange
            }
            disabled={loading}
            inputProps={{
              min: 0,
              step: "0.01",
            }}
          />
        </Grid>

        {/*==============================================
            Maximum Value
        ==============================================*/}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Maximum Value"
            name="maxValue"
            value={
              currentFilters.maxValue
            }
            onChange={
              handleChange
            }
            disabled={loading}
            inputProps={{
              min: 0,
              step: "0.01",
            }}
          />
        </Grid>

        {/*==============================================
            Apply Button
        ==============================================*/}

        <Grid
          item
          xs={12}
        >
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            sx={{ pt: 1 }}
          >

            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={loading}
            >
              Clear
            </Button>

            <Button
              variant="contained"
              startIcon={<FilterAlt />}
              onClick={handleApply}
              disabled={loading}
            >
              Apply Filters
            </Button>

          </Stack>
        </Grid>

      </Grid>

    </Box>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================

//======================================================
// PropTypes
//======================================================

InventoryReportFilter.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    reportType: PropTypes.string,
    dateFrom: PropTypes.string,
    dateTo: PropTypes.string,
    createdBy: PropTypes.string,
    minValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    maxValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }),

  loading: PropTypes.bool,

  reports: PropTypes.array,

  onFilterChange:
    PropTypes.func,

  onApply:
    PropTypes.func,

  onReset:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

InventoryReportFilter.defaultProps = {
  filters: {
    search: "",
    status: "",
    reportType: "",
    dateFrom: "",
    dateTo: "",
    createdBy: "",
    minValue: "",
    maxValue: "",
  },

  loading: false,

  reports: [],

  onFilterChange: () => {},

  onApply: () => {},

  onReset: () => {},
};

//======================================================
// Export
//======================================================

export default InventoryReportFilter;
import React, {
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import {
  Clear,
  FilterAlt,
} from "@mui/icons-material";

//======================================================
// DashboardReportFilter
//======================================================

const DashboardReportFilter = ({
  filters = {},
  onChange,
  onApply,
  onReset,
  loading = false,
}) => {

  //====================================================
  // Form State
  //====================================================

  const [formData, setFormData] = useState({
    status:
      filters?.status || "",

    reportType:
      filters?.reportType || "",

    dateFrom:
      filters?.dateFrom || "",

    dateTo:
      filters?.dateTo || "",
  });

  //====================================================
  // Sync With Parent Filters
  //====================================================

  useEffect(() => {

    setFormData({
      status:
        filters?.status || "",

      reportType:
        filters?.reportType || "",

      dateFrom:
        filters?.dateFrom || "",

      dateTo:
        filters?.dateTo || "",
    });

  }, [
    filters?.status,
    filters?.reportType,
    filters?.dateFrom,
    filters?.dateTo,
  ]);

  //====================================================
  // Input Change
  //====================================================

  const handleChange = (
    event
  ) => {

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

    if (
      typeof onChange ===
      "function"
    ) {
      onChange({
        ...formData,
        [name]: value,
      });
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
      onApply(formData);
    }

  };

  //====================================================
  // Reset Filters
  //====================================================

  const handleReset = () => {

    const emptyFilters = {
      status: "",
      reportType: "",
      dateFrom: "",
      dateTo: "",
    };

    setFormData(
      emptyFilters
    );

    if (
      typeof onReset ===
      "function"
    ) {
      onReset();
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
      className="dashboard-report-filter"
      sx={{
        width: "100%",
      }}
    >
      <Stack
        spacing={2}
      >

        {/*================================================
            Filter Fields
        =================================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
        >

          {/*==============================================
              Status
          ==============================================*/}

          <FormControl
            fullWidth
            size="small"
            disabled={loading}
          >
            <InputLabel id="dashboard-report-filter-status-label">
              Status
            </InputLabel>

            <Select
              labelId="dashboard-report-filter-status-label"
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
            >

              <MenuItem value="">
                All Statuses
              </MenuItem>

              <MenuItem value="Active">
                Active
              </MenuItem>

              <MenuItem value="Inactive">
                Inactive
              </MenuItem>

              <MenuItem value="Draft">
                Draft
              </MenuItem>

              <MenuItem value="Archived">
                Archived
              </MenuItem>

            </Select>
          </FormControl>

          {/*==============================================
              Report Type
          ==============================================*/}

          <FormControl
            fullWidth
            size="small"
            disabled={loading}
          >
            <InputLabel id="dashboard-report-filter-type-label">
              Report Type
            </InputLabel>

            <Select
              labelId="dashboard-report-filter-type-label"
              name="reportType"
              value={formData.reportType}
              label="Report Type"
              onChange={handleChange}
            >

              <MenuItem value="">
                All Report Types
              </MenuItem>

              <MenuItem value="Dashboard">
                Dashboard
              </MenuItem>

              <MenuItem value="Sales">
                Sales
              </MenuItem>

              <MenuItem value="Orders">
                Orders
              </MenuItem>

              <MenuItem value="Customers">
                Customers
              </MenuItem>

              <MenuItem value="Products">
                Products
              </MenuItem>

              <MenuItem value="Inventory">
                Inventory
              </MenuItem>

              <MenuItem value="Finance">
                Finance
              </MenuItem>

            </Select>
          </FormControl>

        </Stack>

        {/*================================================
            Date Filters
        =================================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >

          {/*==============================================
              Date From
          ==============================================*/}

          <TextField
            fullWidth
            size="small"
            type="date"
            label="Date From"
            name="dateFrom"
            value={formData.dateFrom}
            onChange={handleChange}
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/*==============================================
              Date To
          ==============================================*/}

          <TextField
            fullWidth
            size="small"
            type="date"
            label="Date To"
            name="dateTo"
            value={formData.dateTo}
            onChange={handleChange}
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
          />

        </Stack>

        {/*================================================
            Filter Actions
        =================================================*/}

        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="flex-end"
          flexWrap="wrap"
        >

          {/*==============================================
              Reset
          ==============================================*/}

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Clear />}
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>

          {/*==============================================
              Apply
          ==============================================*/}

          <Button
            variant="contained"
            color="primary"
            startIcon={<FilterAlt />}
            onClick={handleApply}
            disabled={loading}
          >
            Apply Filters
          </Button>

        </Stack>

      </Stack>
    </Box>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
  //====================================================
  // JSX
  //====================================================

  return (
    <Box
      className="dashboard-report-filter"
      sx={{
        width: "100%",
      }}
    >
      <Stack spacing={2}>

        {/*================================================
            Status + Report Type
        =================================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >

          {/*==============================================
              Status
          ==============================================*/}

          <FormControl
            fullWidth
            size="small"
            disabled={loading}
          >
            <InputLabel id="dashboard-report-filter-status-label">
              Status
            </InputLabel>

            <Select
              labelId="dashboard-report-filter-status-label"
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="">
                All Statuses
              </MenuItem>

              <MenuItem value="Active">
                Active
              </MenuItem>

              <MenuItem value="Inactive">
                Inactive
              </MenuItem>

              <MenuItem value="Draft">
                Draft
              </MenuItem>

              <MenuItem value="Archived">
                Archived
              </MenuItem>
            </Select>
          </FormControl>

          {/*==============================================
              Report Type
          ==============================================*/}

          <FormControl
            fullWidth
            size="small"
            disabled={loading}
          >
            <InputLabel id="dashboard-report-filter-type-label">
              Report Type
            </InputLabel>

            <Select
              labelId="dashboard-report-filter-type-label"
              name="reportType"
              value={formData.reportType}
              label="Report Type"
              onChange={handleChange}
            >
              <MenuItem value="">
                All Report Types
              </MenuItem>

              <MenuItem value="Dashboard">
                Dashboard
              </MenuItem>

              <MenuItem value="Sales">
                Sales
              </MenuItem>

              <MenuItem value="Orders">
                Orders
              </MenuItem>

              <MenuItem value="Customers">
                Customers
              </MenuItem>

              <MenuItem value="Products">
                Products
              </MenuItem>

              <MenuItem value="Inventory">
                Inventory
              </MenuItem>

              <MenuItem value="Finance">
                Finance
              </MenuItem>
            </Select>
          </FormControl>

        </Stack>

        {/*================================================
            Date Range
        =================================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >

          <TextField
            fullWidth
            size="small"
            type="date"
            label="Date From"
            name="dateFrom"
            value={formData.dateFrom}
            onChange={handleChange}
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            size="small"
            type="date"
            label="Date To"
            name="dateTo"
            value={formData.dateTo}
            onChange={handleChange}
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
          />

        </Stack>

        {/*================================================
            Actions
        =================================================*/}

        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="flex-end"
          flexWrap="wrap"
        >

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Clear />}
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<FilterAlt />}
            onClick={handleApply}
            disabled={loading}
          >
            Apply Filters
          </Button>

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

DashboardReportFilter.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string,
    reportType: PropTypes.string,
    dateFrom: PropTypes.string,
    dateTo: PropTypes.string,
  }),

  onChange: PropTypes.func,

  onApply: PropTypes.func,

  onReset: PropTypes.func,

  loading: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

DashboardReportFilter.defaultProps = {
  filters: {},

  onChange: () => {},

  onApply: () => {},

  onReset: () => {},

  loading: false,
};

//======================================================
// Export
//======================================================

export default DashboardReportFilter;
import React, {
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";

import {
  Clear,
  Search,
} from "@mui/icons-material";

//======================================================
// DashboardReportSearch
//======================================================

const DashboardReportSearch = ({
  filters = {},
  onChange,
  onReset,
  placeholder = "Search dashboard reports...",
  debounceTime = 300,
}) => {

  //====================================================
  // Search Value
  //====================================================

  const [searchValue, setSearchValue] =
    useState(
      filters?.search ||
      filters?.searchTerm ||
      ""
    );

  //====================================================
  // Sync With Parent Filters
  //====================================================

  useEffect(() => {

    const parentSearch =
      filters?.search ||
      filters?.searchTerm ||
      "";

    setSearchValue(parentSearch);

  }, [
    filters?.search,
    filters?.searchTerm,
  ]);

  //====================================================
  // Debounced Search
  //====================================================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        if (
          typeof onChange !== "function"
        ) {
          return;
        }

        onChange({
          search: searchValue,
        });

      }, debounceTime);

    return () => {
      clearTimeout(timer);
    };

  }, [
    searchValue,
    debounceTime,
    onChange,
  ]);

  //====================================================
  // Input Change
  //====================================================

  const handleChange = (
    event
  ) => {

    setSearchValue(
      event.target.value
    );

  };

  //====================================================
  // Clear Search
  //====================================================

  const handleClear = () => {

    setSearchValue("");

    if (
      typeof onChange === "function"
    ) {
      onChange({
        search: "",
      });
    }

  };

  //====================================================
  // Reset All Filters
  //====================================================

  const handleReset = () => {

    setSearchValue("");

    if (
      typeof onReset === "function"
    ) {
      onReset();

      return;
    }

    if (
      typeof onChange === "function"
    ) {
      onChange({
        search: "",
      });
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
      className="dashboard-report-search"
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >

      {/*================================================
          Search Field
      =================================================*/}

      <TextField
        fullWidth
        size="small"
        value={searchValue}
        onChange={handleChange}
        placeholder={placeholder}
        variant="outlined"
        label="Search"
        autoComplete="off"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search
                fontSize="small"
                color="action"
              />
            </InputAdornment>
          ),

          endAdornment: searchValue ? (
            <InputAdornment position="end">
              <Tooltip title="Clear search">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  edge="end"
                  aria-label="Clear search"
                >
                  <Clear fontSize="small" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ) : null,
        }}
      />

      {/*================================================
          Reset Filters
      =================================================*/}

      {(searchValue ||
        filters?.status ||
        filters?.reportType ||
        filters?.dateFrom ||
        filters?.dateTo) && (
        <Tooltip title="Reset filters">
          <IconButton
            onClick={handleReset}
            color="primary"
            aria-label="Reset filters"
            sx={{
              flexShrink: 0,
            }}
          >
            <Clear />
          </IconButton>
        </Tooltip>
      )}

    </Box>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

DashboardReportSearch.propTypes = {
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

  onChange: PropTypes.func,

  onReset: PropTypes.func,

  placeholder: PropTypes.string,

  debounceTime: PropTypes.number,
};

//======================================================
// Default Props
//======================================================

DashboardReportSearch.defaultProps = {
  filters: {},

  onChange: () => {},

  onReset: () => {},

  placeholder:
    "Search dashboard reports...",

  debounceTime: 300,
};

//======================================================
// Export
//======================================================

export default DashboardReportSearch;
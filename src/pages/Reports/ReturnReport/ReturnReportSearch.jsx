
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Clear,
  Search,
} from "@mui/icons-material";

import {
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";

//======================================================
// ReturnReportSearch
//======================================================

const ReturnReportSearch = ({
  value = "",
  loading = false,
  placeholder = "Search return reports...",
  onSearch,
  debounceDelay = 300,
}) => {
  //====================================================
  // Local Search State
  //====================================================

  const [searchValue, setSearchValue] =
    useState(value || "");

  //====================================================
  // Sync External Value
  //====================================================

  useEffect(() => {
    setSearchValue(value || "");
  }, [value]);

  //====================================================
  // Debounced Search
  //====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchValue.trim());
      }
    }, debounceDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [
    searchValue,
    debounceDelay,
    onSearch,
  ]);

  //====================================================
  // Input Handler
  //====================================================

  const handleChange = useCallback(
    (event) => {
      setSearchValue(
        event.target.value
      );
    },
    []
  );

  //====================================================
  // Clear Handler
  //====================================================

  const handleClear = useCallback(() => {
    setSearchValue("");

    if (onSearch) {
      onSearch("");
    }
  }, [onSearch]);
  //====================================================
  // Render
  //====================================================

  return (
    <TextField
      className="return-report-search"
      fullWidth
      size="small"
      value={searchValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={loading}
      aria-label="Search return reports"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search fontSize="small" />
          </InputAdornment>
        ),

        endAdornment: searchValue ? (
          <InputAdornment position="end">
            <Tooltip title="Clear search">
              <span>
                <IconButton
                  size="small"
                  onClick={handleClear}
                  disabled={loading}
                  aria-label="Clear search"
                >
                  <Clear fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

//======================================================
// PropTypes
//======================================================

ReturnReportSearch.propTypes = {
  value: PropTypes.string,

  loading: PropTypes.bool,

  placeholder:
    PropTypes.string,

  onSearch:
    PropTypes.func,

  debounceDelay:
    PropTypes.number,
};

//======================================================
// Default Props
//======================================================

ReturnReportSearch.defaultProps = {
  value: "",

  loading: false,

  placeholder:
    "Search return reports...",

  onSearch: () => {},

  debounceDelay: 300,
};

//======================================================
// Export
//======================================================

export default ReturnReportSearch;




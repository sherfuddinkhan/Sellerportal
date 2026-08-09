import React, {
  useCallback,
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
// LowStockReportSearch
//======================================================

const LowStockReportSearch = ({
  value = "",
  onChange,
  onSearch,
  loading = false,
  placeholder = "Search product, SKU, category, warehouse...",
}) => {

  //====================================================
  // Local Search State
  //====================================================

  const [searchValue, setSearchValue] =
    useState(value ?? "");

  //====================================================
  // Sync External Value
  //====================================================

  useEffect(() => {
    setSearchValue(
      value ?? ""
    );
  }, [value]);

  //====================================================
  // Handle Input Change
  //====================================================

  const handleChange =
    useCallback(
      (event) => {
        const nextValue =
          event.target.value;

        setSearchValue(
          nextValue
        );

        if (
          typeof onChange ===
          "function"
        ) {
          onChange(
            nextValue
          );
        }
      },
      [onChange]
    );

  //====================================================
  // Execute Search
  //====================================================

  const handleSearch =
    useCallback(() => {
      if (
        typeof onSearch ===
        "function"
      ) {
        onSearch(
          searchValue.trim()
        );
      }
    }, [
      onSearch,
      searchValue,
    ]);

  //====================================================
  // Clear Search
  //====================================================

  const handleClear =
    useCallback(() => {
      setSearchValue("");

      if (
        typeof onChange ===
        "function"
      ) {
        onChange("");
      }

      if (
        typeof onSearch ===
        "function"
      ) {
        onSearch("");
      }
    }, [
      onChange,
      onSearch,
    ]);

  //====================================================
  // Keyboard Search
  //====================================================

  const handleKeyDown =
    useCallback(
      (event) => {
        if (
          event.key ===
          "Enter"
        ) {
          event.preventDefault();

          handleSearch();
        }
      },
      [handleSearch]
    );

  //====================================================
  // Part 1A Ends Here
  //====================================================
  //======================================================
// JSX
//======================================================

  return (
    <Box
      className="low-stock-report-search"
      sx={{
        width: "100%",
        mb: 2,
      }}
    >
      <TextField
        fullWidth
        size="small"
        value={searchValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder={placeholder}
        label="Search Low Stock Reports"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Tooltip title="Search">
                <IconButton
                  size="small"
                  onClick={handleSearch}
                  disabled={
                    loading ||
                    !searchValue.trim()
                  }
                  edge="start"
                  aria-label="search"
                >
                  <Search fontSize="small" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),

          endAdornment:
            searchValue ? (
              <InputAdornment position="end">
                <Tooltip title="Clear search">
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    disabled={loading}
                    aria-label="clear search"
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : null,
        }}
      />
    </Box>
  );

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

LowStockReportSearch.propTypes = {
  value: PropTypes.string,

  onChange: PropTypes.func,

  onSearch: PropTypes.func,

  loading: PropTypes.bool,

  placeholder: PropTypes.string,
};

//======================================================
// Default Props
//======================================================

LowStockReportSearch.defaultProps = {
  value: "",

  onChange: () => {},

  onSearch: () => {},

  loading: false,

  placeholder:
    "Search product, SKU, category, warehouse...",
};

//======================================================
// Export
//======================================================
}
export default LowStockReportSearch;
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
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
// MarketplaceReportSearch
//======================================================

const MarketplaceReportSearch = ({
  value = "",
  placeholder = "Search marketplace reports...",
  loading = false,
  disabled = false,
  onChange,
  onSearch,
  onClear,
}) => {

  //====================================================
  // Local Search State
  //====================================================

  const [searchValue, setSearchValue] =
    useState(
      value ?? ""
    );

  //====================================================
  // Sync External Value
  //====================================================

  useEffect(() => {
    setSearchValue(
      value ?? ""
    );
  }, [value]);

  //====================================================
  // Handle Change
  //====================================================

  const handleChange =
    useCallback(
      (event) => {
        const nextValue =
          event?.target?.value ??
          "";

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
  // Handle Search
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
  // Handle Clear
  //====================================================

  const handleClear =
    useCallback(() => {
      setSearchValue("");

      if (
        typeof onClear ===
        "function"
      ) {
        onClear();
        return;
      }

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
      onClear,
      onChange,
      onSearch,
    ]);

  //====================================================
  // Handle Enter
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

        if (
          event.key ===
          "Escape"
        ) {
          event.preventDefault();
          handleClear();
        }
      },
      [
        handleSearch,
        handleClear,
      ]
    );

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  const isDisabled =
    loading || disabled;

  return (
    <TextField
      fullWidth
      size="small"
      value={searchValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={isDisabled}
      autoComplete="off"
      className="marketplace-report-search"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Tooltip title="Search">
              <IconButton
                edge="start"
                size="small"
                onClick={
                  handleSearch
                }
                disabled={
                  isDisabled
                }
                aria-label="Search marketplace reports"
              >
                <Search
                  fontSize="small"
                />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),

        endAdornment:
          searchValue ? (
            <InputAdornment position="end">
              <Tooltip title="Clear search">
                <IconButton
                  edge="end"
                  size="small"
                  onClick={
                    handleClear
                  }
                  disabled={
                    isDisabled
                  }
                  aria-label="Clear marketplace report search"
                >
                  <Clear
                    fontSize="small"
                  />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ) : null,
      }}
      inputProps={{
        "aria-label":
          "Search marketplace reports",
      }}
    />
  );

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

MarketplaceReportSearch.propTypes = {
  value: PropTypes.string,

  placeholder: PropTypes.string,

  loading: PropTypes.bool,

  disabled: PropTypes.bool,

  onChange: PropTypes.func,

  onSearch: PropTypes.func,

  onClear: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

MarketplaceReportSearch.defaultProps = {
  value: "",

  placeholder:
    "Search marketplace reports...",

  loading: false,

  disabled: false,

  onChange: () => {},

  onSearch: () => {},

  onClear: null,
};

//======================================================
// Export
//======================================================
}
export default MarketplaceReportSearch;
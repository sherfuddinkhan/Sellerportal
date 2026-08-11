//======================================================
// StockMovementReportSearch.jsx
// Part 1A
//======================================================

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

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

//======================================================
// StockMovementReportSearch
//======================================================

const StockMovementReportSearch = ({
  value = "",
  searchTerm = "",
  onChange,
  onSearch,
  disabled = false,
  placeholder = "Search stock movements...",
  label = "Search Stock Movement",
  fullWidth = true,
  size = "small",
  clearable = true,
  debounce = false,
  debounceDelay = 300,
}) => {
  //====================================================
  // Internal Value
  //====================================================

  const initialValue =
    value !== undefined &&
    value !== null
      ? value
      : searchTerm;

  const [inputValue, setInputValue] =
    useState(
      initialValue || ""
    );

  //====================================================
  // Sync External Value
  //====================================================

  useEffect(() => {
    const externalValue =
      value !== undefined &&
      value !== null
        ? value
        : searchTerm;

    setInputValue(
      externalValue || ""
    );
  }, [
    value,
    searchTerm,
  ]);

  //====================================================
  // Execute Search
  //====================================================

  const executeSearch =
    useCallback(
      (nextValue) => {
        const cleanValue =
          String(
            nextValue ?? ""
          );

        if (onSearch) {
          onSearch(
            cleanValue
          );

          return;
        }

        if (onChange) {
          onChange(
            cleanValue
          );
        }
      },
      [
        onSearch,
        onChange,
      ]
    );

  //====================================================
  // Debounced Search
  //====================================================

  useEffect(() => {
    if (
      !debounce ||
      disabled
    ) {
      return undefined;
    }

    const timer =
      setTimeout(() => {
        executeSearch(
          inputValue
        );
      }, debounceDelay);

    return () => {
      clearTimeout(
        timer
      );
    };
  }, [
    inputValue,
    debounce,
    debounceDelay,
    disabled,
    executeSearch,
  ]);

  //====================================================
  // Input Change
  //====================================================

  const handleChange =
    useCallback(
      (event) => {
        const nextValue =
          event.target.value;

        setInputValue(
          nextValue
        );

        if (
          !debounce &&
          onChange
        ) {
          onChange(
            nextValue
          );
        }
      },
      [
        debounce,
        onChange,
      ]
    );

  //====================================================
  // Search Button
  //====================================================

  const handleSearch =
    useCallback(() => {
      executeSearch(
        inputValue
      );
    }, [
      executeSearch,
      inputValue,
    ]);

  //====================================================
  // Clear Search
  //====================================================

  const handleClear =
    useCallback(() => {
      setInputValue("");

      if (onChange) {
        onChange("");
      }

      if (onSearch) {
        onSearch("");
      }
    }, [
      onChange,
      onSearch,
    ]);

  //====================================================
  // Enter Key
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
            "Escape" &&
          clearable &&
          inputValue
        ) {
          handleClear();
        }
      },
      [
        handleSearch,
        handleClear,
        clearable,
        inputValue,
      ]
    );

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="stock-movement-report__search"
      sx={{
        width: fullWidth
          ? "100%"
          : "auto",
      }}
    >
      <TextField
        fullWidth={fullWidth}
        size={size}
        label={label}
        placeholder={placeholder}
        value={inputValue}
        onChange={
          handleChange
        }
        onKeyDown={
          handleKeyDown
        }
        disabled={disabled}
        autoComplete="off"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                fontSize="small"
                color={
                  disabled
                    ? "disabled"
                    : "action"
                }
              />
            </InputAdornment>
          ),

          endAdornment: (
            <InputAdornment position="end">

              {/*========================================
                  Clear Button
              =========================================*/}

              {clearable &&
                inputValue && (
                  <Tooltip
                    title="Clear search"
                  >
                    <IconButton
                      size="small"
                      onClick={
                        handleClear
                      }
                      disabled={
                        disabled
                      }
                      edge="end"
                      aria-label="Clear search"
                    >
                      <ClearIcon
                        fontSize="small"
                      />
                    </IconButton>
                  </Tooltip>
                )}

              {/*========================================
                  Search Button
              =========================================*/}

              <Tooltip
                title="Search"
              >
                <span>
                  <IconButton
                    size="small"
                    onClick={
                      handleSearch
                    }
                    disabled={
                      disabled
                    }
                    edge="end"
                    aria-label="Search stock movement"
                  >
                    <SearchIcon
                      fontSize="small"
                    />
                  </IconButton>
                </span>
              </Tooltip>

            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

StockMovementReportSearch.propTypes = {
  value:
    PropTypes.string,

  searchTerm:
    PropTypes.string,

  onChange:
    PropTypes.func,

  onSearch:
    PropTypes.func,

  disabled:
    PropTypes.bool,

  placeholder:
    PropTypes.string,

  label:
    PropTypes.string,

  fullWidth:
    PropTypes.bool,

  size:
    PropTypes.oneOf([
      "small",
      "medium",
    ]),

  clearable:
    PropTypes.bool,

  debounce:
    PropTypes.bool,

  debounceDelay:
    PropTypes.number,
};

//======================================================
// Default Props
//======================================================

StockMovementReportSearch.defaultProps = {
  value: "",
  searchTerm: "",
  onChange: undefined,
  onSearch: undefined,
  disabled: false,
  placeholder:
    "Search stock movements...",
  label:
    "Search Stock Movement",
  fullWidth: true,
  size: "small",
  clearable: true,
  debounce: false,
  debounceDelay: 300,
};

//======================================================
// Export
//======================================================

export default StockMovementReportSearch;

//======================================================
// Part 1A Ends Here
//======================================================
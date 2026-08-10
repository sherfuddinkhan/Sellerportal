
//======================================================
// StockLedgerReportSearch.jsx
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

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

//======================================================
// StockLedgerReportSearch
//======================================================

const StockLedgerReportSearch = ({
  value = "",
  searchTerm = "",
  placeholder = "Search stock ledger...",
  label = "Search",
  disabled = false,
  fullWidth = true,
  onSearch,
  onChange,
}) => {
  //====================================================
  // Local Search State
  //====================================================

  const [localValue, setLocalValue] =
    useState(
      value || searchTerm || ""
    );

  //====================================================
  // Sync External Value
  //====================================================

  useEffect(() => {
    setLocalValue(
      value ?? searchTerm ?? ""
    );
  }, [value, searchTerm]);

  //====================================================
  // Search Handler
  //====================================================

  const handleSearch = useCallback(
    (nextValue) => {
      const normalizedValue =
        typeof nextValue ===
        "string"
          ? nextValue
          : "";

      setLocalValue(
        normalizedValue
      );

      if (
        typeof onSearch ===
        "function"
      ) {
        onSearch(
          normalizedValue
        );
      }
    },
    [onSearch]
  );

  //====================================================
  // Change Handler
  //====================================================

  const handleChange = useCallback(
    (event) => {
      const nextValue =
        event?.target?.value ??
        "";

      setLocalValue(nextValue);

      if (
        typeof onChange ===
        "function"
      ) {
        onChange(event);
        return;
      }

      handleSearch(nextValue);
    },
    [onChange, handleSearch]
  );

  //====================================================
  // Clear Handler
  //====================================================

  const handleClear = useCallback(() => {
    setLocalValue("");

    if (
      typeof onSearch ===
      "function"
    ) {
      onSearch("");
    }

    if (
      typeof onChange ===
      "function"
    ) {
      onChange({
        target: {
          name: "search",
          value: "",
        },
      });
    }
  }, [onSearch, onChange]);

  //====================================================
  // Keyboard Handler
  //====================================================

  const handleKeyDown = useCallback(
    (event) => {
      if (
        event.key === "Enter"
      ) {
        event.preventDefault();

        handleSearch(
          localValue
        );
      }

      if (
        event.key === "Escape"
      ) {
        event.preventDefault();

        handleClear();
      }
    },
    [
      localValue,
      handleSearch,
      handleClear,
    ]
  );

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="stock-ledger-report-search"
      sx={{
        width: fullWidth
          ? "100%"
          : "auto",
        boxSizing: "border-box",
      }}
    >
      <TextField
        fullWidth={fullWidth}
        label={label}
        placeholder={placeholder}
        value={localValue}
        onChange={
          handleChange
        }
        onKeyDown={
          handleKeyDown
        }
        disabled={disabled}
        size="small"
        autoComplete="off"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon
                fontSize="small"
                color="action"
              />
            </InputAdornment>
          ),

          endAdornment:
            localValue ? (
              <InputAdornment position="end">
                <Tooltip title="Clear search">
                  <span>
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
                      <ClearOutlinedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </InputAdornment>
            ) : null,
        }}
      />
    </Box>
  );
};
//======================================================
// PropTypes
//======================================================

StockLedgerReportSearch.propTypes = {
  value:
    PropTypes.string,

  searchTerm:
    PropTypes.string,

  placeholder:
    PropTypes.string,

  label:
    PropTypes.string,

  disabled:
    PropTypes.bool,

  fullWidth:
    PropTypes.bool,

  onSearch:
    PropTypes.func,

  onChange:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

StockLedgerReportSearch.defaultProps = {
  value: "",

  searchTerm: "",

  placeholder:
    "Search stock ledger...",

  label: "Search",

  disabled: false,

  fullWidth: true,

  onSearch: null,

  onChange: null,
};

//======================================================
// Export
//======================================================

export default StockLedgerReportSearch;

